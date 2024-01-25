import time
from datetime import datetime


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


def secToTime(row: int):
    return time.strftime("%I:%M %p", time.localtime(row))


def secToMin(row: int):
    return int((row - time.time()) / 60)
