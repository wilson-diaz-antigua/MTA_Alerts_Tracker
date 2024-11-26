import os
import sys

from flask import Flask, jsonify, render_template, request
from flask.views import MethodView
from flask_cors import CORS
from flask_smorest import Api, Blueprint, abort
from services import database
from services.alertfeedStatic import add_alerts_to_db
from services.models import Alerts, ListofAlerts, Stop, StopSchema
from sqlmodel import Session, select

from util.utils import dateparsing, stopid

# from models import Data


server = Flask(__name__)
CORS(server)


class APIConfig:
    API_TITLE = "MTA_API"
    API_VERSION = "v1"
    OPENAPI_VERSION = "3.0.3"
    OPENAPI_URL_PREFIX = "/"
    OPENAPI_SWAGGER_UI_PATH = "/docs"
    OPENAPI_SWAGGER_UI_URL = "https://cdn.jsdelivr.net/npm/swagger-ui-dist/"
    OPENAPI_REDOC_PATH = "/redoc"
    OPENAPI_REDOC_UI_URL = (
        "https://cdn.jsdelivr.net/npm/redoc/bundles/redoc.standalone.js"
    )


server.config.from_object(APIConfig)


api = Api(server)
stops = Blueprint("stops", "stops", url_prefix="/api", description="MTA stops API")


# @stops.route("/alerts")
# class alertsCollection(MethodView):
#     # @stops.arguments(StopSchema, location="query")
#     @stops.response(status_code=200, schema=AlertSchema(many=True))
#     def get(self):
#         with Session(engine) as session:
#             out = session.exec(select(Alerts)).all()

#         return out

#         # return {"£stop": x.stop for x in stops, "alert" : [y.alert[0].alert_type for y in stops]}


@stops.route("/stops")
class StopsCollection(MethodView):

    @stops.response(status_code=200)
    def get(self):
        parsed = []

        stopSchema = StopSchema()
        # response = supabase.table("alerts").select("*").execute()
        # response = stopSchema.dump(response, many=True)
        with Session(database.engine) as session:
            stops = session.exec(select(Stop)).all()
            # idstop = [map(lambda a: stopid(a), stops)]
            # stops= {}

            stops = stopSchema.dump(stops, many=True)
            # for x in stops:
            #     if x is not None or x["alert"][0]["dateText"] is not None:
            #         parsed.append(dateparsing(x["alert"][0]["dateText"]))
            # print(parsed)
            # for stop in stops:
            #     print(stop.alerts)

            # for x in stops:
            #     if x.id == alerts.stop_id:
            return stops

        # session.close


api.register_blueprint(stops)


# @server.route("/")
# def hello():
#     return jsonify({"about": "Hello World!"})


if __name__ == "__main__":
    # database.init_db()
    # add_alerts_to_db()

    server.run(port=6543, host="0.0.0.0", debug=True)
