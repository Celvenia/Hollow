from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models import db, Reminder
from datetime import datetime, timedelta

reminder_routes = Blueprint('reminders', __name__)

# Get all reminders


@reminder_routes.route('', methods=['GET'])
@login_required
def get_reminders():
    reminders = Reminder.query.filter_by(user_id=current_user.id).all()
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
    current = datetime.now()

    datetime_str = request.json.get('date_time')
    date_time = datetime.strptime(datetime_str, '%Y-%m-%d %H:%M:%S')
    if date_time < current:
        return {'errors': ['Cannot set reminder in the past']}
    title = request.json.get('title')
    description = request.json.get('description')
    recurring = request.json.get('recurring')
    location = request.json.get('location')
    status = request.json.get('status')
    user_id = current_user.id

    new_reminder = Reminder(
        date_time=date_time,
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

    now = datetime.now()
    now_local = now + timedelta(hours=10, minutes=9)

    date_str = now_local.strftime('%Y-%m-%d')  # format 'YYYY-MM-DD'
    date_local = date_str[:10]

    time_str = now_local.strftime('%H:%M:%S')  # format 'HH:MM:SS'
    time_local = time_str[:8]
    reminder_date_str = reminder.date_time.strftime('%Y-%m-%d')
    reminder_date = reminder_date_str[:10]
    reminder_time_str = reminder.date_time.strftime('%H:%M:%S')
    reminder_time = reminder_time_str[:8]

    datetime_str = request.json.get('date_time')
    parsed_date_time = datetime.strptime(datetime_str, '%Y-%m-%d %H:%M:%S')
    title = request.json.get('title')
    description = request.json.get('description')
    recurring = request.json.get('recurring')
    location = request.json.get('location')
    status = request.json.get('status')

    reminder.status = status or reminder.status
    reminder.date_time = parsed_date_time or reminder.date_time
    reminder.title = title or reminder.title
    reminder.description = description or reminder.description
    reminder.recurring = recurring or reminder.recurring
    reminder.location = location or reminder.location
    if date_local > reminder_date:
        reminder.status = "completed"
    elif date_local == reminder_date and time_local > reminder_time:
        reminder.status = "completed"
    reminder.updated_at = datetime.utcnow()

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


# check and update reminders that have passed current date/time
@reminder_routes.route('/check-and-update', methods=['POST'])
@login_required
def check_and_update_reminders():
    now = datetime.now()
    now_local = now + timedelta(hours=10, minutes=9)

    date_str = now_local.strftime('%Y-%m-%d')  # format 'YYYY-MM-DD'
    date_local = date_str[:10]

    time_str = now_local.strftime('%H:%M:%S')  # format 'HH:MM:SS'
    time_local = time_str[:8]

    reminders = Reminder.query.filter_by(user_id=current_user.id).all()

    for reminder in reminders:
        reminder_date_str = reminder.date_time.strftime('%Y-%m-%d')
        reminder_date = reminder_date_str[:10]
        reminder_time_str = reminder.date_time.strftime('%H:%M:%S')
        reminder_time = reminder_time_str[:8]

        if date_local > reminder_date:
            reminder.status = "completed"
        elif date_local == reminder_date and time_local > reminder_time:
            reminder.status = "completed"

    db.session.commit()
    reminders = Reminder.query.filter_by(user_id=current_user.id).all()
    return {'reminders': [reminder.to_dict() for reminder in reminders]}
