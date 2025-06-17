import dotenv from 'dotenv';
dotenv.config();

import { Server } from 'socket.io';
import { createServer } from "http";
import mongoose from 'mongoose';
import { app } from './app.js';

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "https://code-io-wjsp-96xoczw0b-sandeeprepala3-gmailcoms-projects.vercel.app",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
});


const rooms = {};

io.on("connection", (socket) => {
  console.log("🔌 New client connected:", socket.id);

  socket.on("join-room", (roomId) => {
    socket.join(roomId);
    console.log(`📥 Socket ${socket.id} joined room ${roomId}`);

    socket.to(roomId).emit("user-joined", { socketId: socket.id });

    if (!rooms[roomId]) rooms[roomId] = [];
    rooms[roomId].push(socket.id);

    socket.on("user-disconnected", ({ roomId, username }) => {
  console.log(`🚪 ${username} left room ${roomId}`);
  socket.to(roomId).emit("user-left", { username });

  // Remove from room tracking
  rooms[roomId] = rooms[roomId]?.filter((id) => id !== socket.id);
  if (rooms[roomId]?.length === 0) {
    delete rooms[roomId];
  }

  socket.leave(roomId); // Optional, leave the room explicitly
});

  });

  // Code sync
  socket.on("code-change", ({ roomId, code }) => {
    socket.to(roomId).emit("code-change", code);
  });

  // Chat messages
  socket.on("send-message", ({ roomId, message, sender }) => {
    socket.to(roomId).emit("receive-message", { message, sender });
  });
});

// ✅ Move this OUTSIDE io.on
mongoose.connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("✅ Connected to MongoDB");

    server.listen(process.env.PORT || 8000, () => {
      console.log(`🚀 Server running on port ${process.env.PORT || 8000}`);
    });
  })
  .catch((error) => {
    console.error("❌ MongoDB connection error:", error);
  });

// Optional test route
app.get('/', (req, res) => {
  res.send('Welcome to Code.io');
});
