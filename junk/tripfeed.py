import json
from statistics import mean

import requests
from google.protobuf.json_format import MessageToJson
from google.transit import gtfs_realtime_pb2
from utils import secToMin

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

tripFeed = gtfs_realtime_pb2.FeedMessage()

# INFO: Fetch trip data from the MTA API

headwayResponse = requests.get(tripUrl["IRT"], headers=headers)
tripFeed.ParseFromString(headwayResponse.content)
headwayFeed = json.loads(MessageToJson(tripFeed))
# pprint(secToTime(int(feed["entity"][0]["alert"]["activePeriod"][0]["start"])))
line = "1"
arrivals = []
# pprint(headwayFeed["entity"])
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

print(filt)
