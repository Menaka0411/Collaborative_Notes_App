import React, { useState } from "react";
import { MdEdit, MdDelete } from "react-icons/md";
import { IoMdShare } from "react-icons/io";
import NoteEdit from "./NoteEdit";
import NoteShare from "./NoteShare";

const NoteList = ({ notes, onView, onDelete, onUpdate }) => {
  const [editingNote, setEditingNote] = useState(null);
  const [sharingNote, setSharingNote] = useState(null);

  const handleNoteClick = (note, e) => {
    if (e.target.closest("button")) return;
    onView(note);
  };

  const handleUpdate = async (updatedNote) => {
    console.log(updatedNote);
    try {
      const res = await fetch(`http://localhost:5000/api/notes/${updatedNote._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedNote),
      });
  
      const data = await res.json();
  
      if (res.ok) {
        onUpdate((prevNotes) =>
          prevNotes.map((note) =>
            note._id === data._id ? data : note
          )
        );
      } else {
        console.error("Failed to update note", data);
      }
    } catch (err) {
      console.error("Error updating note", err);
    }
  };
  

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {notes.map((note) => (
          <div
            key={note._id}
            className="w-full sm:w-[90%] md:w-full h-[220px] bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-400 shadow-md rounded-[30px_5px_30px_5px] p-4 
            cursor-pointer hover:shadow-xl transition-all duration-300 ease-in-out text-sm relative overflow-hidden flex flex-col"
            onClick={(e) => handleNoteClick(note, e)}
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 via-blue-500 to-indigo-400 rounded-t-[30px]" />

            <div className="flex-1">
              <div className="flex justify-between items-start mb-1">
                <h3 className="font-semibold text-[20px] leading-tight w-[70%] truncate">
                  Title: {note.title}
                </h3>
                <span className="text-[10px] text-gray-500 text-right w-[30%]">
                  {note.updatedAt && note.updatedAt !== note.createdAt
                    ? `Updated: ${new Date(note.updatedAt).toLocaleDateString()}`
                    : `Created: ${new Date(note.createdAt).toLocaleDateString()}`}
                </span>
              </div>

              <div
                className="text-gray-800 text-[12px] leading-snug overflow-hidden mt-1 prose prose-sm list-disc list-inside"
                style={{
                  display: "-webkit-box",
                  WebkitLineClamp: 5,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
                dangerouslySetInnerHTML={{ __html: note.content }}
              />

              <div className="flex flex-wrap gap-1 text-[10px] leading-tight mt-2 absolute bottom-8">
                {note.tags.map((tag, i) => (
                  <span key={i} className="bg-blue-200 text-blue-900 px-2 py-[1px] rounded-full shadow-sm">
                    #{tag.replace(/^#/, "")}
                  </span>
                ))}
              </div>
            </div>

            <div className="absolute bottom-1 right-5 flex justify-end gap-2 text-blue-600">
              <button
                className="p-2 rounded-full hover:bg-white hover:shadow transition"
                onClick={() => setEditingNote(note)}
              >
                <MdEdit size={18} />
              </button>
              <button
                className="p-2 rounded-full hover:bg-white hover:shadow transition"
                onClick={() => onDelete(note)}
              >
                <MdDelete size={18} />
              </button>
              <button
                className="p-2 rounded-full hover:bg-white hover:shadow transition"
                onClick={() => setSharingNote(note)}
              >
                <IoMdShare size={18} />
              </button>
            </div>
          </div>

        ))}
      </div> 

      {editingNote && (
        <NoteEdit
          note={editingNote}
          onClose={() => setEditingNote(null)}
          onUpdate={handleUpdate} 
        />
      )}

      {sharingNote && (
        <NoteShare
          note={sharingNote}
          onClose={() => setSharingNote(null)}
        />
      )}
    </>
  );
};


export default NoteList;
