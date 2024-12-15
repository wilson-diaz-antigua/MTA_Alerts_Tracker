import copy
import csv
import json
import os
import re
import sys
from collections import OrderedDict, defaultdict
from datetime import datetime as dt
from functools import lru_cache
from pathlib import Path
from pprint import pprint as pp

import requests
from dotenv import load_dotenv
from sqlmodel import Session, select

# from backend.route import server
from util.utils import convert_to_datetime, dateparsing, parseDates, stopid

from .database import engine
from .models import Alerts, Stop, StopSchema

stopsPath = (
    Path(__file__).parent.parent.parent / "alertsDisplayApp" / "util" / "stops.csv"
)
load_dotenv(".env.MTA")
MTA_API_KEY = os.getenv("MTA_API_KEY")
print(MTA_API_KEY)
service_status = {
    "Delays": "delays.png",
    "Planned - Part Suspended": "suspended.png",
    "Planned - Stations Skipped": "skipped.png",
    "Station Notice": "information.png",
    "Reduced Service": "reduced.png",
}


def process_alert_feed() -> dict:
    """
    Process the alert feed and extract relevant information about subway alerts.

    Returns:
        dict: A dictionary containing information about affected stops and alerts.

         'stop name': { 'line':  str
                        'alertInfo': {'alertType': str,
                                    'createdAt': datetime,
                                    'updatedAt': datetime},
                                    'dates': {'date': [datetime],
                                            'time': [datetime],
                                            'dateText': str },
                                    'direction': str,
                                    'heading': str,
                                    'description': str
                         }



    """

    headers = {"x-api-key": MTA_API_KEY}
    Response = requests.get(
        "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/camsys%2Fsubway-alerts.json",
        headers=headers,
        timeout=10,
    )
    alert_feed = json.loads(Response.content)
    info = defaultdict()
    info = {
        "alertInfo": [],
    }
    affected_stops = defaultdict()
    with stopsPath.open() as csvfile:
        reader = csv.DictReader(csvfile)
        affected_stops.update(
            {
                col["stop_id"]: info
                for col in reader
                if col["stop_id"] and col["stop_id"][-1].isdigit()
            }
        )
        affected_stops["None"] = info
    line_stops = defaultdict()
    line_stops = {
        key: copy.deepcopy(value) for key, value in affected_stops.items() if value
    }

    alert_info = []
    for entity in alert_feed["entity"]:

        informed_ent = entity.get("alert", {}).get("informed_entity", {})

        if informed_ent[0].get("route_id", None):

            alert = entity.get("alert", {})
            alert_type = alert.get("transit_realtime.mercury_alert", {})
            translation = alert_type.get("human_readable_active_period", {}).get(
                "translation", {}
            )
            date = (
                translation[0].get("text", {})
                if isinstance(translation, list)
                else translation.get("text", {})
            )
            alert_info = defaultdict()
            alert_info = {
                "alertType": alert_type.get("alert_type", {}),
                "createdAt": alert_type.get("created_at", {}),
                "updatedAt": alert_type.get("updated_at", {}),
                "date": date,
                "direction": None,
                "heading": None,
                "description": None,
                "line": None,
            }
            alert_info["line"] = informed_ent[0].get("route_id", None)

            for info in informed_ent:

                head = alert.get("header_text", {}).get("translation", {})
                descr = alert.get("description_text", {}).get("translation", {})

                stop_id = info.get("stop_id", None)
                heading = head[0]["text"]
                direction = re.search(
                    r"(downtown|uptown)|(?!(the|a|an))\b(\w+\s?)(\w*-?)bound",
                    heading,
                )

                alert_info["heading"] = head[0]["text"]
                alert_info["direction"] = direction.group(0) if direction else None
                alert_info["description"] = descr[0]["text"] if descr else ""

                if info.get("stop_id", None) is not None:

                    line_stops[stop_id]["alertInfo"].append(alert_info)
                else:
                    line_stops["None"]["alertInfo"].append(alert_info)

    return line_stops


def convert_dates(dic):

    for stop in dic.values():
        for alert in stop["alertInfo"]:

            try:

                alert["date"] = dateparsing(alert["date"])
            except AttributeError:
                pass

            alert["createdAt"] = convert_to_datetime(alert["createdAt"])
            alert["updatedAt"] = convert_to_datetime(alert["updatedAt"])
    return dic


# def seen_stops():
#     with Session(engine) as session:

#         statement = select(Stop)
#         result = session.exec(statement)
#         alertType = result.all()

#         # Code from the previous example omitted 👈
#         return {x.stop for x in alertType}
#         # return [f"{stopid(x.stop)}:{x.alert_type} : {x.direction}" for x in alertType]
#         # pprint(
#         #     [
#         #         f"""{stopid(x.stop)} : {x.direction} : {x.alert_type}"""
#         #         for x in alertType
#         #     ]
#         # )


def add_alerts_to_db():
    alert_dict = process_alert_feed()

    with Session(engine) as session:
        for key, values in alert_dict.items():

            stop = Stop(
                stop=str(key),
            )
            session.merge(stop)
            session.commit()
            session.refresh(stop)

            for alert in values["alertInfo"]:
                alerts = Alerts(
                    alert_type=alert["alertType"],
                    created_at=alert["createdAt"],
                    updated_at=alert["updatedAt"],
                    direction=alert["direction"],
                    heading=alert["heading"],
                    route=str(alert["line"]),
                    dateText=alert.get("date", {}),
                )

                # dates = DateRanges(
                #     begin_date=parseDates(alert.get("date", {}))["start_date"][0],
                #     end_date=parseDates(alert.get("date", {}))["end_date"][0],
                # )

                table = select(Alerts).where(
                    Alerts.alert_type == alerts.alert_type,
                    Alerts.route == alerts.route,
                    Alerts.direction == alerts.direction,
                    Alerts.heading == alerts.heading,
                    Alerts.created_at == alerts.created_at,
                    Alerts.updated_at == alerts.updated_at,
                    Alerts.parsedDate == alerts.parsedDate,
                    alerts.stop_id == stop.id,
                )
                instance = session.exec(table).first()
                if not instance:
                    # alerts.stops = stop
                    # dates.stop_id = stop.id
                    session.add(alerts)
                    # session.add(dates)

                    session.commit()
                    session.refresh(alerts)
                    # session.refresh(dates)


add_alerts_to_db()


def get_alerts():
    stopSchema = StopSchema()
    with Session(engine) as session:
        stops = session.exec(select(Stop)).all()
        alerts = session.exec(select(Alerts)).all()

        # for x in stopSchema.dump(stops, many=True):
        #     for y in alertSchema.dump(alerts, many=True):
        #         if x["id"] == y["stop_id"]:

        for x in stops[8:10]:
            print(x.stop, [y.alert_type for y in x.alert])

        return stopSchema.dump(stops)


# pp(get_alerts())
