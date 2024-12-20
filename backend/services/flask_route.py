import os
import sys

sys.path.append(os.path.dirname(os.path.abspath(__file__)))
import logging
import sys

from flask import jsonify
from flask.views import MethodView
from flask_smorest import Blueprint
from sqlalchemy.exc import SQLAlchemyError

from backend.services.app_factory import stops
from backend.services.models import Stop, StopSchema

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


@stops.route("/stops")
class StopsCollection(MethodView):
    @stops.response(status_code=200)
    def get(self):
        try:

            parsed = []

            stopSchema = StopSchema()

            stopsQuery = Stop.query.all()

            stopsQuery = stopSchema.dump(stops, many=True)

            return stopsQuery

        except SQLAlchemyError as e:
            logger.error(f"Database error: {e}")

            raise
        except Exception as e:
            logger.error(f"Unexpected error: {e}")
            raise
