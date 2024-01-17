import json
import time
from pprint import pprint
from statistics import mean

import requests
from flatdict import FlatDict
from google.protobuf.json_format import MessageToJson
from google.transit import gtfs_realtime_pb2


def stopid(stop: str):
    import csv

    stop = stop
    col = {}

    with open("stops.csv") as csvfile:
        reader = csv.DictReader(csvfile)

        for row in reader:
            if row["stop_name"] not in col:
                col[row["stop_id"]] = col.setdefault(row["stop_id"], [row["stop_name"]])
            else:
                col[row["stop_id"]] += [row["stop_name"]]
        col["none"] = ["none"]
        return f"{col[stop][0]}"


def secToTime(row: int):
    return time.strftime("%I:%M %p", time.localtime(row))


def secToMin(row: int):
    return int((row - time.time()) / 60)


stopid("709")


def flatten(ndict):
    def key_value_pairs(d, key=[]):
        if not isinstance(d, dict):
            yield tuple(key), d
        else:
            for level, d_sub in d.items():
                key.append(level)
                yield from key_value_pairs(d_sub, key)
                key.pop()

    return dict(key_value_pairs(ndict))


tripUrl = {
    "ace": "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-ace",
    "bdfm": "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-bdfm",
    "IRT": "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs",
    "nqrw": "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-nqrw",
}
# for link in links :

# ["a", "c", "e"]
# ["b", "d", "f", "m"]
# ["1", "2", "3", "4", "5", "6", "7"]
# ["n", "q", "r", "w"]


headers = {"x-api-key": "8ogTVWVBY55OObVPvYpmu4zQAjmlHl3Q8HmQ1BpV"}
alertUrl = (
    "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/camsys%2Fsubway-alerts"
)

# INFO: Fetch trip data from the MTA API
tripFeed = gtfs_realtime_pb2.FeedMessage()

alertResponse = requests.get(alertUrl, headers=headers)
tripFeed.ParseFromString(alertResponse.content)
alertFeed = json.loads(MessageToJson(tripFeed))

headwayResponse = requests.get(tripUrl["IRT"], headers=headers)
tripFeed.ParseFromString(headwayResponse.content)
headwayFeed = json.loads(MessageToJson(tripFeed))
# pprint(secToTime(int(feed["entity"][0]["alert"]["activePeriod"][0]["start"])))
line = "1"

# pprint(headwayFeed["entity"])
arrivals = []
for x in headwayFeed["entity"]:
    tripUpdate = x.get("tripUpdate", {})
    if tripUpdate.get("trip", {}).get("routeId", {}) == line:
        for y in tripUpdate.get("stopTimeUpdate", {}):
            if y.get("stopId") == "116S":
                arrivals.append(int(y.get("arrival").get("time")))

arrivals = list(map(secToMin, arrivals))
filt = sorted(list(filter(lambda x: x < 25 and x > 0, arrivals)))

difference = []
for x in range(len(filt) - 1):
    difference.append(abs(filt[x + 1] - filt[x]))
average = mean(difference)
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
