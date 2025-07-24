import { Router } from "express";
import {
  acceptFriendRequest,
  getFriends,
  getMe,
  getUser,
  rejectFriendRequest,
  sendFriendRequest,
  unfriendUser,
  updateMe,
} from "../controllers/user.controller";
import { checkAuth, checkEmailVerified } from "../middlewares/auth.middleware";

const userRouter = Router();

userRouter.use(checkAuth);
userRouter.use(checkEmailVerified);

userRouter.get("/me", getMe);
userRouter.put("/me", updateMe);
userRouter.get("/:id", getUser);

userRouter.get("/:id/friends", getFriends);
userRouter.delete("/:id/friends", unfriendUser);
userRouter.post("/:id/friends/request", sendFriendRequest);
userRouter.post("/:id/friends/accept", acceptFriendRequest);
userRouter.delete("/:id/friends/request", rejectFriendRequest);

export { userRouter as userRoutes };
