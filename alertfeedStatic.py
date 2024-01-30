import csv
import datetime
import json
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
        if col["stop_id"][0] == "1":
            lineStops[col["stop_id"]] = None
alertinfo = []
ServiceStatus = {
    "Delays": "delays.png",
    "Planned - Part Suspended": "suspended.png",
    "Planned - Stations Skipped": "skipped.png",
    "Station Notice": "information.png",
    "Reduced Service": "reduced.png",
}

# pprint(Response.headers)
alertFeed = json.loads(Response.content)


# pprint(alertFeed["entity"][0], indent=2)
for entity in alertFeed["entity"]:
    informedEnt = entity.get("alert", {}).get("informed_entity", {})

    if informedEnt[0].get("route_id", None) in ["1"]:
        alert = entity.get("alert", {})
        alertType = entity.get("alert", {}).get("transit_realtime.mercury_alert", {})
        alertinfo = {
            "alertType": alertType.get("alert_type", {}),
            "createdAt": dt.fromtimestamp(dt.timestamp(alertType.get("created_at", {})))
            if isinstance(created := alertType.get("created_at", {}), datetime.datetime)
            else dt.fromtimestamp(created),
            "updatedAt": dt.fromtimestamp(dt.timestamp(alertType.get("updated_at", {})))
            if isinstance(updated := alertType.get("updated_at", {}), datetime.datetime)
            else dt.fromtimestamp(updated),
            "date": alertType.get("human_readable_active_period", {})
            .get("translation", {})[0]
            .get("text", {}),
        }
        # pprint(alertinfo[3])
        for info in informedEnt:
            head = alert.get("header_text", {}).get("translation", {})
            descr = alert.get("description_text", {}).get("translation", {})

            if info.get("stop_id", None) is not None:
                lineStops[info.get("stop_id", None)] = {
                    "line": informedEnt[0].get("route_id"),
                    "alertInfo": alertinfo,
                    "heading": head[0]["text"],
                }
# AffetedStations = list(filter(lambda x: x[1], lineStops.items()))

affectedStops = {stopid(x[0]): x[1] for x in lineStops.items() if x[1]}
# AffetedStations = list(map(lambda x: (stopid(x[0]), x[1]), AffetedStations))

for x in affectedStops:
    affectedStops[x]["alertInfo"]["parsedDate"] = dateparsing(
        affectedStops[x]["alertInfo"]["date"]
    )


pprint(affectedStops)
