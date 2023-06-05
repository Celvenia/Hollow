from .db import db, environment, SCHEMA, add_prefix_for_prod
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin
from datetime import datetime


class Reminder(db.Model, UserMixin):
    __tablename__ = 'reminders'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.Date, nullable=False)
    time = db.Column(db.String(8), nullable=False)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    recurring = db.Column(db.Boolean, default=False)
    location = db.Column(db.String(100))
    status = db.Column(db.String(10), default='active') # active, inactive
    user_id = db.Column(db.Integer, add_prefix_for_prod(db.ForeignKey('users.id')), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.now)
    updated_at = db.Column(db.DateTime, default=datetime.now, onupdate=datetime.now)

    def to_dict(self):
        return {
            'id': self.id,
            'date': self.date,
            'time': self.time,
            'title': self.title,
            'description': self.description,
            'recurring': self.recurring,
            'location': self.location,
            'status': self.status,
            'user_id': self.user_id,
            'created_at': self.created_at,
            'updated_at': self.updated_at
        }
