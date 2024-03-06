from backend.database import create_db_and_tables
from services.alertfeedStatic import add_alerts_to_db


def main():
    create_db_and_tables()
    add_alerts_to_db()


if __name__ == "__main__":
    main()
