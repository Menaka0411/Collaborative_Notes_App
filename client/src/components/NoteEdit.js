import React, { useState } from "react";
import { IoMdClose } from "react-icons/io";
import { FaPlus } from "react-icons/fa";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TiptapMenuBar from "../utils/tiptap";

const NoteEdit = ({ note, onClose, onUpdate }) => {
  const [edited, setEdited] = useState({ ...note });
  const [newTag, setNewTag] = useState("");

  const editor = useEditor({
    extensions: [StarterKit],
    content: note.content,
    onUpdate({ editor }) {
      setEdited({ ...edited, content: editor.getHTML() });
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEdited({ ...edited, [name]: value });
  };

  const addTag = () => {
    const trimmed = newTag.trim();
    if (trimmed && !edited.tags.includes(trimmed)) {
      setEdited({ ...edited, tags: [...edited.tags, trimmed] });
    }
    setNewTag("");
  };

  const removeTag = (tagToRemove) => {
    setEdited({
      ...edited,
      tags: edited.tags.filter((tag) => tag !== tagToRemove),
    });
  };

  const handleUpdate = () => {
    const isChanged =
      edited.title !== note.title ||
      edited.content !== note.content ||
      JSON.stringify(edited.tags) !== JSON.stringify(note.tags);
  
      if (isChanged) {
        const updatedNote = {
          ...note, 
          ...edited,
          updatedAt: new Date().toISOString(),
        };
        onUpdate(updatedNote);
      }
    
      onClose();
    };
  

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-4xl min-h-[300px] relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-2xl text-gray-500 hover:text-red-600"
        >
          <IoMdClose />
        </button>
        <h2 className="text-xl font-bold mb-4">Edit Note</h2>

        <input
          name="title"
          value={edited.title}
          onChange={handleChange}
          className="w-full border p-2 rounded mb-4"
          placeholder="Title"
        />

        {editor && <TiptapMenuBar editor={editor} />}
        <div className="border rounded-md overflow-y-auto min-h-[200px] max-h-[300px]">
          <EditorContent
            editor={editor}
            className="outline-none focus:outline-none focus:ring-0 focus:border-transparent"
          />
        </div>

        <div className="mb-4">
          <div className="flex flex-wrap gap-2 mb-2">
            {edited.tags.map((tag, idx) => (
              <span
                key={idx}
                className="flex items-center gap-1 bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-sm"
              >
                {tag}
                <IoMdClose
                  onClick={() => removeTag(tag)}
                  className="cursor-pointer text-red-500"
                />
              </span>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addTag();
                }
              }}
              placeholder="Add a tag"
              className="flex-1 border p-2 rounded"
            />
            <button
              onClick={addTag}
              className="bg-blue-600 text-white p-3 rounded hover:bg-blue-700"
            >
              <FaPlus />
            </button>
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-4">
          <button
            onClick={handleUpdate}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Update
          </button>
          <button
            onClick={onClose}
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoteEdit;
