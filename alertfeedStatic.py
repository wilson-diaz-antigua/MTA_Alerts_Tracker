import copy
import csv
import json
import re
from collections import OrderedDict, defaultdict
from datetime import datetime as dt
from functools import lru_cache
from pprint import pprint

import requests

from util.utils import convert_to_datetime, dateparsing, stopid

service_status = {
    "Delays": "delays.png",
    "Planned - Part Suspended": "suspended.png",
    "Planned - Stations Skipped": "skipped.png",
    "Station Notice": "information.png",
    "Reduced Service": "reduced.png",
}


@lru_cache(maxsize=None)
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

    line_stops = OrderedDict()
    headers = {"x-api-key": "8ogTVWVBY55OObVPvYpmu4zQAjmlHl3Q8HmQ1BpV"}
    Response = requests.get(
        "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/camsys%2Fsubway-alerts.json",
        headers=headers,
        timeout=10,
    )
    alert_feed = json.loads(Response.content)

    with open("stops.csv", encoding="utf-8") as csvfile:
        reader = csv.DictReader(csvfile)
        line_stops.update({col["stop_id"]: None for col in reader if col["stop_id"]})

    # Iterate over each entity in the alert feed
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

                    # Update the lineStops dictionary
                    line_stops[stop_id] = {
                        "line": informed_ent[0].get("route_id"),
                        "alertInfo": alert_info,
                        "heading": head[0]["text"],
                        "description": descr[0]["text"] if descr else "",
                    }

                    # Extract the heading and convert it to lowercase
                    heading = line_stops[stop_id]["heading"].lower()

                    # Search for "downtown" or "uptown" in the heading
                    direction = re.search(
                        r"(downtown|uptown)|(?!(the|a|an))\b(\w+\s?)(\w*-?)bound",
                        heading,
                    )

                    # Update the direction in the lineStops dictionary
                    line_stops[stop_id]["direction"] = (
                        direction.group(0) if direction else None
                    )

    # Create a new dictionary with deep copies of the values in lineStops
    affected_stops = {
        stopid(key): copy.deepcopy(value) for key, value in line_stops.items() if value
    }

    # Iterate over each stop in affectedStops
    for stop in affected_stops.values():
        # Parse the date
        try:
            stop["alertInfo"]["date"] = dateparsing(stop["alertInfo"]["date"])
        except AttributeError:
            pass

        # Convert the createdAt and updatedAt timestamps to datetime objects
        stop["alertInfo"]["createdAt"] = convert_to_datetime(
            stop["alertInfo"]["createdAt"]
        )
        stop["alertInfo"]["updatedAt"] = convert_to_datetime(
            stop["alertInfo"]["updatedAt"]
        )

    return affected_stops


line_stops = process_alert_feed()
pprint(line_stops)
