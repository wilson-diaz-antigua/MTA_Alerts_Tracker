import sys

from flask import Flask, jsonify, render_template, request
from flask.views import MethodView
from flask_smorest import Api, Blueprint, abort

# from models import Data


server = Flask(__name__)


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


@stops.route("/stops")
class StopsCollection(MethodView):

    @stops.response(status_code=200)
    def get(self):
        return jsonify()


api.register_blueprint(stops)


# @server.route("/")
# def hello():
#     return jsonify({"about": "Hello World!"})


if __name__ == "__main__":
    server.run(debug=True)
