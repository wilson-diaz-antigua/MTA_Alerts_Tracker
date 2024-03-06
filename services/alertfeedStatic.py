import copy
import csv
import json
import re
import sys
from collections import OrderedDict, defaultdict
from datetime import datetime as dt
from functools import lru_cache
from pprint import pprint

import requests
from sqlmodel import Session, select

from backend.database import engine
from backend.models import Data, Date
from backend.route import app
from util.utils import convert_to_datetime, dateparsing, stopid

service_status = {
    "Delays": "delays.png",
    "Planned - Part Suspended": "suspended.png",
    "Planned - Stations Skipped": "skipped.png",
    "Station Notice": "information.png",
    "Reduced Service": "reduced.png",
}


# @lru_cache(maxsize=None)
def process_alert_feed() -> dict:
    """
    Process the alert feed and extract relevant information about subway alerts.

    Returns:
        dict: A dictionary containing information about affected stops and alerts.

         'stop name': {'alertInfo': {'alertType': str,
                                    'createdAt': datetime,
                                    'updatedAt': datetime},
                        'date': {'date': [datetime],
                                'time': [datetime],
                                'dateText': str },
                        'direction': str,
                        'heading': str,
                        'description': str
                        'line':  str }



    """

    headers = {"x-api-key": "8ogTVWVBY55OObVPvYpmu4zQAjmlHl3Q8HmQ1BpV"}
    Response = requests.get(
        "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/camsys%2Fsubway-alerts.json",
        headers=headers,
        timeout=10,
    )
    alert_feed = json.loads(Response.content)

    # Iterate over each entity in the alert feed
    info = {
        "line": None,
        "alertInfo": [],
    }
    affected_stops = defaultdict()
    with open("stops.csv", encoding="utf-8") as csvfile:
        reader = csv.DictReader(csvfile)
        affected_stops.update(
            {col["stop_id"]: info for col in reader if col["stop_id"]}
        )

    # Create a new dictionary with deep copies of the values in lineStops
    line_stops = {
        key: copy.deepcopy(value) for key, value in affected_stops.items() if value
    }

    alert_info = []
    for entity in alert_feed["entity"]:
        # Extract the informed entity from the alert
        informed_ent = entity.get("alert", {}).get("informed_entity", {})

        # Check if the route_id of the first informed entity is "1"
        if informed_ent[0].get("route_id", None):
            # Extract the alert and alert type
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
            # Extract alert information
            alert_info = {
                "alertType": alert_type.get("alert_type", {}),
                "createdAt": alert_type.get("created_at", {}),
                "updatedAt": alert_type.get("updated_at", {}),
                "date": date,
                "direction": None,
                "heading": None,
                "description": None,
            }

            # Iterate over each informed entity
            for info in informed_ent:
                # Extract the header and description text
                head = alert.get("header_text", {}).get("translation", {})
                descr = alert.get("description_text", {}).get("translation", {})

                # Check if the stop_id is not None
                if info.get("stop_id", None) is not None:
                    # Extract the stop_id
                    stop_id = info.get("stop_id", None)

                    direction = re.search(
                        r"(downtown|uptown)|(?!(the|a|an))\b(\w+\s?)(\w*-?)bound",
                        heading,
                    )
                    # Update the lineStops dictionary
                    line_stops[stop_id]["line"] = informed_ent[0].get("route_id")
                    heading = head[0]["text"]

                    # Search for "downtown" or "uptown" in the heading
                    alert_info["heading"] = head[0]["text"]
                    alert_info["direction"] = direction.group(0) if direction else None
                    alert_info["description"] = descr[0]["text"] if descr else ""

                    line_stops[stop_id]["alertInfo"].append(alert_info)

                # Extract the heading and convert it to lowercase
    return line_stops
    #  'stop name': {'alertInfo': {'alertType': str,
    #                             'createdAt': datetime,
    #                             'updatedAt': datetime},
    #                 'date': {'date': [datetime],
    #                         'time': [datetime],
    #                         'dateText': str },
    #                 'direction': str,
    #                 'heading': str,
    #                 'description': str
    #                 'line':  str }


def convert_dates(dic):
    # Iterate over each stop in affectedStops
    for stop in dic.values():
        for alert in stop["alertInfo"]:
            # Parse the date
            try:

                alert["date"] = dateparsing(alert["date"])
            except AttributeError:
                pass

            # Convert the createdAt and updatedAt timestamps to datetime objects
            alert["createdAt"] = convert_to_datetime(alert["createdAt"])
            alert["updatedAt"] = convert_to_datetime(alert["updatedAt"])
    return dic


alerts = process_alert_feed()


converted_alerts = convert_dates(alerts)
pprint(converted_alerts)


def add_alerts_to_db():
    alerts = process_alert_feed()

    for key, values in alerts.items():
        data = Data(
            stop=str(key),
            alert_type=values["alertInfo"]["alertType"],
            created_at=values["alertInfo"]["createdAt"],
            updated_at=values["alertInfo"]["updatedAt"],
            direction=values["direction"],
            heading=values["heading"],
            line=values["line"],
        )
        dates = Date(
            data_id=data.stop,
            # date=values.get("date", {}).get("date", []),
            dateText=values.get("alertInfo", {}).get("date", {}).get("dateText", ""),
        )
    with Session(engine) as session:
        # statement = select(Data).where(Data.stop == key)
        # res = session.exec(statement)
        # if not res.first():

        session.add_all([data, dates])
        session.commit()

        session.refresh(data)


# pprint(
#     [
#         x
#         for x in line_stops.values()
#         if not x["alertInfo"]["alertType"].lower().startswith("planned")
#     ]
# )
