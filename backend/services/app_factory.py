from flask import Flask
from flask_cors import CORS
from flask_migrate import Migrate
from flask_smorest import Api, Blueprint
from flask_sqlalchemy import SQLAlchemy

from backend.services.database import APIConfig, Config

db = SQLAlchemy()

stops = Blueprint(
    "stops", __name__, url_prefix="/stops", description="Operations on stops"
)


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    app.config.from_object(APIConfig)
    CORS(app)

    migrate = Migrate(app, db)
    api = Api(app)
    api.register_blueprint(stops)
    return app, api
