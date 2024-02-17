import time
from collections import defaultdict
from datetime import datetime
from typing import Union

from dateparser.search import search_dates


def dateparsing(date) -> dict:
    res = search_dates(date)
    timer = datetime.strptime("00:00:00", "%H:%M:%S").time()
    datePeriod = {"dateText": date, "time": [], "date": []}
    for x in res:
        if x[1].strftime("%a, %b %d") not in datePeriod["date"]:
            datePeriod["date"].append(x[1].strftime("%a, %b %d"))
        if (
            x[1].time() != timer
            and x[1].time().strftime("%I:%M %p") not in datePeriod["time"]
        ):
            datePeriod["time"].append(x[1].time().strftime("%I:%M %p"))

    return datePeriod


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

        if stop is not None:
            return f"{col[stop][0]}"
        else:
            pass


# Define a function to convert a timestamp to a datetime object if it isn't already
def convert_to_datetime(timestamp: Union[int, float, datetime]) -> datetime:
    if not isinstance(timestamp, datetime):
        return datetime.fromtimestamp(timestamp)
    return timestamp


def secToTime(row):
    if row:
        return time.strftime("%I:%M %p", time.localtime(int(row)))


def secToMin(row):
    if row:
        return int((int(row) - time.time()) / 60)
