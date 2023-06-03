import React, { useState } from "react";
import "./Clock.css";

const TimeContext = React.createContext();

export default function Clock() {
  let time = new Date().toLocaleTimeString();
  const [currentTime, setCurrentTime] = useState(time);

  const updateTime = () => {
    let time = new Date().toLocaleTimeString();
    setCurrentTime(time);
  };

  // every second update time
  setInterval(updateTime, 1000);

  return (
    <TimeContext.Provider value={currentTime}>
      <div className="clock flex-column-center">
        <h1>{currentTime}</h1>
        <div className="clock-buttons">
          <button>Set Alarm</button>
          <button>Remove Alarm</button>
          <button>Snooze</button>
          <button>Message</button>
        </div>
      </div>
    </TimeContext.Provider>
  );
}
