import express from "express";
import http from "http";
import { Server } from "socket.io";

import cors from "cors";
import { CLIENT_URL } from "./env";

const app = express();
const server = http.createServer(app);
export const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

app.use(express.json({ limit: "10mb" }));
app.use(
  cors({
    origin: CLIENT_URL,
  })
);

export { app, server };
