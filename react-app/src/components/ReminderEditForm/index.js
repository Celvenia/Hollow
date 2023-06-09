import React, { useState } from "react";
import { updateReminder } from "../../store/reminder";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../context/Modal";

// date default input - yyyy-mm-dd
// time default input - HH:mm
export default function ReminderEditForm({ id }) {
  const dispatch = useDispatch();
  const [errors, setErrors] = useState([]);
  const reminderObj = useSelector(state => state.reminderReducer)
  const reminder = reminderObj[id]
  const formattedDate = new Date(reminder.date).toISOString().split("T")[0];
  const { closeModal } = useModal();

  const handleUpdateReminder = (e) => {
    e.preventDefault();
    setErrors([]);
    const { date, time, title, description, location, recurring, status } =
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
    const selectedDate = new Date(date.value);
    if (currentDate > selectedDate) {
      setErrors(["Reminder cannot be set before the current date"]);
      return;
    }

    const updatedReminder = {
      ...reminder,
      date: date.value,
      time: time.value,
      title: title.value,
      description: description.value,
      location: location.value,
      recurring: recurring.checked,
      status: status.value,
    };

    dispatch(updateReminder(updatedReminder));

    // e.target.reset();
    closeModal();
  };


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
      <form className="reminder-form" onSubmit={handleUpdateReminder}>
        <h4 className="reminders-heading">Set Reminder</h4>
        <label className="form-label">Date:</label>
        <input
          type="date"
          id="date"
          className="form-input"
          required
          defaultValue={formattedDate}
          placeholder={formattedDate}
          min={new Date().toISOString().slice(0, 10)}
        />

        <label className="form-label">Time:</label>
        <input
          type="time"
          id="time"
          className="form-input"
          defaultValue={reminder.time.slice(0,5)}
          placeholder={reminder.time.slice(0,5)}
          required
        />

        <label className="form-label">Title:</label>
        <input
          type="text"
          id="title"
          className="form-input"
          defaultValue={reminder.title}
        />

        <label className="form-label">Description:</label>
        <textarea
          type="text"
          id="description"
          className="form-input"
          defaultValue={reminder.description}
        />

        <label className="form-label">Location:</label>
        <input
          type="text"
          id="location"
          className="form-input"
          defaultValue={reminder.location}
        />

        <label className="form-label">Status:</label>
        <input
          type="text"
          id="status"
          className="form-input"
          defaultValue={reminder.status}
        />
        <span>
          <label className="form-label">Recurring:</label>
          <input
            type="checkbox"
            id="recurring"
            className="form-input"
            defaultValue={reminder.recurring}
          />
        </span>

        <button type="submit" className="form-button">
          Update Reminder
        </button>
      </form>
    </div>
  );
}
