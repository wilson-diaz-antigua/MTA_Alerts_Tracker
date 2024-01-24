import csv
import json
from collections import OrderedDict, defaultdict
from pprint import pprint

import requests

from util.utils import secToTime, stopid

headers = {"x-api-key": "8ogTVWVBY55OObVPvYpmu4zQAjmlHl3Q8HmQ1BpV"}


Response = requests.get(
    "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/camsys%2Fsubway-alerts.json",
    headers=headers,
)

alertFeed = json.loads(Response.content)
lineStops = OrderedDict()
with open("stops.csv") as csvfile:
    reader = csv.DictReader(csvfile)

    for col in reader:
        if col["stop_id"][0] == "1":
            lineStops[stopid(col["stop_id"])] = None

alertinfo = []
ServiceStatus = {
    "Delays": "delays.png",
    "Planned - Part Suspended": "suspended.png",
    "Planned - Stations Skipped": "skipped.png",
    "Station Notice": "information.png",
    "Reduced Service": "reduced.png",
}
for entity in alertFeed["entity"]:
    informedEnt = entity.get("alert", {}).get("informed_entity", {})

    if informedEnt[0].get("route_id", None) in ["1"]:
        alert = entity.get("alert", {})
        alertType = entity.get("alert", {}).get("transit_realtime.mercury_alert", {})
        alertinfo = [
            alertType.get("alert_type", {}),
            alertType.get("created_at", {}),
            alertType.get("updated_at", {}),
        ]

        for info in informedEnt:
            head = alert.get("header_text", {}).get("translation", {})
            descr = alert.get("description_text", {}).get("translation", {})

            if info.get("stop_id", None) is not None:
                lineStops[stopid(info.get("stop_id", None))] = {
                    "line": informedEnt[0].get("route_id"),
                    "alertType": alertinfo[0],
                    "time": secToTime(alertinfo[1]),
                    "heading": head[0]["text"],
                }
AffetedStations = list(filter(lambda x: x[1], lineStops.items()))
pprint(AffetedStations)
