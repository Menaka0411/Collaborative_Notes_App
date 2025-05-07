import React, { useState, useEffect } from "react"; 
import { useNavigate } from "react-router-dom";
import NoteEditor from "./NoteEditor";
import NoteList from "./NoteList";
import NoteView from "./NoteView";
import SharedNote from "./SharedNote";
import { IoSearchOutline, IoAddSharp } from "react-icons/io5";
import axios from "axios";
import { io } from "socket.io-client";

const Dashboard = ({ setIsLoggedIn }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [username, setUsername] = useState(""); 
  const navigate = useNavigate();
  const [sharedNotes, setSharedNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const socket = io("http://localhost:5000"); 
  
    socket.on("connect", () => {
      console.log("Connected to socket.io server:", socket.id);
    });
  
    socket.on("disconnect", () => {
      console.log("Disconnected from socket.io server");
    });
  
    return () => {
      socket.disconnect();
    };
  }, []);
  
  
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    axios
      .get(`http://localhost:5000/api/notes?userId=${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`
        }
      })
      .then(res => setNotes(res.data))
      .catch(err => console.error(err));
  }, []);
  

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername); 
    }
  }, []);

  const addNote = async (note) => {
    const userId = localStorage.getItem("userId");
    const newNote = {
      ...note,
      userId,
      createdAt: new Date().toISOString(),
    };
  
    try {
        const res = await fetch("http://localhost:5000/api/notes/create", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(newNote),
        });
          
      const savedNote = await res.json();
      setNotes((prev) => [...prev, savedNote]);
    } catch (err) {
      console.error("Error saving note:", err);
    }
  
    setShowEditor(false);
  };

  useEffect(() => {
    const fetchSharedNotes = async () => {
      setLoading(true);
      try {
        const res = await fetch("http://localhost:5000/api/notes/shared", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
  
        if (res.ok) {
          const data = await res.json();
          setSharedNotes(data); 
        } else {
          console.error("Error fetching shared notes:", res.statusText);
        }
      } catch (err) {
        console.error("Error fetching shared notes:", err);
      } finally {
        setLoading(false); 
      }
    };
  
    fetchSharedNotes();
  }, []); 
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  const handleAcceptAndNavigate = async (noteId) => {
    const userId = localStorage.getItem("userId");
  
    try {
      await fetch(`http://localhost:5000/api/notes/accept/${noteId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ userId }),
      });
  
      navigate(`/shared/${noteId}`);
    } catch (err) {
      console.error("Failed to accept shared note", err);
    }
  };
  
  const handleUpdateNote = async (updatedNote) => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/notes/${updatedNote._id}`,
        updatedNote
      );
      const updated = res.data;
        setNotes((prev) =>
        prev.map((note) => (note._id === updated._id ? updated : note))
      );
    } catch (err) {
      console.error("Error updating note:", err);
    }
  };
  
  const handleDeleteNote = async (noteToDelete) => {
    try {
      const res = await axios.delete(`http://localhost:5000/api/notes/${noteToDelete._id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
  
      if (res.status === 200) {
        setNotes((prev) => prev.filter((note) => note._id !== noteToDelete._id));
        console.log("Note deleted:", noteToDelete._id);
      } else {
        console.error("Failed to delete note");
      }
    } catch (err) {
      console.error("Error deleting note:", err);
    }
  };
  

  const filteredNotes = notes.filter((note) => {
    const search = searchTerm.toLowerCase();
    return (
      note.title.toLowerCase().includes(search) ||
      note.content.toLowerCase().includes(search) ||
      note.tags.some((tag) => tag.toLowerCase().includes(search)) ||
      note.createdAt.toLowerCase().includes(search)
    );
  });

  return (
    <div className="min-h-screen bg-white text-gray-800 relative">
      <header className="fixed top-0 left-0 w-full z-50 bg-white flex items-center justify-between px-4 sm:px-6 py-4 shadow-md">
        <h1 className="text-xl font-bold">Notes App</h1>
        <div className="relative w-1/2 max-w-md mx-auto">
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <IoSearchOutline />
          </span>
          <input
            type="text"
            placeholder="Search notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
          />
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-700">{username}</span> {/* Display username here */}
          <div className="relative">
            <img
              src="https://images.icon-icons.com/1378/PNG/512/avatardefault_92824.png"
              alt="User Profile"
              className="w-10 h-10 rounded-full cursor-pointer"
              onClick={() => setShowDropdown((prev) => !prev)}
            />
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                <button
                    onClick={() => {
                        localStorage.clear();
                        setIsLoggedIn(false);
                        setShowDropdown(false); 
                        navigate("/login");
                        window.location.reload();
                    }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-gray-800"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="pt-32 sm:pt-24">
        {showEditor && (
          <NoteEditor onClose={() => setShowEditor(false)} onSave={addNote} />
        )}

        <div className="mt-4 px-6 mb-8">
          <NoteList
            notes={filteredNotes}
            onView={setSelectedNote}
            onUpdate={handleUpdateNote}
            onDelete={handleDeleteNote}
          />
        </div>

        {selectedNote && (
          <NoteView note={selectedNote} onClose={() => setSelectedNote(null)} />
        )}
      <section className="mt-24 px-4">
        <h2 className="text-lg font-semibold mb-4">Shared Notes</h2>
        <SharedNote
          sharedNotes={sharedNotes}
          handleAcceptAndNavigate={handleAcceptAndNavigate}
        />
      </section>
      </main>
     
      <button
        onClick={() => setShowEditor(true)}
        className="fixed bottom-6 right-6 bg-blue-600 text-white p-3 rounded-lg shadow-lg hover:bg-blue-700 transition"
        aria-label="Add Note"
      >
        <IoAddSharp size={24} />
      </button>
    </div>
  );
};

export default Dashboard;
