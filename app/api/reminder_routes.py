from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models import db, Reminder
from datetime import datetime

reminder_routes = Blueprint('reminders', __name__)

# Get all reminders
@reminder_routes.route('', methods=['GET'])
@login_required
def get_reminders():
    # reminders = Reminder.query.all()
    reminders = Reminder.query.filter_by(user_id=current_user.id)
    return {'reminders': [reminder.to_dict() for reminder in reminders]}

# Get reminder by id
@reminder_routes.route('/<int:id>', methods=['GET'])
@login_required
def get_reminder(id):
    reminder = Reminder.query.get(id)

    if not reminder:
        return jsonify(error=[f"Unable to find reminder associated with id {id}"])

    return reminder.to_dict()

# Create reminder
@reminder_routes.route('', methods=['POST'])
@login_required
def create_reminder():
    date_str = request.json.get('date')
    date = datetime.strptime(date_str, '%Y-%m-%d').date()
    time = request.json.get('time')
    title = request.json.get('title')
    description = request.json.get('description')
    recurring = request.json.get('recurring')
    location = request.json.get('location')
    status = request.json.get('status')
    user_id = current_user.id

    new_reminder = Reminder(
        date=date,
        time=time,
        title=title,
        description=description,
        recurring=recurring,
        location=location,
        status=status,
        user_id=user_id
    )

    db.session.add(new_reminder)
    db.session.commit()

    return new_reminder.to_dict(), 201

# Update reminder by id
@reminder_routes.route('/<int:id>', methods=['PUT'])
@login_required
def update_reminder(id):
    reminder = Reminder.query.get(id)

    if not reminder:
        return jsonify(error=[f"Unable to find reminder associated with id {id}"])

    if reminder.user_id != current_user.id:
        return jsonify(error=["You don't have permission to update this reminder"]), 401

    date_str = request.json.get('date')
    date = datetime.strptime(date_str, '%Y-%m-%d').date()
    time = request.json.get('time')
    title = request.json.get('title')
    description = request.json.get('description')
    recurring = request.json.get('recurring')
    location = request.json.get('location')
    status = request.json.get('status')

    reminder.date = date or reminder.date # Date
    reminder.time = time or reminder.time # HH:MM AM || PM
    reminder.title = title or reminder.title
    reminder.description = description or reminder.description
    reminder.recurring = recurring or reminder.recurring # True || False
    reminder.location = location or reminder.location
    reminder.status = status or reminder.status # active, inactive
    reminder.updated_at = datetime.now()

    db.session.commit()

    return reminder.to_dict(), 200

# Delete reminder by id
@reminder_routes.route('/<int:id>', methods=['DELETE'])
@login_required
def delete_reminder(id):
    reminder = Reminder.query.get(id)

    if not reminder:
        return jsonify(error=[f"Unable to find reminder associated with id {id}"])

    if reminder.user_id != current_user.id:
        return jsonify(error=["You don't have permission to delete this reminder"]), 401

    db.session.delete(reminder)
    db.session.commit()

    return {"deleted": reminder.to_dict()}

