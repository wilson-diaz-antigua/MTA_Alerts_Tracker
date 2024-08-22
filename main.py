from backend.database import init_db
from services.alertfeedStatic import add_alerts_to_db


def main():
    init_db()
    add_alerts_to_db()


if __name__ == "__main__":
    main()
