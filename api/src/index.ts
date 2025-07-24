import { CLIENT_URL, PORT } from "./config/env";
import { connectMonogDB } from "./config/mongodb";
import { app, server } from "./config/server";
import { authRoutes } from "./routes/auth.routes";
import { messageRoutes } from "./routes/message.routes";
import { postRoutes } from "./routes/post.routes";
import { userRoutes } from "./routes/user.routes";

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", CLIENT_URL);
  next();
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/messages", messageRoutes)

app.on("error", (err) => {
  console.error("Server error:", err);
});

server.listen(PORT, () => {
  console.log(`\x1b[32m\nServer is running on port ${PORT} \x1b[37m`);
  connectMonogDB().then(() =>
    console.log(`\x1b[32mConnected to MONGODB \x1b[37m`)
  );
});
