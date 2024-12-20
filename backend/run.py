import sys

from flask import Flask

from backend.services.alertfeedStatic import add_alerts_to_db
from backend.services.app_factory import create_app, db


def init_db():
    global app
    app, api = create_app()
    with app.app_context():
        db.init_app(app)
        db.create_all()
        try:
            add_alerts_to_db()
        except Exception as e:
            print(f"Warning: Failed to add initial alerts: {e}")

    return app


def main():
    global app
    app = init_db()
    app.run(host="localhost", port=5008, debug=True)


app = init_db()

if __name__ == "__main__":
    main()
