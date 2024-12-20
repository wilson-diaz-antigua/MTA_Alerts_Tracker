import os
from pathlib import Path

from dotenv import dotenv_values
from flask import Flask
from flask_cors import CORS
from flask_migrate import Migrate
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


# The engine is the interface to our database so we can execute SQL commands
class Config:
    SQLALCHEMY_DATABASE_URI = os.getenv(
        "DATABASE_URL",
        connection_str,
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False


if not user:
    raise KeyError("POSTGRES_USER environment variable is not set")
