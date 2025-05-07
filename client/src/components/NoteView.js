import React from "react";
import { IoMdClose } from "react-icons/io";
import "../styles.css";

const NoteView = ({ note, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 px-2 sm:px-6">
      <div className="bg-white rounded-2xl shadow-xl w-full sm:w-[90%] md:w-[80%] max-w-6xl max-h-[90vh] relative overflow-hidden">
        
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-3xl text-gray-500 hover:text-red-600 z-10"
        >
          <IoMdClose />
        </button>

        <div className="p-4 sm:p-6 pt-14 overflow-auto max-h-[90vh]">
          <div className="w-full">
            <h2 className="text-lg sm:text-xl text-black break-words">
              <span className="font-bold">Title:</span> {note.title}
            </h2>
          </div>

          <h2 className="mt-2 text-black text-base sm:text-xl">
            <span className="font-bold">
              {note.updatedAt && note.updatedAt !== note.createdAt
                ? "Updated on:"
                : "Created on:"}
            </span>{" "}
            {note.updatedAt && note.updatedAt !== note.createdAt
              ? new Date(note.updatedAt).toLocaleDateString()
              : new Date(note.createdAt).toLocaleDateString()}
          </h2>

          <div
            className="text-black mt-2 mb-4 prose prose-sm sm:prose max-w-none"
            dangerouslySetInnerHTML={{ __html: note.content }}
          />

          <div className="flex flex-wrap gap-2">
            {note.tags.map((tag, i) => (
              <span
                key={i}
                className="bg-blue-100 px-2 py-1 mt-4 rounded-md text-sm"
              >
                #{tag.replace(/^#/, "")}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoteView;
