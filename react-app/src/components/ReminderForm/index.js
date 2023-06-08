import React from "react";
import { postReminder } from "../../store/reminder";
import { useDispatch } from "react-redux";
import "./ReminderForm.css";

export default function ReminderForm() {
  const dispatch = useDispatch();

  const handleAddReminder = (e) => {
    e.preventDefault();
    const { date, time, title, description, location, recurring} =
      e.target.elements;


    const newReminder = {
      date: date.value,
      time: timeConverter(time.value),
      title: title.value || "undefined",
      description: description.value || "undefined",
      location: location.value || "undefined",
      recurring: recurring.checked || false,
      status: "active"
    };

    dispatch(postReminder(newReminder));

    e.target.reset();
  };

  const timeConverter = (timeValue) => {
    const hour = parseInt(timeValue);
    const minutes = timeValue.split(':')[1]
    return hour < 12 ? `${timeValue} AM` : `${hour - 12 === 0 ? 12 : hour - 12}:${minutes} PM`
  };

  return (
    <div className="reminders">
      <form className="reminder-form" onSubmit={handleAddReminder}>
        <h4 className="reminders-heading">Set Reminder</h4>
        <label className="form-label">Date:</label>
        <input type="date" id="date" className="form-input" required />

        <label className="form-label">Time:</label>
        <input type="time" id="time" className="form-input" required />

        <label className="form-label">Title:</label>
        <input type="text" id="title" className="form-input" />

        <label className="form-label">Description:</label>
        <textarea
          type="text"
          id="description"
          className="form-input"
        
        />

        <label className="form-label">Location:</label>
        <input type="text" id="location" className="form-input" />
        <span>
          <label className="form-label">Recurring:</label>
          <input type="checkbox" id="recurring" className="form-input" />
        </span>

        <button type="submit" className="form-button">
          Add Reminder
        </button>
      </form>
    </div>
  );
}
