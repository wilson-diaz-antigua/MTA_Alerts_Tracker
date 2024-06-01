import csv
from datetime import datetime
from typing import Any, Dict, List, Optional, Set, Union

import sqlalchemy as sa
from database import engine
from marshmallow import Schema, fields, post_dump, pre_dump
from marshmallow_sqlalchemy import SQLAlchemyAutoSchema
from pydantic import BaseModel
from sqlalchemy.dialects import (
    postgresql,
)  # ARRAY contains requires dialect specific type
from sqlalchemy.orm import Mapped
from sqlmodel import Column, Field, Relationship, Session, SQLModel, String, select

from util.utils import stopid

# class Date(SQLModel, table=True):
#     id: Optional[int] = Field(default=None, primary_key=True)
#     dateText: str = Field(nullable=True)
#     data_id: Optional[str] = Field(default=None, foreign_key="data.stop")
# date: List[datetime] = Field(
#     default=None, sa_column=Column(postgresql.ARRAY(String()))
# )
# data_stop: Optional[Data] = Relationship(back_populates="date")


# Optional because if we use this field as auto id increment
class Stop(SQLModel, table=True):
    id: Optional[int] = Field(primary_key=True)
    stop: Optional[str] = Field(default=None, unique=True)
    alert: list["Alerts"] = Relationship(back_populates="stops")


class Alerts(SQLModel, table=True):

    # the value would be None before it gets to the database
    id: Optional[int] = Field(primary_key=True)
    alert_type: str = Field(nullable=True)
    created_at: datetime = Field(nullable=True)
    updated_at: datetime = Field(nullable=True)
    direction: str = Field(nullable=True)
    heading: str = Field(nullable=True)
    dateText: str = Field(nullable=True)
    # decription: str = Field(nullable=True)
    route: str = Field(nullable=True)
    # stop: Optional[str] = Field(default=None)
    stop_id: Optional[int] = Field(default=None, foreign_key="stop.id")
    stops: Stop | None = Relationship(back_populates="alert")


class ListofAlerts(SQLAlchemyAutoSchema):
    class Meta:
        model = Alerts
        exclude = ("id", "stop_id", "created_at", "updated_at")


class StopSchema(SQLAlchemyAutoSchema):

    class Meta:
        model = Stop
        exclude = ("id",)
        include_relationship = True

    alert = fields.Nested(
        ListofAlerts,
        allow_none=True,
        many=True,
    )

    # @post_dump
    # def stopParser(self, stops, **kwargs):
    #     stops["stop"] = stopid(stops["stop"])
    #     return stops
