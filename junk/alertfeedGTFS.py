import json

import requests
from google.protobuf.json_format import MessageToJson
from google.transit import gtfs_realtime_pb2

from util.utils import secToTime, stopid

headers = {"x-api-key": "8ogTVWVBY55OObVPvYpmu4zQAjmlHl3Q8HmQ1BpV"}
alertUrl = (
    "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/camsys%2Fsubway-alerts"
)
tripFeed = gtfs_realtime_pb2.FeedMessage()

alertResponse = requests.get(alertUrl, headers=headers)
tripFeed.ParseFromString(alertResponse.content)
alertFeed = json.loads(MessageToJson(tripFeed))

for x in alertFeed["entity"]:
    alert = x.get("alert", {})
    informedEnt = x.get("alert", {}).get("informedEntity", {})
    stops = []
    active = secToTime(int(x.get("activePeriod", {}).get("start", 0)))
    for y in informedEnt:
        if y.get("agencyId", {}) == "MTASBWY":
            stops.append(y.get("stopId", "none"))
            head = alert.get("headerText", {}).get("translation", {})
            descr = alert.get("descriptionText", {}).get("translation", {})
            print(
                f"""
                
                ROUTE ID:{informedEnt[0].get('routeId')} at {active}
                STOPS:{list(map(stopid,stops))}
                HEADER:{head[0]["text"]} 
                DESCRIPTION:{descr[0]["text"] if type(descr) == list else descr}
                  
                  ___________________________
                  
                  """
            )
