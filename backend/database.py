from sqlmodel import Session, SQLModel, create_engine

from .route import app

# UIsing SQLite here but can easily use PostgreSQL by changing the url
sqlite_file_name = "data.db"
sqlite_url = f"postgresql://wilson@localhost:5432/wilson"

# The engine is the interface to our database so we can execute SQL commands
engine = create_engine(sqlite_url)


# using the engine we create the tables we need if they aren't already done


@app.before_first_request
def create_db_and_tables():
    SQLModel.metadata.create_all(engine)
