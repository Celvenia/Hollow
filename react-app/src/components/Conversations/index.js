import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getConversations,
  updateConversation,
  deleteConversation,
} from "../../store/conversation";
import { getMessages, deleteMessages, postMessage } from "../../store/message";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComments } from "@fortawesome/free-solid-svg-icons";
import Conversation from "../Conversation";
import "./Conversations.css";

export default function Conversations() {
  const conversationsObj = useSelector((state) => state.conversationReducer);
  const conversationsArr = Object.values(conversationsObj);
  //   testing

  const dispatch = useDispatch();
  const dropdownRef = useRef(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    dispatch(getConversations());
  }, [dispatch]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      // if DOM element rendered && event.target(click) is not contained in DOM element setShow(false)
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShow(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleIconClick = (e) => {
    // click event was propagating to document, preventing dropdown from opening
    e.stopPropagation();
    setShow(!show);
  };

  return (
    <div className="conversations-container">
      <FontAwesomeIcon
        icon={faComments}
        className="nav-icon"
        onClick={handleIconClick}
      />
      {show && conversationsArr ? (
        <div className="conversations-dropdown" ref={dropdownRef}>
          {conversationsArr.map((conversation) => {
            return (
              <div className="conversations-options">
                <div>{conversation.title}</div>
              </div>
            );
          })}
        </div>
      ) : (
        ""
      )}

      
    </div>
  );
  
}
