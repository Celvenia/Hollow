import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { postMessage } from "../../store/message";
import { getNotes } from "../../store/note";

// import "./Message.css";

// https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API/Using_the_Web_Speech_API#html_and_css_2
export default function Message(spoken) {
  const messagesObj = useSelector((state) => state.messageReducer);
  const messagesArr = Object.values(messagesObj);
  console.log(messagesArr)

  useEffect(() => {
    // getConversation();
  })

  return (
    <div className="flex-column-center">
      {/* <p>{spoken && `You said ${spoken}`}</p>
      <p>
        {messagesArr ? messagesArr[messagesArr.length - 1]?.ai_response : ""}
      </p> */}
    </div>
  );
}
