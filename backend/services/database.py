import os
from pathlib import Path

from dotenv import dotenv_values
from flask import Flask
from flask_cors import CORS
from flask_marshmallow import Marshmallow
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy
from sqlmodel import SQLModel, create_engine

env_path = Path(__file__).parent.parent / ".env.postgres"


vals = dotenv_values(env_path)
# from backend.route import server
user = vals["POSTGRES_USER"]
password = vals["POSTGRES_PASSWORD"]
host = vals["POSTGRES_HOST"]
port = vals["POSTGRES_PORT"]
database = vals["POSTGRES_DB"]
if not user:
    raise KeyError("POSTGRES_USER environment variable is not set")
connection_str = f"postgresql+psycopg2://{user}:{password}@{host}:{port}/{database}"


class Config:
    SQLALCHEMY_DATABASE_URI = os.getenv(
        "DATABASE_URL",
        connection_str,
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False


db = SQLAlchemy()
ma = Marshmallow()
server = Flask(__name__)
server.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
migrate = Migrate(server, db)
server.config["SQLALCHEMY_DATABASE_URI"] = Config.SQLALCHEMY_DATABASE_URI
server.config["PROPAGATE_EXCEPTIONS"] = True
db.init_app(server)
ma.init_app(server)

if not user:
    raise KeyError("POSTGRES_USER environment variable is not set")
