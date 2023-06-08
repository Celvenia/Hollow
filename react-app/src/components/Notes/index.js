import React, { useEffect, useRef, useState } from "react";
import "./Notes.css";
import { useDispatch, useSelector } from "react-redux";
import { getNotes } from "../../store/note";
import Note from "../Note";
import NoteCreate from "../NoteCreate";

export default function Notes() {
  const currentUser = useSelector((state) => state.session.user);
  const notesObj = useSelector((state) => state.noteReducer);
  const dispatch = useDispatch();
  const [selectedNote, setSelectedNote] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [displayCreate, setDisplayCreate] = useState(true);
  const notesArr = Object.values(notesObj);
  const notes = notesArr.filter((note) => note.user_id === currentUser.id);
  const dropdownRef = useRef(null);

  const handleNoteSelect = (note) => {
    setSelectedNote(note);
    setIsOpen(false);
  };

  useEffect(() => {
    dispatch(getNotes());
  }, []);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("click", handleOutsideClick);

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  return (
    <>
      <div className="note-dropdown-container">
        <button title="create new note" onClick={(e) => setSelectedNote(null)}>
          Create Note Form
        </button>
        <div
          ref={dropdownRef}
          className="note-dropdown-header"
          title="note dropdown"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span>
            {selectedNote ? notesObj[selectedNote.id]?.title : "Notes"}
          </span>
          <div className={`arrow ${isOpen ? "up" : "down"}`}>⇩</div>
        </div>
        {isOpen && (
          <ul className="dropdown-notes">
            {notes.map((note) => (
              <li
                key={note.id}
                className={`Note ${
                  selectedNote?.id === note?.id ? "selected" : ""
                }`}
                onClick={() => handleNoteSelect(note)}
              >
                {notesObj[note.id].title}
              </li>
            ))}
          </ul>
        )}
      </div>
      {selectedNote ? <Note note={selectedNote} /> : <NoteCreate />}
    </>
  );
}
