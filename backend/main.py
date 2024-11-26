import sys

from services import database
from services.alertfeedStatic import add_alerts_to_db


def main():
    database.init_db()
    add_alerts_to_db()


if __name__ == "__main__":
    main()
