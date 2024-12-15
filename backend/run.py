import sys

from services import server
from services.alertfeedStatic import add_alerts_to_db


def main():
    # add_alerts_to_db()
    server.run(port=6543, host="0.0.0.0", debug=True)


if __name__ == "__main__":
    main()
