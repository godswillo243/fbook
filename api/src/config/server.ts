import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import { CLIENT_URL } from "./env";
import { UserModel } from "../models/user.model";

const app = express();
const server = http.createServer(app);
export const io = new Server(server, {
  cors: {
    origin: CLIENT_URL,
    methods: ["GET", "POST"],
  },
});

app.use(express.json({ limit: "10mb" }));
app.use(
  cors({
    origin: CLIENT_URL,
  })
);

let onlineUsers: { sid: string; userId: string }[] = [];

io.on("connect", (socket) => {
  socket.on("me", ({ id }) => {
    onlineUsers = onlineUsers.filter((user) => user.userId !== id);
    onlineUsers.push({ sid: socket.id, userId: id });
    console.log("onlineUsers: ", onlineUsers);
  });
  socket.emit("onlineUsers", onlineUsers);
  socket.on("message", ({ recipient, message }) => {
    const receiver = onlineUsers.find((user) => user.userId === recipient);
    if (!receiver) return;
    io.to(receiver.sid).emit("message", message);
    console.log(message, recipient)
  });

  socket.on("disconnect", (reason) => {
    // onlineUsers.push({ [socket.id]: id });
    onlineUsers = onlineUsers.filter((user) => user.sid !== socket.id);
    console.log("onlineUsers: ", onlineUsers);
  });
});

export { app, server };
