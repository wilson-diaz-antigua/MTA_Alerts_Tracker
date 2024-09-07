import os

from dotenv import load_dotenv
from sqlmodel import SQLModel, create_engine

load_dotenv(".env.postgres")

KEY = os.getenv("SUPABASE_API_KEY")
# from backend.route import server
sqlite_file_name = os.getenv("SQLITE_FILE_NAME")
supabase_url = os.getenv("SUPABASE_URL")
postgress_url = os.getenv("URL")
user = os.getenv("USER")
password = os.getenv("PASSWORD")
host = os.getenv("HOST")
port = os.getenv("PORT")
database = os.getenv("DATABASE")
connection_str = f"postgresql+psycopg2://{user}:{password}@{host}:{port}/{database}"
# The engine is the interface to our database so we can execute SQL commands
engine = create_engine(connection_str)


def init_db():

    # using the engine we create the tables we need if they aren't already done

    SQLModel.metadata.create_all(engine)
