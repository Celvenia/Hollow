import React, { useState, useEffect } from "react";
import "./Clock.css";

export default function Clock() {
  const [currentTime, setCurrentTime] = useState(
    new Date().toLocaleTimeString()
  );
  const [alarmTime, setAlarmTime] = useState("");
  const [isAlarmSet, setIsAlarmSet] = useState(false);
  const [isSnoozeEnabled, setIsSnoozeEnabled] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => {
      clearInterval(timer);
    };
  }, [alarmTime]);

  const handleRemoveAlarm = () => {
    setAlarmTime("");
    setIsAlarmSet(false);
    setIsSnoozeEnabled(false);
  };

  const handleAlarmChange = (e) => {
    setAlarmTime(e.target.value);
  };

  const setAlarm = () => {
    if (alarmTime) {
      console.log("Set alarm for", alarmTime);
      setIsAlarmSet(true);
    }
  };

  const handleSnooze = () => {
    setIsSnoozeEnabled(true);
    setTimeout(() => {
      setIsSnoozeEnabled(false);
    }, 5000);
  };

  return (
    <div className="clock flex-column-center">
      <h1>{currentTime}</h1>
      <div className="clock-buttons">
        <input
          id="alarm-time"
          type="time"
          value={alarmTime}
          onChange={handleAlarmChange}
        />
        {!isAlarmSet && <button onClick={setAlarm}>Set Alarm</button>}
        {isAlarmSet && (
          <button onClick={handleRemoveAlarm}>Remove Alarm</button>
        )}
        {isSnoozeEnabled ? (
          <button className="snooze-false" disabled>
            Snooze
          </button>
        ) : (
          <button className="snooze-true" onClick={handleSnooze}>
            Snooze
          </button>
        )}
        <button>Message</button>
      </div>
      {isAlarmSet && (
        <p>
          Alarm is set for: <strong>{alarmTime}</strong>
        </p>
      )}
    </div>
  );
}
