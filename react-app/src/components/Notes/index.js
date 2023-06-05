import React, { useEffect, useState } from "react";
import "./Notes.css";
import { useDispatch, useSelector } from "react-redux";
import { getNotes } from "../../store/note";
import Note from "../Note";

export default function Notes() {
  const currentUser = useSelector((state) => state.session.user);
  const notesObj = useSelector((state) => state.noteReducer);
  const dispatch = useDispatch();
  const [selectedNote, setSelectedNote] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const notesArr = Object.values(notesObj);
  const notes = notesArr.filter((note) => note.user_id === currentUser.id);

  const handleNoteSelect = (note) => {
    setSelectedNote(note);
    setIsOpen(false);
  };


  useEffect(() => {
    dispatch(getNotes());
  }, []);

  return (
    <>
      <div className="note-dropdown-container">
        <div
          className="note-dropdown-header"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span>{selectedNote ? selectedNote.title : "Select a Note"}</span>
          <div className={`arrow ${isOpen ? "up" : "down"}`}>⇩</div>
        </div>
        {isOpen && (
          <ul className="dropdown-notes">
            {notes.map((note) => (
              <li
                key={note.id}
                className={`Note ${selectedNote === note ? "selected" : ""}`}
                onClick={() => handleNoteSelect(note)}
              >
                {notesObj[note.id].title}
              </li>
            ))}
          </ul>
        )}
      </div>
      <Note note={selectedNote}/>
    </>
  );
}
