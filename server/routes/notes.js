const express = require("express");
const router = express.Router();
const Note  = require("../models/Note");
const User = require("../models/User");

router.get("/", async (req, res) => {
    const { userId } = req.query; 
    try {
      const notes = await Note.find({ userId });
      res.status(200).json(notes);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch notes." });
    }
  });
  
  
// Create a new note
router.post("/create", (req, res, next) => {
    next();
  }, async (req, res) => {
    try {
      const { title, content, tags, createdAt, userId } = req.body;
      const newNote = new Note({
        title,
        content,
        tags,
        createdAt,
        updatedAt: createdAt,
        userId,
      });
      const savedNote = await newNote.save();
      res.status(201).json(savedNote);
    } catch (err) {
      res.status(500).json({ error: "Failed to save note." });
    }
  });
  
// Update note
router.put("/:id", async (req, res) => {
  const { userId, ...updateFields } = req.body;

  const note = await Note.findById(req.params.id);
  if (!note) return res.status(404).json({ error: "Note not found." });

  const isOwner = note.userId.toString() === userId;
  const isEditor = note.sharedWith.some(
    (entry) =>
      entry.userId.toString() === userId &&
      entry.accepted &&
      entry.permission === "edit"
  );

  if (!isOwner && !isEditor) {
    return res.status(403).json({ error: "Permission denied" });
  }

  const updatedNote = await Note.findByIdAndUpdate(
    req.params.id,
    { ...updateFields, updatedAt: new Date() },
    { new: true }
  );

  res.json(updatedNote);
});


// Delete note
router.delete("/:id", async (req, res) => {
  try {
    await Note.findByIdAndDelete(req.params.id);
    res.json({ message: "Note deleted." });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete note." });
  }
});

router.post("/share", async (req, res) => {
  const { email, noteId, permissions } = req.body;
  try {
    const userToShare = await User.findOne({ email });
    if (!userToShare) return res.status(404).json({ error: "User not found." });

    const note = await Note.findById(noteId);
    if (!note) return res.status(404).json({ error: "Note not found." });

    note.sharedWith.push({
      userId: userToShare._id,
      email,
      permission: permissions,
      accepted: false
    });
    await note.save();

    res.json({ message: "Note shared successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to share note." });
  }
});

router.get("/shared", async (req, res) => {
  try {
    const sharedNotes = await Note.find({ "sharedWith.0": { $exists: true } });
    res.status(200).json(sharedNotes);
  } catch (error) {
    console.error("Error fetching shared notes:", error);
    res.status(500).json({ error: "Failed to fetch shared notes" });
  }
});

router.post("/accept", async (req, res) => {
  const { noteId, userId } = req.body;

  try {
    const note = await Note.findById(noteId);
    if (!note) {
      return res.status(404).json({ error: "Note not found" });
    }

    const sharedWithUser = note.sharedWith.find(
      (entry) => entry.userId.toString() === userId
    );
    
    if (sharedWithUser) {
      sharedWithUser.accepted = true;
      await note.save();
      res.status(200).json({ message: "Note accepted successfully" });
    } else {
      res.status(400).json({ error: "User not authorized to accept this note" });
    }
  } catch (err) {
    res.status(500).json({ error: "Error accepting note" });
  }
});

// In routes/notes.js or a similar file
router.put('/accept/:noteId', async (req, res) => {
  const { noteId } = req.params;
  const { userId } = req.body;

  try {
    const note = await Note.findById(noteId);
    if (!note) return res.status(404).json({ error: "Note not found" });

    const entry = note.sharedWith.find(u => u.userId.toString() === userId);
    if (entry) {
      entry.accepted = true;
      await note.save();
      return res.status(200).json({ message: "Note accepted" });
    }

    res.status(400).json({ error: "User not invited to this note" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});


module.exports = router;
