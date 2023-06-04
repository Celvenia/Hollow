import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getConversation } from "../../store/conversation";
import { getMessages } from "../../store/message";
import "./Conversation.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faFile } from "@fortawesome/free-solid-svg-icons";

export default function Conversation() {
  const conversation = useSelector((state) => state.conversationReducer);
  const messagesObj = useSelector((state) => state.messageReducer);
  const messagesArr = Object.values(messagesObj);
   const messages = messagesArr.filter(
     (message) => message.conversation_id === conversation.id
   );
  const dispatch = useDispatch();
  const [display, setDisplay] = useState(false);
  const [focus, setFocus] = useState(false);

  const handleConversationClick = () => {
    setFocus(!focus);
    setDisplay(!display);
  };

  useEffect(() => {
    dispatch(getConversation());
    dispatch(getMessages());
  }, [dispatch]);

  return (
    <>
        <div className="conversation-title-container">
            <div
            className={`conversation-title-${focus}`}
            onClick={handleConversationClick}
            >
            {conversation.title}
            </div>
            <div className={focus ? "hidden" : "conversation-image"}>
                <img src="https://res.cloudinary.com/dtzv3fsas/image/upload/v1685756758/Personal%20Assistant/artworks-z1oRUQbBvdc5PyKz-8Mz1xg-t500x500_l2kcmt.jpg"/>
                
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
