import React, { useEffect, useState } from "react";
import { checkAndUpdateReminders, getReminders } from "../../store/reminder";
import { useDispatch, useSelector } from "react-redux";

import "./Reminders.css";
import Reminder from "../Reminder";

export default function Reminders() {
  const remindersObj = useSelector((state) => state.reminderReducer);
  const remindersArr = Object.values(remindersObj);
  const [reminders, setReminders] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAndUpdateReminders())
    dispatch(getReminders());
  }, []);

  return (
    <div>
      <h4 className="reminders-heading">Reminders</h4>

      {remindersArr.length === 0 ? (
        <p className="no-reminders">No reminders.</p>
      ) : (
        <ul className="reminders-list">
          {remindersArr.map((reminder) =>
            reminder.status === "active" ? (
              <Reminder reminder={reminder} key={reminder.id} />
            ) : null
          )}
        </ul>
      )}
    </div>
  );
}
