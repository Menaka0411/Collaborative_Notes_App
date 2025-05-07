import React, { useState } from "react";
import { IoAddSharp, IoClose } from "react-icons/io5";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TiptapMenuBar from "../utils/tiptap";
import BulletList from '@tiptap/extension-bullet-list'
import OrderedList from '@tiptap/extension-ordered-list'
import ListItem from '@tiptap/extension-list-item'
import "../styles.css"

const NoteEditor = ({ onClose, onSave }) => {
  const [note, setNote] = useState({
    title: "",
    content: "",
    tags: [],
    createdAt: "",
  });

  const [tagInput, setTagInput] = useState("");
  
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: false,
        orderedList: false,
        listItem: false,
      }),
      BulletList,
      OrderedList,
      ListItem,
    ],
    content: "",
    editorProps: {
      attributes: {
        class: "prose max-w-none border border-gray-300 rounded-md p-3 focus:outline-none",
      },
    },
    onUpdate({ editor }) {
      setNote((prev) => ({
        ...prev,
        content: editor.getHTML(),
      }));
    },
  });  

  const handleChange = (e) => {
    setNote({ ...note, [e.target.name]: e.target.value });
  };

  const handleAddTag = () => {
    const tag = tagInput.trim();
    if (tag !== "" && !note.tags.includes(`#${tag}`)) {
      setNote((prev) => ({
        ...prev,
        tags: [...prev.tags, `#${tag}`],
      }));
      setTagInput("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleRemoveTag = (index) => {
    const updatedTags = [...note.tags];
    updatedTags.splice(index, 1);
    setNote((prev) => ({ ...prev, tags: updatedTags }));
  };

  const handleAdd = async () => {
    const userId = localStorage.getItem("userId");
    const newNote = { ...note, createdAt: new Date().toISOString(), userId };
    try {
      const res = await fetch("http://localhost:5000/api/notes/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newNote),
      });
      const data = await res.json();
      onSave(data); 
      onClose();
    } catch (error) {
      console.error("Failed to save note:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-6xl max-h-[98.5vh]">
      <div className="overflow-y-auto max-h-[95vh]">
        <h2 className="text-lg font-semibold mb-4">Add New Note</h2>

        <input
          type="text"
          name="title"
          placeholder="Title"
          value={note.title}
          onChange={handleChange}
          className="w-full mb-3 px-3 py-2 border rounded-md"
        />

      <TiptapMenuBar editor={editor} />
      <div className="border rounded-md overflow-y-auto min-h-[200px] max-h-[300px]">
        <EditorContent editor={editor} />
      </div>

        <div className="mb-4">
          <div className="flex flex-wrap gap-2 mt-3 mb-2">
            {note.tags.map((tag, index) => (
              <div
                key={index}
                className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm flex items-center"
              >
                {tag}
                <button
                  className="ml-1 text-blue-600 hover:text-red-500"
                  onClick={() => handleRemoveTag(index)}
                >
                  <IoClose />
                </button>
              </div>
            ))}
          </div>

          {/* Input and Add icon in one row */}
          <div className="flex gap-2 items-center">
            <input
              type="text"
              placeholder="Enter a tag"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 border p-2 rounded"
            />
            <button
              onClick={handleAddTag}
              className="bg-blue-600 text-white p-3 rounded hover:bg-blue-700"
              title="Add tag"
            >
              <IoAddSharp className="text-lg" />
            </button>
          </div>
        </div>

        <div className="flex justify-end gap-8">
          <button
            className="bg-gray-300 hover:bg-gray-400 px-5 py-2 rounded-md"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md"
            onClick={handleAdd}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  </div>
  );
};

export default NoteEditor;
