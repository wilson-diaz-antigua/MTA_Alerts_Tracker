import csv
from datetime import datetime
from typing import TYPE_CHECKING, Any, Dict, List, Optional, Set, Union

# import .database as database
import sqlalchemy as sa
from marshmallow import Schema, fields, post_dump, pre_dump
from marshmallow_sqlalchemy import SQLAlchemyAutoSchema
from pydantic import BaseModel
from sqlalchemy import MetaData
from sqlalchemy.dialects import (
    postgresql,
)  # ARRAY contains requires dialect specific type
from sqlalchemy.orm import Mapped, registry
from sqlmodel import (
    Column,
    Field,
    Relationship,
    Session,
    SQLModel,
    String,
    create_engine,
    select,
)

metadata = MetaData()
if TYPE_CHECKING:
    from .models import Alerts, Stop


class Stop(SQLModel, table=True):
    __tablename__ = "stop"
    __table_args__ = {"extend_existing": True}

    id: Optional[int] = Field(primary_key=True)
    stop: Optional[str] = Field(default=None)
    alerts: List["Alerts"] = Relationship(
        back_populates="stop",
        sa_relationship_kwargs={"lazy": "selectin", "cascade": "all, delete-orphan"},
    )


class Alerts(SQLModel, table=True):
    __tablename__ = "alerts"
    __table_args__ = {"extend_existing": True}

    id: Optional[int] = Field(primary_key=True)
    alert_type: str = Field(nullable=True)
    created_at: int = Field(nullable=True)
    updated_at: int = Field(nullable=True)
    direction: str = Field(nullable=True)
    heading: str = Field(nullable=True)
    dateText: str = Field(nullable=True)
    parsedDate: str = Field(nullable=True)
    route: str = Field(nullable=True)
    stop_id: Optional[int] = Field(default=None, foreign_key="stop.id")
    stop: Optional["Stop"] = Relationship(
        back_populates="alerts", sa_relationship_kwargs={"lazy": "joined"}
    )


class ListofAlerts(SQLAlchemyAutoSchema):
    class Meta:
        model = Alerts
        exclude = ("id", "stop_id", "created_at", "updated_at")
        include_relationships = False


class StopSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Stop
        exclude = ("id",)
        include_relationships = True


engine = create_engine("postgresql+psycopg2://wilson:password@localhost:5432/wilson")
SQLModel.metadata.create_all(engine)
