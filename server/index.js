const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require("http");
const { Server } = require("socket.io");
const Note = require("./models/Note");

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json()); 

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));
  
const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);
const notesRouter = require("./routes/notes");
app.use("/api/notes", notesRouter);

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000', 
    methods: ['GET', 'POST'],
  },
});

// Socket.io setup
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join-note", async ({ noteId, userId }) => {
    const note = await Note.findById(noteId);
    const isCreator = note.userId.toString() === userId;
    const isAcceptedSharedUser = note.sharedWith.some(
      (entry) => entry.userId.toString() === userId && entry.accepted
    );
  
    if (isCreator || isAcceptedSharedUser) {
      socket.join(noteId);
    } else {
      socket.emit("error", "Access denied to join note");
    }
  });
  

  socket.on("send-changes", ({ noteId, content }) => {
    socket.to(noteId).emit("receive-changes", content);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

server.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});