from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models import db, Reminder
from datetime import datetime

reminder_routes = Blueprint('reminders', __name__)

# strptime - string parse time methods
# %H: 2-digit hour (24-hour format)
# %M: 2-digit minute (01, 59)
# %S: 2-digit second (01, 59)
# %a: Weekday as locale's abbreviated name (Sun, Mon, Tue)
# %d: Day of the month as a zero-padded decimal number (01, 31)
# %m: 2-digit month (01, 12)
# %b: Month as locale's abbreviated name (Jan, Feb, etc)
# %Y: Year with century as a decimal number (2023)

# date_str = request.json.get('date')
# date = datetime.strptime(date_str, '%Y-%m-%d').date()



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
    current = datetime.now().date()

    date_str = request.json.get('date')
    date = datetime.strptime(date_str, '%Y-%m-%d').date()
    if(date < current):
        return {'errors': ['Cannot set reminder in the past']}
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

    reminder.date = date or reminder.date  # Date
    reminder.time = time or reminder.time  # HH:MM AM || PM
    reminder.title = title or reminder.title
    reminder.description = description or reminder.description
    reminder.recurring = recurring or reminder.recurring  # True || False
    reminder.location = location or reminder.location
    reminder.status = status or reminder.status  # active, completed, cancelled
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


# check and update reminders that have passed current date/time
@reminder_routes.route('/check-and-update', methods=['POST'])
@login_required
def check_and_update_reminders():
    now = datetime.now()

    reminders = Reminder.query.filter_by(user_id=current_user.id).all()

    for reminder in reminders:
        # Convert reminder.date string to datetime.date object
        # reminder_date = datetime.strptime(reminder.date, '%a, %d %b %Y').date()

        # Set status to "completed" for past reminders
        if reminder.date < now.date():
            reminder.status = 'completed'
        # Set status to "completed" for reminders with a past time on the current date
        elif reminder.date == now and reminder.time < datetime.now().time():
            reminder.status = 'completed'

    db.session.commit()
    reminders = Reminder.query.filter_by(user_id=current_user.id).all()
    return {'reminders': [reminder.to_dict() for reminder in reminders]}
