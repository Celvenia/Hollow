import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { postNote } from "../../store/note";
import "./NoteCreate.css";

export default function NoteCreate() {
  const dispatch = useDispatch();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleContentChange = (e) => {
    setContent(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newNote = {
      title,
      content,
    };
    dispatch(postNote(newNote));
    setTitle("");
    setContent("");
  };

  return (
    <div className="note-create-container">
      <h4>New Note</h4>
      <form onSubmit={handleSubmit}>
        <div className="note-create-form-element">
          <input
           className="note-create-input"
           title="note title"
            type="text"
            value={title}
            onChange={handleTitleChange}
            required
          />
        </div>
        <div className="note-create-form-element">
          <textarea
            className="note-create-textarea"
            title="note context"
            value={content}
            onChange={handleContentChange}
            required
          ></textarea>
        </div>
        <button type="submit">Create</button>
      </form>
    </div>
  );
}
