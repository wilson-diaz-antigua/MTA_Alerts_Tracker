import os
import sys

sys.path.append(os.path.dirname(os.path.abspath(__file__)))
# from models import Data
import logging
import sys
from typing import List

from flask import Flask, jsonify, render_template, request
from flask.views import MethodView
from flask_cors import CORS
from flask_smorest import Api, Blueprint, abort
from sqlalchemy.exc import SQLAlchemyError
from util.utils import dateparsing, stopid

from backend.services.models import Alerts, ListofAlerts, Stop, StopSchema

from .app_factory import create_app

app, api = create_app()

# Create a logger
logger = logging.getLogger(__name__)
# Set the logging level (DEBUG, INFO, WARNING, ERROR, CRITICAL)
logger.setLevel(logging.DEBUG)

# Create a handler (e.g., console handler)
handler = logging.StreamHandler()

# Create a formatter
formatter = logging.Formatter("%(asctime)s - %(name)s - %(levelname)s - %(message)s")

# Add the formatter to the handler
handler.setFormatter(formatter)

# Add the handler to the logger
logger.addHandler(handler)


stops = Blueprint(
    "stops", __name__, url_prefix="/stops", description="Operations on stops"
)


@stops.route("/stops")
class StopsCollection(MethodView):
    @stops.response(status_code=200)
    def get(self):
        try:
            parsed = []

            stopSchema = StopSchema()

            stops = Stop.query.all()

            stops = stopSchema.dump(stops, many=True)

            return jsonify([{"id": stop.id, "stop": stop.stop} for stop in stops])

        except SQLAlchemyError as e:
            logger.error(f"Database error: {e}")

            raise
        except Exception as e:
            logger.error(f"Unexpected error: {e}")
            raise


if __name__ == "__main__":
    app.run(debug=True, port=5008)
