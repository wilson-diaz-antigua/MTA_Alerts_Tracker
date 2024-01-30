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
            "createdAt": alertType.get("created_at", {}),
            "updatedAt": alertType.get("updated_at", {}),
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
                direction = re.search(
                    r"(downtown|uptown)",
                    lineStops[info.get("stop_id", None)]["heading"].lower(),
                )

                lineStops[info.get("stop_id", None)]["direction"] = (
                    direction.group(0) if direction else None
                )


affectedStops = {stopid(x[0]): copy.deepcopy(x[1]) for x in lineStops.items() if x[1]}

for x in affectedStops:
    affectedStops[x]["alertInfo"]["parsedDate"] = dateparsing(
        affectedStops[x]["alertInfo"]["date"]
    )

    affectedStops[x]["alertInfo"]["createdAt"] = (
        dt.fromtimestamp(affectedStops[x]["alertInfo"]["createdAt"])
        if not isinstance(
            created := affectedStops[x]["alertInfo"]["createdAt"], datetime.datetime
        )
        else created
    )
    affectedStops[x]["alertInfo"]["updatedAt"] = (
        dt.fromtimestamp(affectedStops[x]["alertInfo"]["updatedAt"])
        if not isinstance(
            created := affectedStops[x]["alertInfo"]["updatedAt"], datetime.datetime
        )
        else created
    )
sale = list(filter(lambda x: x[1]["direction"] == None, affectedStops.items()))
pprint(sale)
