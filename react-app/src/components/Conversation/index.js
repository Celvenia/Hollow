import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteConversation,
  getConversation,
  postConversation,
  updateConversation,
} from "../../store/conversation";
import { getMessages, deleteMessages, postMessage } from "../../store/message";
import "./Conversation.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faFile, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";


export default function Conversation() {
  const conversation = useSelector((state) => state.conversationReducer);
  const messagesObj = useSelector((state) => state.messageReducer);
  const messages = Object.values(messagesObj);

  const dispatch = useDispatch();
  const [display, setDisplay] = useState(false);
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [messageToPost, setMessageToPost] = useState("");
  const bottomOfConversation = useRef(null);
  const topOfConversation = useRef(null);

  const handleEditClick = () => {
    setEditMode(true);
    setNewTitle(title);
  };

  const handleTitleChange = (e) => {
    setNewTitle(e.target.value);
  };

  const handleTitleSave = () => {
    setEditMode(false);
    if (title !== newTitle) {
      dispatch(updateConversation({ ...conversation, title: newTitle }));
    }
  };

  const handleUpdateClick = () => {
    conversation.title = newTitle;
    const updatedConversation = { ...conversation, title: newTitle };
    dispatch(updateConversation(updatedConversation));
  };

  const handleTitleBlur = () => {
    if (title !== newTitle) {
      setTitle(newTitle);
      handleUpdateClick();
    }
    setEditMode(false);
  };

  const handleConversationShowClick = () => {
    setShow(!show);
    setDisplay(!display);
  };

  const handleDeleteMessagesClick = () => {
    dispatch(deleteMessages());
    dispatch(getConversation())
  };

  const handleSendQueryClick = () => {
    dispatch(postMessage(messageToPost));
  };

  const handleMessageToPost = (e) => {
    setMessageToPost(e.target.value);
  };

  const handleScrollToBottom = () => {
    bottomOfConversation.current.scrollIntoView({
      behavior: "smooth",
      block: "end",
      inline: "nearest",
    });
  };

  const handleScrollToTop = () => {
    topOfConversation.current.scrollIntoView({
      behavior: "smooth",
      block: "end",
      inline: "nearest",
    });
  };

  useEffect(() => {
    dispatch(getConversation());
    dispatch(getMessages());
  }, [dispatch]);

  useEffect(() => {
    if (conversation) {
      setTitle(conversation.title);
    }
  }, [conversation]);
  return (
    <div className="conversation-container">
      <div
        ref={topOfConversation}
        className="length-100 conversation-button-container"
      >
        <button onClick={handleScrollToBottom}>⇩</button>
        {show ? (
          <>
            <button onClick={handleConversationShowClick}><FontAwesomeIcon icon={faEyeSlash} /></button>
            <button onClick={handleDeleteMessagesClick}>Delete Messages</button>
          </>
        ) : (
          <button onClick={handleConversationShowClick}><FontAwesomeIcon icon={faEye} /></button>
        )}
        {!display && <button onClick={handleSendQueryClick}>Send Query</button>}
      </div>
      {editMode ? (
        <div className="title-active-edit">
          <input
            type="text"
            maxLength="40"
            value={newTitle}
            onBlur={handleTitleBlur}
            onChange={handleTitleChange}
            autoFocus
          />
        </div>
      ) : (
        <div className="title-inactive-edit">
          <span
            title="conversation title"
          >
            <h4>{title}</h4>
          </span>
          <FontAwesomeIcon
            icon={faPen}
            onClick={handleEditClick}
            className="edit-icon"
          />
        </div>
      )}

      <div className="conversation-container">
        {display && (
          <div>
            {messages &&
              messages.map((message) => (
                // <div>
                //   {
                <div key={message.id} className="message-container">
                  <div className="user-message">{message.message}</div>
                  <div className="ai-message">{message.ai_response}</div>
                </div>
                //   }
                // </div>
              ))}
          </div>
        )}

        {!display && (
          <div className="message-textarea-container">
            {/* <h4 className="flex-column-center"> Hollow </h4> */}
            <textarea
              id="message-textarea"
              onChange={handleMessageToPost}
              placeholder="Write a question here, then send query..."
            ></textarea>
            <div className="scroll-top-button">
              <button onClick={handleScrollToTop} ref={bottomOfConversation}>
                ⇧
              </button>
            </div>
          </div>
        )}
        {display && (
          <div className="scroll-top-button">
            <button onClick={handleScrollToTop} ref={bottomOfConversation}>
              ⇧
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
