import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
// import { continueConversation, getConversation } from '../../store/conversation'
import { getMessages } from "../../store/message";
import "./Testing.css";

export default function Testing() {
  <div className="clock-page">
    <div className="timer-display">00:00:00</div>
    <div className="clock-container">
      <div className="timer-inputs">
        <input
          type="number"
          id="clock-hour-input"
          placeholder="00"
          min="0"
          max="23"
        />
        <input
          type="number"
          id="clock-minute-input"
          placeholder="00"
          min="0"
          max="59"
        />
      </div>
    </div>
  </div>;
}
// const dispatch = useDispatch();
// const [testCalendar, setTestCalendar] = useState();
// const makeBlankCalendar = () => {
//   for (let i = 0; i < 35; i++) {
//     const day = document.createElement("div");
//     day.classList.add("test-day");

//     const dayText = document.createElement("p");
//     dayText.classList.add("test-day-text");

//     const dayNumber = document.createElement("p");
//     dayNumber.classList.add("test-day-number");

//     const eventName = document.createElement("small");
//     eventName.classList.add("test-event-name");

//     day.appendChild(dayText);
//     day.appendChild(dayNumber);
//     day.appendChild(eventName);

//     testCalendar.appendChild(day);
//   }
// };

// useEffect(() => {
//   setTestCalendar(document.getElementById("test-calendar"));
//   console.log(testCalendar);
//   if (testCalendar) {
//     makeBlankCalendar();
//   }
// }, [testCalendar]);

// return (
//   <>
//     <div className="test-container">
//       <div className="test-header">
//         <h4>Events</h4>
//       </div>
//       <div id="test-calendar"></div>
//     </div>
//   </>
// );
