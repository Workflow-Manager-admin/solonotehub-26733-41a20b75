import React, { useState, useRef } from "react";
import "./App.css";

/*
  SoloNoteHub Main Container
  - Minimalist, light-themed, single-page React app for solo users.
  - Features: Create, Edit, Delete, Search Notes.
  - Sidebar: searchable list of notes + prominent Add button.
  - Main: View & edit note title/content.
  - No backend, all state in-memory. 
  - Color palette: primary #2D3748, secondary #EDF2F7, accent #30cfb4.
*/

// Persistent color palette for the app
const PALETTE = {
  primary: "#2D3748",
  secondary: "#EDF2F7",
  accent: "#30cfb4",
  text: "#222",
  textSecondary: "#666",
  white: "#fff",
};

function generateNoteId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2, 7)}`;
}

/**
 * Note editing area component
 * Allows viewing and editing title/content only if a note is selected.
 *
 * PUBLIC_INTERFACE
 */
function NoteEditor({ note, onChange, onDelete }) {
  if (!note) {
    return (
      <div style={{ color: PALETTE.textSecondary, textAlign: "center", padding: "2rem" }}>
        Select a note or create a new one to get started.
      </div>
    );
  }

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <input
        style={{
          fontSize: "1.3rem",
          fontWeight: 500,
          padding: "0.7rem 0.5rem",
          border: "none",
          background: "transparent",
          outline: "none",
          color: PALETTE.primary,
          borderBottom: `1px solid ${PALETTE.accent}`,
          marginBottom: "1rem",
        }}
        type="text"
        placeholder="Title"
        value={note.title}
        onChange={e => onChange({ ...note, title: e.target.value })}
        aria-label="Note title"
        maxLength={80}
      />

      <textarea
        style={{
          flex: 1,
          minHeight: 0,
          fontSize: "1.08rem",
          border: "none",
          outline: "none",
          resize: "none",
          background: "transparent",
          padding: "0.5rem",
          color: PALETTE.text,
        }}
        placeholder="Write your note..."
        value={note.content}
        onChange={e => onChange({ ...note, content: e.target.value })}
        aria-label="Note content"
      />

      <div style={{ marginTop: "1.2rem", textAlign: "right" }}>
        <button
          style={{
            background: "#f56565",
            color: "#fff",
            border: "none",
            borderRadius: 4,
            padding: "0.45rem 1.1rem",
            fontSize: "1rem",
            cursor: "pointer",
            fontWeight: 500,
            marginLeft: "auto",
            transition: "background 0.12s",
          }}
          onClick={onDelete}
          aria-label="Delete note"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

/**
 * Sidebar: list of notes & search bar
 * PUBLIC_INTERFACE
 */
function Sidebar({ notes, selectedId, onSelect, onAdd, search, setSearch }) {
  return (
    <div
      style={{
        background: PALETTE.secondary,
        width: 270,
        borderRight: `1px solid ${PALETTE.primary}20`,
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        position: "relative",
      }}
    >
      <div style={{ padding: "1.1rem", borderBottom: `1px solid ${PALETTE.primary}22`, background: "#f9fbfc" }}>
        <input
          type="text"
          placeholder="Search notes…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            width: "100%",
            padding: "0.5rem 0.8rem",
            borderRadius: 4,
            border: `1px solid ${PALETTE.primary}22`,
            fontSize: "1rem",
            outlineColor: PALETTE.accent,
            background: "#fff",
            color: PALETTE.text,
          }}
          aria-label="Search notes"
        />
      </div>

      <button
        onClick={onAdd}
        style={{
          width: "calc(100% - 2.2rem)",
          margin: "1rem 1.1rem 0.8rem 1.1rem",
          padding: "0.6rem 0",
          background: PALETTE.accent,
          color: "#fff",
          fontWeight: 600,
          fontSize: "1.09rem",
          border: "none",
          borderRadius: 5,
          cursor: "pointer",
          boxShadow: "0 2px 8px 0 #30cfb435",
          transition: "background 0.18s",
        }}
        aria-label="Add note"
      >
        + Add Note
      </button>

      <nav style={{ flex: 1, overflowY: "auto", marginTop: 0 }}>
        {notes.length === 0 && (
          <div style={{ padding: "2rem 1rem", color: PALETTE.textSecondary, textAlign: "center" }}>
            No notes yet.
          </div>
        )}
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {notes.map(note => (
            <li key={note.id}>
              <button
                style={{
                  width: "100%",
                  textAlign: "left",
                  border: "none",
                  outline: note.id === selectedId ? `2px solid ${PALETTE.accent}` : "none",
                  background: note.id === selectedId ? "#eafffa" : "transparent",
                  color: PALETTE.primary,
                  fontWeight: note.id === selectedId ? 600 : 400,
                  padding: "0.9rem 1.1rem",
                  borderLeft: note.id === selectedId ? `6px solid ${PALETTE.accent}` : "6px solid transparent",
                  borderBottom: `1px solid ${PALETTE.primary}12`,
                  cursor: "pointer",
                  fontSize: "1rem",
                  transition: "background 0.13s, outline 0.13s",
                }}
                onClick={() => onSelect(note.id)}
                aria-current={note.id === selectedId}
                title={note.title || "Untitled"}
              >
                <div style={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  width: "95%"
                }}>
                  {note.title || <span style={{ color: PALETTE.textSecondary }}>Untitled</span>}
                </div>
                <div style={{
                  fontSize: "0.9em",
                  color: PALETTE.textSecondary,
                  marginTop: 2,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis"
                }}>
                  {note.content.slice(0, 38)}{note.content.length > 38 ? "…" : ""}
                </div>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

/**
 * PUBLIC_INTERFACE
 * SoloNoteHub Main App Container
 */
function App() {
  // All notes state (no backend)
  const [notes, setNotes] = useState(() => {
    // Initial "welcome" note for empty state
    return [
      {
        id: generateNoteId(),
        title: "Welcome to SoloNoteHub!",
        content: "Create, edit, search, and organize your personal notes—all in one simple, private space.\n\nYour notes are kept right in your browser.",
      },
    ];
  });
  const [selectedId, setSelectedId] = useState(notes[0]?.id || null);
  const [search, setSearch] = useState("");
  // Used to focus title input after creating a note
  const mainAreaRef = useRef(null);

  // Derived filtered notes (by search query)
  const filteredNotes = search
    ? notes.filter((note) => {
        const term = search.toLowerCase();
        return (
          (note.title && note.title.toLowerCase().includes(term)) ||
          (note.content && note.content.toLowerCase().includes(term))
        );
      })
    : notes;

  // Selected note object
  const selectedNoteObj = notes.find((n) => n.id === selectedId) || null;

  // PUBLIC_INTERFACE
  function handleAddNote() {
    const newNote = {
      id: generateNoteId(),
      title: "",
      content: "",
    };
    setNotes(prev => [newNote, ...prev]);
    setSelectedId(newNote.id);
    setTimeout(() => {
      if (mainAreaRef.current) {
        // Focus title field inside editor if possible
        const input = mainAreaRef.current.querySelector("input");
        if (input) input.focus();
      }
    }, 15);
  }

  // PUBLIC_INTERFACE
  function handleDeleteNote() {
    if (!selectedNoteObj) return;
    const idx = notes.findIndex(n => n.id === selectedNoteObj.id);
    const rest = notes.filter((n) => n.id !== selectedNoteObj.id);
    setNotes(rest);
    // After deletion, select nearest note (above, or first)
    if (rest.length) {
      setSelectedId(rest[idx > 0 ? idx - 1 : 0].id);
    } else {
      setSelectedId(null);
    }
  }

  // PUBLIC_INTERFACE
  function handleUpdateNote(nextNote) {
    setNotes(prev =>
      prev.map(n => (n.id === nextNote.id ? { ...nextNote } : n))
    );
  }

  // PUBLIC_INTERFACE
  function handleSelectNote(id) {
    setSelectedId(id);
  }

  // --- Main Layout (Sidebar + Note Main)
  return (
    <div
      className="solonotehub-app-root"
      style={{
        minHeight: "100vh",
        background: PALETTE.secondary,
        color: PALETTE.text,
        display: "flex",
        fontFamily: "'Inter', 'Roboto', 'Helvetica', 'Arial', sans-serif",
      }}
    >
      <Sidebar
        notes={filteredNotes}
        selectedId={selectedId}
        onSelect={handleSelectNote}
        onAdd={handleAddNote}
        search={search}
        setSearch={setSearch}
      />
      <main
        ref={mainAreaRef}
        style={{
          flex: 1,
          minWidth: 0,
          padding: 0,
          background: "#fff",
          boxShadow: "0 0 2px 0 #2d37480f",
          display: "flex",
          flexDirection: "column",
          height: "100vh",
        }}
      >
        {/* Navbar (minimal, app title) */}
        <header
          style={{
            height: 62,
            borderBottom: `1px solid ${PALETTE.primary}19`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 2.1rem",
            background: "#f6f8fa",
            fontSize: "1.11rem",
            color: PALETTE.primary,
            fontWeight: 600,
            letterSpacing: "0.5px",
            zIndex: 3,
          }}
        >
          <span>
            <span style={{ color: PALETTE.accent, marginRight: 6 }}>☰</span>
            SoloNoteHub
          </span>
          <span style={{ fontWeight: 400, fontSize: "1rem", color: PALETTE.textSecondary }}>
            Solo Mode
          </span>
        </header>
        {/* Note Editor/Viewer */}
        <section style={{ flex: 1, padding: "1.8rem 2.3rem 1.5rem 2.3rem", overflowY: "auto" }}>
          <NoteEditor note={selectedNoteObj} onChange={handleUpdateNote} onDelete={handleDeleteNote} />
        </section>
        {/* Minimal footer */}
        <footer style={{ padding: "0.2rem 2rem 0.4rem 2rem", textAlign: "right", fontSize: "0.98rem", color: PALETTE.textSecondary }}>
          <span style={{ color: PALETTE.accent, fontWeight: 500 }}>SoloNoteHub</span> &middot; minimalist notes app
        </footer>
      </main>
    </div>
  );
}

export default App;
