import json
from collections import defaultdict
from pprint import pprint

import requests
from google.protobuf.json_format import MessageToJson
from google.transit import gtfs_realtime_pb2
from util.utils import secToTime, stopid

headers = {"x-api-key": "8ogTVWVBY55OObVPvYpmu4zQAjmlHl3Q8HmQ1BpV"}
tripUrl = "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs"

tripFeed = gtfs_realtime_pb2.FeedMessage()


headwayResponse = requests.get(tripUrl, headers=headers)
tripFeed.ParseFromString(headwayResponse.content)
headwayFeed = json.loads(MessageToJson(tripFeed))
# pprint(secToTime(int(feed["entity"][0]["alert"]["activePeriod"][0]["start"])))
line = "1"

# pprint(headwayFeed["entity"])
arrivals = defaultdict(list)
for x in headwayFeed["entity"]:
    tripUpdate = x.get("tripUpdate", {})
    for y in tripUpdate.get("stopTimeUpdate", {}):
        if (
            tripUpdate.get("trip", {}).get("routeId", {}) == line
            and y.get("stopId", {})[-1] == "S"
        ):
            stop = stopid(y.get("stopId", {}))
            arrivals[stop].append(secToTime(y.get("arrival", {}).get("time", {})))


# arrivals = [secToTime(int(x)) for y, x in arrivals.items()]
def main():
    pass


if __name__ == "__main__":
    pprint(arrivals)

# filt = sorted(list(filter(lambda x: x < 25 and x > 0, arrivals)))

# difference = []
# for x in range(len(filt) - 1):
#     difference.append(abs(filt[x + 1] - filt[x]))
# average = mean(difference)
