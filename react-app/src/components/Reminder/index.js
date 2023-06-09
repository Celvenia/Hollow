import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPenToSquare,
  faXmark,
  faEye,
} from "@fortawesome/free-solid-svg-icons";
import { deleteReminder } from "../../store/reminder";
import { useDispatch } from "react-redux";
import ReminderEditForm from "../ReminderEditForm";
import OpenModalButton from "../OpenModalButton";

// {
//     "created_at": "Sat, 03 Jun 2023 18:40:44 GMT",
//     "date": "Mon, 05 Jun 2023 00:00:00 GMT",
//     "description": "Weekly Testing",
//     "id": 1,
//     "location": "Testing Room",
//     "recurring": true,
//     "status": "inactive", or completed/cancelled
//     "time": "09:00 AM",
//     "title": "Testing",
//     "updated_at": "Sat, 03 Jun 2023 18:58:16 GMT",
//     "user_id": 1
// }

export default function Reminder({ reminder }) {
  const [show, setShow] = useState(false);
  const dispatch = useDispatch();

  const handleShowClick = () => {
    setShow(!show);
  };

  const handleDeleteClick = () => {
    dispatch(deleteReminder(reminder.id));
  };

  const handleEditClick = () => {};

  return (
    <div className="reminder-item">
      <div className="reminder-info">
        {reminder.date.slice(0, 16)} {reminder.time}
        <div>{reminder.description}</div>
        {show && (
          <div>
            <div>Recurring: {`${reminder.recurring}`}</div>
            <div>Location: {reminder.location}</div>
            <div>Status: {reminder.status}</div>
          </div>
        )}
      </div>
      <div className="reminder-button-container">
        <OpenModalButton
          buttonText={<FontAwesomeIcon icon={faPenToSquare} />}
          modalComponent={<ReminderEditForm id={reminder.id}/>}
        />
        <FontAwesomeIcon onClick={handleDeleteClick} icon={faXmark} />
        <FontAwesomeIcon onClick={handleShowClick} icon={faEye} />
      </div>
    </div>
  );
}
