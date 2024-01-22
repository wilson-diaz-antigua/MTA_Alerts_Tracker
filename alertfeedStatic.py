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
pprint(alertFeed["entity"][0], depth=4, indent=4)
alertinfo = []
for x in alertFeed["entity"]:
    alert = x.get("alert", {})
    informedEnt = x.get("alert", {}).get("informed_entity", {})
    alertType = x.get("alert", {}).get("transit_realtime.mercury_alert", {})
    alertinfo = [
        alertType.get("alert_type", {}),
        alertType.get("created_at", {}),
        alertType.get("updated_at", {}),
    ]
    stops = []
    # active = secToTime(int(x.get("activePeriod", {}).get("start", 0)))
    for y in informedEnt:
        if y.get("stop_id", None) is not None:
            stops.append(y.get("stop_id", None))
        head = alert.get("header_text", {}).get("translation", {})
        descr = alert.get("description_text", {}).get("translation", {})

        # print(
        #     f"""

        #         ROUTE ID:{alertinfo[0]} on {informedEnt[0].get('route_id')} at {secToTime(alertinfo[1])}
        #         STOPS:{list(map(stopid,stops))}
        #         HEADER:{head[0]["text"]}
        #         DESCRIPTION:{descr[0]["text"] if type(descr) == list else descr}

        #           ___________________________

        #           """
        # )
