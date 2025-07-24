import { Router } from "express";
import {
  addComment,
  createPost,
  deleteComment,
  deletePost,
  getComment,
  getComments,
  getPostFeed,
  getUserPosts,
  likeUnlikePost,
} from "../controllers/post.controller";
import { checkAuth, checkEmailVerified } from "../middlewares/auth.middleware";
const postRouter = Router();

postRouter.use(checkAuth);
postRouter.use(checkEmailVerified);

postRouter.post("/", createPost);
postRouter.get("/feed", getPostFeed);
postRouter.delete("/:id", deletePost);
postRouter.get("/:id", likeUnlikePost);
postRouter.get("/:id/user", getUserPosts);
postRouter.get("/:id/comments", getComments);
postRouter.post("/:id/comments", addComment);
postRouter.get("/comments/:id", getComment);
postRouter.delete("/comments/:id", deleteComment);
export { postRouter as postRoutes };
