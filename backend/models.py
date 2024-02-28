from datetime import datetime

from backend import db, ma


class PlannedChanges(db.Model):
    table_name = "planned_changes"

    id = db.Column(db.Text, primary_key=True)

    alertType = db.Column(db.Text)
    createdAt = db.Column(db.DateTime)
    updatedAt = db.Column(db.DateTime)
    date = db.Column(db.DateTime)
    time = db.Column(db.DateTime)
    dateText = db.Column(db.Text)
    direction = db.Column(db.Text)
    heading = db.Column(db.Text)
    line = db.Column(db.Text)
    DateAdded = db.Column(db.DateTime, default=datetime.today())


class db_Schema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = PlannedChanges
        load_instance = True
