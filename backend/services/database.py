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
print(vals)
user = vals["POSTGRES_USER"]
password = vals["POSTGRES_PASSWORD"]
host = vals["POSTGRES_HOST"]
port = vals["POSTGRES_PORT"]
database = vals["POSTGRES_DB"]
if not user:
    raise KeyError("POSTGRES_USER environment variable is not set")
connection_str = f"postgresql+psycopg2://{user}:{password}@{host}:{port}/{database}"
# The engine is the interface to our database so we can execute SQL commands
engine = create_engine(connection_str)
if not user:
    raise KeyError("POSTGRES_USER environment variable is not set")


def init_db():

    # using the engine we create the tables we need if they aren't already done

    SQLModel.metadata.create_all(engine)
