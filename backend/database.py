from sqlmodel import SQLModel, create_engine

# from backend.route import server

sqlite_file_name = "data.db"
supabase_url = f"postgresql://postgres.chdvhomptyzmnkizulpc:uPnqqA6RGcFbcPAh@aws-0-us-west-1.pooler.supabase.com:5432/postgres"
postgress_url = f"postgresql://wilson@localhost:5432/wilson"

# The engine is the interface to our database so we can execute SQL commands
engine = create_engine(postgress_url)


def init_db():

    # using the engine we create the tables we need if they aren't already done

    SQLModel.metadata.create_all(engine)
