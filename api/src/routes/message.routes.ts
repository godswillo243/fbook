import { Router } from "express";
import {
  deleteMessages,
  editMessage,
  getMessages,
  sendMessage,
} from "../controllers/messages.controller";
import { checkAuth, checkEmailVerified } from "../middlewares/auth.middleware";

const messageRouter = Router();

messageRouter.use(checkAuth);
messageRouter.use(checkEmailVerified);

messageRouter.get("/:id", getMessages);
messageRouter.post("/:id", sendMessage);
messageRouter.delete("/:id", deleteMessages);
messageRouter.put("/:id", editMessage);

export { messageRouter as messageRoutes };
