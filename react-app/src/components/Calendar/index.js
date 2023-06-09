import React, { useEffect, useState } from "react";
import "./Calendar.css";
import { useDispatch, useSelector } from "react-redux";
import OpenModalButton from "../OpenModalButton";
import ReminderForm from "../ReminderForm";

export default function Calendar() {
  const [index, setIndex] = useState(new Date().getMonth());
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
  const currentDate = new Date();
  const date = currentDate.toDateString()
  let currentYear = currentDate.getFullYear();
  const firstDayOfMonth = new Date(currentYear, index, 1);
  const lastDayOfMonth = new Date(currentYear, index + 1, 0);
  const startDay = firstDayOfMonth.getDay();
  const endDay = lastDayOfMonth.getDate();
  const previousMonthLastDay = new Date(currentYear, index, 0).getDate();
  const nextMonthFirstDay = new Date(currentYear, index + 1, 1).getDay();
  const calendarDays = Array.from(
    { length: startDay + endDay + (6 - nextMonthFirstDay + 1) },
    (_, i) => {
      let dayNumber;
      let isCurrentMonth;
      if (i < startDay) {
        dayNumber = previousMonthLastDay - (startDay - i - 1);
        isCurrentMonth = false;
      } else if (i >= startDay && i < startDay + endDay) {
        dayNumber = i + 1 - startDay;
        isCurrentMonth = true;
      } else {
        dayNumber = i + 1 - (startDay + endDay);
        isCurrentMonth = false;
      }
      const dayDate = new Date(currentYear, index, dayNumber);
      const dayFormatted = dayDate.toISOString().slice(0, 10);
      return {
        date: dayFormatted,
        day: dayNumber,
        isCurrentMonth,
      };
    }
  );

  const handleBackClick = () => {
    setIndex(index === 0 ? 11 : index - 1);
    if (index === 0) {
      currentYear--;
    }
  };

const handleForwardClick = () => {
  setIndex((prevIndex) => {
    const newIndex = prevIndex === 11 ? 0 : prevIndex + 1;
    if (newIndex === 0) {
      currentYear++;
    }
    return newIndex;
  });
};


  useEffect(() => {
    setDaysInMonth(endDay);
  }, [index]);

  return (
    <div className="calendar-page">
      <p className="flex-column-center">{date}</p>
      <div className="calendar-navigation">
        <div className="calendar-arrow" onClick={handleBackClick}>
          ⇦
        </div>
        <h4 className="month-heading">
          {months[index]} {currentYear}
        </h4>
        <div className="calendar-arrow" onClick={handleForwardClick}>
          ⇨
        </div>
      </div>
      <div className="calendar-header">
        {daysOfWeek.map((day) => (
          <span key={day}>
            <h4>{day}</h4>
          </span>
        ))}
      </div>
      <div className="calendar-grid">
        {calendarDays.map((day, i) => (
          <div
            key={`${day.date}-${day.day}-${i}`}
            className={`calendar-day ${
              day.isCurrentMonth ? "" : "not-current-month"
            }`}
          >
            {day.isCurrentMonth && (
              <OpenModalButton
                buttonText={day.day}
                modalComponent={
                  <ReminderForm
                    selectedDate={day.date}
                  />
                }
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
