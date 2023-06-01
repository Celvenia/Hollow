import React, { useEffect, useState } from "react";
import "./Notes.css";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { deleteNote, getNote, updateNote } from "../../store/note";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faFile } from "@fortawesome/free-solid-svg-icons";

// Resize textarea based on window size
function resizeTextarea() {
  const textarea = document.getElementsByClassName("note-textarea")[0];
  if (textarea) {
    const width = window.innerWidth;
    const height = window.innerHeight;
    textarea.style.width = `${width * 0.3}px`;
    textarea.style.height = `${height * 0.25}px`;
  }
}

export default function Notes() {
  const { id } = useParams();
  const notesObj = useSelector((state) => state.noteReducer);
  const note = notesObj[id];
  const dispatch = useDispatch();
  const history = useHistory();
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [newTitle, setNewTitle] = useState("");

  useEffect(() => {
    setLoading(true);
    if (note?.content) {
      setContent(note.content);
      setLoading(false);
    }
    if (note?.title) {
      setTitle(note.title);
      setLoading(false);
    }
  }, [note]);

  useEffect(() => {
    dispatch(getNote(id));
  }, [dispatch, id]);

  useEffect(() => {
    // Attach event listener for resize
    window.addEventListener("resize", resizeTextarea);

    // Initial resize when the page loads
    resizeTextarea();
    return () => {
      window.removeEventListener("resize", resizeTextarea);
    };
  }, []);

  const handleEditClick = () => {
    setEditMode(true);
    setNewTitle(title);
  };

  const handleTitleChange = (e) => {
    setNewTitle(e.target.value);
  };

  const handleTitleSave = () => {
    setEditMode(false);
  };

  const handleUpdateClick = async () => {
    let newNote = {
      ...note,
    };
    newNote.title = newTitle;
    newNote.content = content;
    dispatch(updateNote(newNote));
  };

  const handleDeleteClick = async () => {
    dispatch(deleteNote(id));
    history.push("/notes");
  };

  return (
    <div className="note-page flex-column-center">
      <h1 className="">Add to your journal</h1>
      <section className="note-container">
        {editMode ? (
          <input
            type="text"
            value={newTitle}
            onChange={handleTitleChange}
            onBlur={handleTitleSave}
            autoFocus
          />
        ) : (
          <div className="flex-row">
            <h3>{!loading && title}</h3>
            <FontAwesomeIcon icon={faPen} onClick={handleEditClick} />
          </div>
        )}

        {!loading && (
          <form>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="note-textarea"
            ></textarea>
          </form>
        )}
        <button onClick={handleUpdateClick} className="note-file-button">
          <FontAwesomeIcon icon={faFile} />
          Save Note
        </button>
        <button onClick={handleDeleteClick}>Delete</button>

        {loading && <h1>Loading...</h1>}
      </section>
    </div>
  );
}
