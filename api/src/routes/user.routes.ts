import { Router } from "express";
import {
  acceptFriendRequest,
  getFriends,
  getMe,
  getNotifications,
  getSuggestedUsers,
  getUser,
  getUserStuff,
  rejectFriendRequest,
  searchForUsers,
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
userRouter.get("/stuff", getUserStuff);
userRouter.get("/search", searchForUsers);
userRouter.get("/suggestions/friends", getSuggestedUsers);
userRouter.get("/:id/profile", getUser);
userRouter.get("/notifications", getNotifications);

userRouter.get("/:id/friends", getFriends);
userRouter.delete("/:id/friends", unfriendUser);
userRouter.get("/friends/request", sendFriendRequest);
userRouter.post("/:id/friends/request", sendFriendRequest);
userRouter.put("/:id/friends/request", acceptFriendRequest);
userRouter.delete("/:id/friends/request", rejectFriendRequest);

export { userRouter as userRoutes };
