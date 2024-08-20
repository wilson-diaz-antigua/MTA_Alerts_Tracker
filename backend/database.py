import os

from dotenv import load_dotenv
from sqlmodel import SQLModel, create_engine

load_dotenv(".env")

KEY = os.getenv("SUPABASE_API_KEY")
# from backend.route import server
sqlite_file_name = os.getenv("SQLITE_FILE_NAME")
supabase_url = os.getenv("SUPABASE_URL")
postgress_url = os.getenv("POSTGRESS_URL")

# The engine is the interface to our database so we can execute SQL commands
engine = create_engine(postgress_url)


# def init_db():

# using the engine we create the tables we need if they aren't already done

SQLModel.metadata.create_all(engine)
