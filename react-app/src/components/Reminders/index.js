import React, { useEffect, useState } from "react";
import { getReminders } from "../../store/reminder";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faXmark, faEye} from "@fortawesome/free-solid-svg-icons";
import "./Reminders.css"

export default function Reminders() {
  const remindersObj = useSelector((state) => state.reminderReducer);
  const remindersArr = Object.values(remindersObj);
  const [reminders, setReminders] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getReminders());
  }, []);

  return (
    <div>
      <h4 className="reminders-heading">Reminders</h4>

      {remindersArr.length === 0 ? (
        <p className="no-reminders">No reminders.</p>
      ) : (
        <ul className="reminders-list">
          {remindersArr &&
            remindersArr.map((reminder) => (
              <li key={reminder.id} className="reminder-item">
                {reminder.status === "active" ? (
                  <>
                    <div>
                      {reminder.date.slice(0, 16)} {reminder.time}
                    <div>{reminder.description}</div>
                    </div>
                    <div className="reminder-button-container">
                    <FontAwesomeIcon icon={faPenToSquare} />
                    <FontAwesomeIcon icon={faXmark} />
                    <FontAwesomeIcon icon={faEye} />
                    </div>
                  </>
                ) : (
                  ""
                )}
              </li>
            ))}
        </ul>
      )}
    </div>
  );
}
