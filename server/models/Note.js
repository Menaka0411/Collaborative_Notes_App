const mongoose = require("mongoose");

const NoteSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  tags: { type: [String], default: [] },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  sharedWith: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    email: String,
    permission: { type: String, enum: ["view", "edit"], default: "view" },
    accepted: { type: Boolean, default: false }
  }]
});


const Note = mongoose.model("Note", NoteSchema);

module.exports = Note;
