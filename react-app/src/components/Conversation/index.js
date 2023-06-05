import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteConversation,
  getConversation,
  postConversation,
} from "../../store/conversation";
import { getMessages, deleteMessages } from "../../store/message";
import "./Conversation.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faFile } from "@fortawesome/free-solid-svg-icons";

export default function Conversation() {
  const conversation = useSelector((state) => state.conversationReducer);
//   const messagesObj = useSelector((state) => state.messageReducer);
//   const messagesArr = Object.values(messagesObj);
//   const messages = messagesArr.filter(
//     (message) => message.conversation_id === conversation.id
//   );
const messages = conversation.messages

  const dispatch = useDispatch();
  const [display, setDisplay] = useState(false);
  const [focus, setFocus] = useState(false);

  const handleConversationShowClick = () => {
    setFocus(!focus);
    setDisplay(!display);
  };

  const handleCreateConversationClick = () => {
    let newConversation = {
      title: "Journal",
    };
    dispatch(postConversation(newConversation));
  };

  const handleDeleteMessagesClick = () => {
    dispatch(deleteConversation(conversation.id));
    dispatch(getConversation());
  };

  useEffect(() => {
    dispatch(getConversation());
    // dispatch(getMessages())
  }, [dispatch]);

  return (
    <>
      <div className="conversation-title-container">
        <div className="length-100">
          {!conversation && (
            <button onClick={handleCreateConversationClick}>
              Create Conversation
            </button>
          )}
         {conversation && <button onClick={handleDeleteMessagesClick}>Delete Messages</button>}
        </div>
        <div
          className={`conversation-title-${focus}`}
          onClick={handleConversationShowClick}
        >
          {conversation.title}
        </div>
      </div>
      <div className="conversation-container">
        {display && (
          <div>
            {messages &&
              messages.map((message) => (
                <div key={message.id} className="message-container">
                  <div className="user-message">{message.message}</div>
                  <div className="ai-message">{message.ai_response}</div>
                </div>
              ))}
          </div>
        )}
      </div>
    </>
  );
}
