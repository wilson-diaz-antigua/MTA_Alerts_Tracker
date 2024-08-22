from pprint import pprint

from database import engine
from models import Stop, StopSchema
from sqlmodel import Session, select

StopSchema = StopSchema()
with Session(engine) as session:
    stops = session.exec(select(Stop)).all()
    stops = StopSchema.dump(
        stops,
        many=True,
    )

    pprint(stops[0:10])
