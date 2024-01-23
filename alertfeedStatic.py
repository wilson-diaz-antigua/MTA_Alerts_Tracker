import csv
import json
import urllib.request
from pprint import pprint

import requests
import xmltodict

from util.utils import secToTime, stopid

headers = {"x-api-key": "8ogTVWVBY55OObVPvYpmu4zQAjmlHl3Q8HmQ1BpV"}


Response = requests.get(
    "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/camsys%2Fsubway-alerts.json",
    headers=headers,
)
# data = xmlResponse.read()
# xmlResponse.close
alertFeed = json.loads(Response.content)
# pprint(alertFeed["entity"][0], depth=4, indent=4)
lines = []
with open("stops.csv") as csvfile:
    reader = csv.DictReader(csvfile)

    for col in reader:
        if col["stop_id"][0] == "1":
            lines.append(col["stop_id"])

alertinfo = []
info = []
stops = []
for x in alertFeed["entity"]:
    informedEnt = x.get("alert", {}).get("informed_entity", {})

    if informedEnt[0].get("route_id", None) in ["1"]:
        alert = x.get("alert", {})
        alertType = x.get("alert", {}).get("transit_realtime.mercury_alert", {})
        alertinfo = [
            alertType.get("alert_type", {}),
            alertType.get("created_at", {}),
            alertType.get("updated_at", {}),
        ]

        # active = secToTime(int(x.get("activePeriod", {}).get("start", 0)))
        for y in informedEnt:
            if y.get("stop_id", None) is not None:
                stops.append(y.get("stop_id", None))
            head = alert.get("header_text", {}).get("translation", {})
            descr = alert.get("description_text", {}).get("translation", {})

        # info.append(
        #     {
        #         "line": informedEnt[0].get("route_id"),
        #         "stops": list(map(stopid, stops)),
        #         "type": alertinfo[0],
        #         "time": secToTime(alertinfo[1]),
        #         "heading": head[0]["text"],
        #         "description": descr[0]["text"] if type(descr) == list else descr,
        #     }
        # )
final = list(
    dict.fromkeys(
        filter(lambda x: x in list(map(stopid, stops)), list(map(stopid, lines)))
    )
)
print(final)
