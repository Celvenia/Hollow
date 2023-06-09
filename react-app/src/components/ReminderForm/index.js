import React, { useEffect, useState } from "react";
import { postReminder } from "../../store/reminder";
import { useDispatch } from "react-redux";
import "./ReminderForm.css";

export default function ReminderForm({ selectedDate }) {
  const dispatch = useDispatch();
  const [errors, setErrors] = useState([]);

  const handleAddReminder = (e) => {
    e.preventDefault();
    setErrors([]);
    const { date, time, title, description, location, recurring } =
      e.target.elements;

    // current military time
    const currentTime = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

    let currentHour = Number(currentTime.split(":")[0]);
    let currentMinutes = currentTime.split(":")[1];
    let inputHour = Number(time.value.split(":")[0]);
    let inputMinutes = Number(time.value.split(":")[1]);

    if (currentHour > inputHour && currentMinutes > inputMinutes) {
      setErrors(["Reminder cannot be set before the current time"]);
      return;
    }

    const currentDate = new Date();
    const selectedDateValue = new Date(date.value);
    if (currentDate > selectedDateValue) {
      setErrors(["Reminder cannot be set before the current date"]);
      return;
    }

    const newReminder = {
      date: date.value,
      time: timeConverter(time.value),
      title: title.value || "undefined",
      description: description.value || "undefined",
      location: location.value || "undefined",
      recurring: recurring.checked || false,
      status: "active",
    };

    dispatch(postReminder(newReminder));

    e.target.reset();
  };

  const timeConverter = (timeValue) => {
    const hour = parseInt(timeValue);
    const minutes = timeValue.split(":")[1];
    return hour < 12
      ? `${timeValue} AM`
      : `${hour - 12 === 0 ? 12 : hour - 12}:${minutes} PM`;
  };

  useEffect(() => {
    if (selectedDate) {
      document.getElementById("date").value = selectedDate;
    }
  }, [selectedDate]);

  return (
    <div className="reminders">
      {errors.length > 0 && (
        <div className="error-container">
          {errors.map((error, index) => (
            <p key={index} className="error-message">
              {error}
            </p>
          ))}
        </div>
      )}
      <form className="reminder-form" onSubmit={handleAddReminder}>
        <h4 className="reminders-heading">Set Reminder</h4>
        <label className="form-label">Date:</label>
        <input
          type="date"
          id="date"
          className="form-input"
          required
          min={new Date().toISOString().slice(0, 10)}
        />

        <label className="form-label">Time:</label>
        <input type="time" id="time" className="form-input" required />

        <label className="form-label">Title:</label>
        <input type="text" id="title" className="form-input" />

        <label className="form-label">Description:</label>
        <textarea type="text" id="description" className="form-input" />

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
