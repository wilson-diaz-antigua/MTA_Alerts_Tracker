import copy
import csv
import datetime
import json
import re
from collections import OrderedDict, defaultdict
from datetime import datetime as dt
from pprint import pprint

import requests

from util.utils import dateparsing, secToTime, stopid

headers = {"x-api-key": "8ogTVWVBY55OObVPvYpmu4zQAjmlHl3Q8HmQ1BpV"}


Response = requests.get(
    "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/camsys%2Fsubway-alerts.json",
    headers=headers,
)

lineStops = OrderedDict()

with open("stops.csv") as csvfile:
    reader = csv.DictReader(csvfile)
    for col in reader:
        if col["stop_id"][0] == ("1"):
            lineStops[col["stop_id"]] = None
alertinfo = []
ServiceStatus = {
    "Delays": "delays.png",
    "Planned - Part Suspended": "suspended.png",
    "Planned - Stations Skipped": "skipped.png",
    "Station Notice": "information.png",
    "Reduced Service": "reduced.png",
}

alertFeed = json.loads(Response.content)


# Iterate over each entity in the alert feed
for entity in alertFeed["entity"]:
    # Extract the informed entity from the alert
    informedEnt = entity.get("alert", {}).get("informed_entity", {})

    # Check if the route_id of the first informed entity is "1"
    if informedEnt[0].get("route_id", None) in ["1"]:
        # Extract the alert and alert type
        alert = entity.get("alert", {})
        alertType = alert.get("transit_realtime.mercury_alert", {})

        # Extract alert information
        alertinfo = {
            "alertType": alertType.get("alert_type", {}),
            "createdAt": alertType.get("created_at", {}),
            "updatedAt": alertType.get("updated_at", {}),
            "date": alertType.get("human_readable_active_period", {})
            .get("translation", {})[0]
            .get("text", {}),
        }

        # Iterate over each informed entity
        for info in informedEnt:
            # Extract the header and description text
            head = alert.get("header_text", {}).get("translation", {})
            descr = alert.get("description_text", {}).get("translation", {})

            # Check if the stop_id is not None
            if info.get("stop_id", None) is not None:
                # Extract the stop_id
                stop_id = info.get("stop_id", None)

                # Update the lineStops dictionary
                lineStops[stop_id] = {
                    "line": informedEnt[0].get("route_id"),
                    "alertInfo": alertinfo,
                    "heading": head[0]["text"],
                }

                # Extract the heading and convert it to lowercase
                heading = lineStops[stop_id]["heading"].lower()

                # Search for "downtown" or "uptown" in the heading
                direction = re.search(r"(downtown|uptown)", heading)

                # Update the direction in the lineStops dictionary
                lineStops[stop_id]["direction"] = (
                    direction.group(0) if direction else None
                )

# Create a new dictionary with deep copies of the values in lineStops
affectedStops = {
    stopid(key): copy.deepcopy(value) for key, value in lineStops.items() if value
}


# Define a function to convert a timestamp to a datetime object if it isn't already
def convert_to_datetime(timestamp):
    if not isinstance(timestamp, datetime.datetime):
        return dt.fromtimestamp(timestamp)
    return timestamp


# Iterate over each stop in affectedStops
for stop in affectedStops.values():
    # Parse the date
    stop["alertInfo"]["parsedDate"] = dateparsing(stop["alertInfo"]["date"])

    # Convert the createdAt and updatedAt timestamps to datetime objects
    stop["alertInfo"]["createdAt"] = convert_to_datetime(stop["alertInfo"]["createdAt"])
    stop["alertInfo"]["updatedAt"] = convert_to_datetime(stop["alertInfo"]["updatedAt"])

# Filter the stops without a direction
sale = [item for item in affectedStops.items() if item[1]["direction"] is None]
pprint(sale)
