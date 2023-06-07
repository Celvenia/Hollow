import React, { useEffect, useState } from "react";
import "./Calendar.css";
import { useDispatch, useSelector } from "react-redux";
import { getReminders, postReminder } from "../../store/reminder";

export default function Calendar() {
  const [reminders, setReminders] = useState([]);
  const [daysInMonth, setDaysInMonth] = useState(0);
  const daysOfWeek = ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"];
  const remindersObj = useSelector((state) => state.reminderReducer);
  const remindersArr = Object.values(remindersObj);
  const dispatch = useDispatch();
  const date = new Date().toISOString().slice(0, 10);

  const calendarDays = Array.from({ length: daysInMonth }, (_, i) => ({
    date: i + 1,
    day: i + 1,
    isCurrentMonth: true,
  }));

  const handleAddReminder = (e) => {
    e.preventDefault();
    const { date, time, title, description, location, recurring, status } =
      e.target.elements;

    const newReminder = {
      date: date.value,
      time: time.value,
      title: title.value,
      description: description.value,
      location: location.value,
      recurring: recurring.checked,
      status: status.value,
    };

    setReminders([...reminders, newReminder]);
    dispatch(postReminder(newReminder));

    e.target.reset();
  };

  useEffect(() => {
    setDaysInMonth(30);
    dispatch(getReminders());
  }, []);

  return (
    <div className="calendar-page">
      <div className="calendar-navigation">
        <div>⇦</div>
        <p>{date}</p>
        <div>⇨</div>
      </div>
      <h4 className="month-heading">October</h4>
      <div className="calendar-header">
        {daysOfWeek.map((day) => (
          <span key={day}>
            <h4>{day}</h4>
          </span>
        ))}
      </div>
      <div className="calendar-grid">
        {calendarDays.map((day) => (
          <div
            key={day.date}
            className={`calendar-day ${
              day.isCurrentMonth ? "" : "other-month"
            }`}
          >
            <span className="day-number">{day.day}</span>
          </div>
        ))}
      </div>

      <div className="reminders">
        <form className="reminder-form" onSubmit={handleAddReminder}>
            <h4 className="reminders-heading" >Set Reminder</h4>
          <label className="form-label">Date:</label>
          <input type="date" id="date" className="form-input" required />

          <label className="form-label">Time:</label>
          <input type="time" id="time" className="form-input" required />

          <label className="form-label">Title:</label>
          <input type="text" id="title" className="form-input" required />

          <label className="form-label">Description:</label>
          <input type="text" id="description" className="form-input" required />

          <label className="form-label">Location:</label>
          <input type="text" id="location" className="form-input" required />
          <span>
            <label className="form-label">Recurring:</label>
            <input type="checkbox" id="recurring" className="form-input" />
          </span>

          <label className="form-label">Status:</label>
          <select id="status" className="form-input" required>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="canceled">Canceled</option>
          </select>

          <button type="submit" className="form-button">
            Add Reminder
          </button>
        </form>
        <h4 className="reminders-heading">Reminders</h4>
        {remindersArr.length === 0 ? (
          <p className="no-reminders">No reminders.</p>
        ) : (
          <ul className="reminders-list">
            {remindersArr &&
              remindersArr.map((reminder) => (
                <li key={reminder.id} className="reminder-item">
                  <span>{reminder.date}</span>
                  <span>{reminder.time}</span>
                  <span>{reminder.description}</span>
                </li>
              ))}
          </ul>
        )}
      </div>
    </div>
  );
}
