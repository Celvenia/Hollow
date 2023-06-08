import React, { useEffect, useState } from "react";
import "./Calendar.css";
import { useDispatch, useSelector } from "react-redux";
import OpenModalButton from "../OpenModalButton";
import ReminderForm from "../ReminderForm";

export default function Calendar() {
  const dispatch = useDispatch();
  const [index, setIndex] = useState(0);
  const [daysInMonth, setDaysInMonth] = useState(0);
  const daysOfWeek = ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"];
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const date = new Date().toISOString().slice(0, 10);
  const calendarDays = Array.from({ length: daysInMonth }, (_, i) => ({
    date: i + 1,
    day: i + 1,
    isCurrentMonth: true,
  }));

//   const handleSetReminder = (e) => {};

  const handleBackClick = () => {
    if (index < months.length && index > 0) {
      setIndex(index - 1);
    } else {
      setIndex(11);
    }
  };

  const handleForwardClick = () => {
    if (index < months.length && index < 11) {
      setIndex(index + 1);
    } else {
        setIndex(0)
    }
  };

  useEffect(() => {
    setDaysInMonth(30);
  }, []);

  return (
    <div className="calendar-page">
      <p className="flex-column-center">{date}</p>
      <div className="calendar-navigation">
        <div className="calendar-arrow" onClick={handleBackClick}>⇦</div>
        <h4 className="month-heading">{months[index]}</h4>
        <div className="calendar-arrow" onClick={handleForwardClick}>⇨</div>
      </div>
      <div className="calendar-header">
        {daysOfWeek.map((day) => (
          <span key={day}>
            <h4>{day}</h4>
          </span>
        ))}
      </div>
      <div className="calendar-grid">
        {calendarDays.map((day) => (
          <div key={day.date} className="calendar-day">
            <OpenModalButton
              buttonText={day.day}
              modalComponent={<ReminderForm />}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
