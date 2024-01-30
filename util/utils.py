import time
from collections import defaultdict
from datetime import datetime

from dateparser.search import search_dates

"""
TODO:
* format dates
* add default icon
* update list without deleting 

"""

date1 = "Feb 5, Mon 4:45 AM through late Feb"
date2 = "Feb 20 - 23, Tue to Fri, 10:45 AM to 3:30 PM"
# strftime("%a, %b %d")
# .strftime("%I:%M %p")


def dateparsing(date):
    res = search_dates(date)
    timer = datetime.strptime("00:00:00", "%H:%M:%S").time()
    datePeriod = {"time": [], "date": []}
    for x in res:
        if x[1].strftime("%a, %b %d") not in datePeriod["date"]:
            datePeriod["date"].append(x[1].strftime("%a, %b %d"))
        if (
            x[1].time() != timer
            and x[1].time().strftime("%I:%M %p") not in datePeriod["time"]
        ):
            datePeriod["time"].append(x[1].time().strftime("%I:%M %p"))

    return datePeriod


# print(
#     f"""{date2}
#             {dateparsing(date2)}
#       """
# )


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
