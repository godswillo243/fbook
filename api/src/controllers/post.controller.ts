import { Request, Response } from "express";
import { PostModel } from "../models/post.model";
import { deleteImage, uploadImage } from "../lib/cloudinary";
import mongoose from "mongoose";
import { CommentModel } from "../models/comment.model";

export async function createPost(req: Request, res: Response) {
  try {
    const { content, image } = req.body;

    if (!content)
      return res.status(400).json({ message: "Post content is required" });

    const post = new PostModel({ content, author: req.userId });

    if (image) {
      post.imageUrl = await uploadImage(image);
    }
    await post.save();

    res.status(201).json({ message: "Post created", post });
  } catch (error) {
    res.status(500).json({ message: "Opps! Something went wrong" });
  }
}
export async function getPostFeed(req: Request, res: Response) {
  try {
    const cursor = req.query.cursor;
    const pageNumber = Number(cursor);
    const LIMIT = 10;
    const posts = await PostModel.find()
      .skip(LIMIT * pageNumber)
      .limit(LIMIT)
      .populate("author", "name email avatarUrl");
    const hasMore = posts.length === LIMIT;
    res
      .status(200)
      .json({ posts, nextCursor: hasMore ? pageNumber + 1 : null });
  } catch (error) {
    res.status(500).json({ message: "Opps! Something went wrong" });
  }
}
export async function deletePost(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const post = await PostModel.findById(id);

    if (!post) {
      return res.status(404).json({ message: "post not found" });
    }

    if (post.author.toString() !== req.userId) {
      return res
        .status(401)
        .json({ message: "You can delete only your posts" });
    }

    if (post.imageUrl) {
      await deleteImage(post.imageUrl);
    }

    await post.deleteOne();
    res.status(200).json({ message: "Post deleted!" });
  } catch (error) {
    res.status(500).json({ message: "Opps! Something went wrong" });
  }
}
export async function getUserPosts(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const posts = await PostModel.find({
      author: id,
    });
  } catch (error) {
    res.status(500).json({ message: "Opps! Something went wrong" });
  }
}
export async function likeUnlikePost(req: Request, res: Response) {
  try {
    const post = await PostModel.findById(req.params.id);
    if (!req.userId)
      return res.status(401).json({ message: "Unauthenticated" });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const isLiked = !!post?.likes.find((id) => id.toString() === req.userId);

    if (isLiked) {
      const likes = post.likes
        .map((id) => id.toString())
        .filter((id) => id !== req.userId);

      post.likes = likes.map(
        (id) =>
          new mongoose.Types.ObjectId(
            id
          ) as unknown as mongoose.Schema.Types.ObjectId
      );
    } else {
      const uid = new mongoose.Types.ObjectId(
        req.userId
      ) as unknown as mongoose.Schema.Types.ObjectId;
      post.likes.push(uid);
    }

    await post.save();
    res.status(200).json({ message: isLiked ? "Post unliked" : "Post liked" });
  } catch (error) {
    res.status(500).json({ message: "Opps! Something went wrong" });
  }
}
export async function getComments(req: Request, res: Response) {
  try {
  } catch (error) {
    res.status(500).json({ message: "Opps! Something went wrong" });
  }
}
export async function getComment(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const comment = await CommentModel.findById(id);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }
    res.status(200).json({ message: "Comment fetched", comment });
  } catch (error) {
    res.status(500).json({ message: "Opps! Something went wrong" });
  }
}
export async function addComment(req: Request, res: Response) {
  try {
    const { content } = req.body;
    const { id } = req.params;
    if (!content)
      return res.status(400).json({ message: "Comment text is required" });

    const post = await PostModel.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    const comment = new CommentModel({ content, post: id });

    res.status(201).json({ message: "Commented!", comment });
  } catch (error) {
    res.status(500).json({ message: "Opps! Something went wrong" });
  }
}
export async function deleteComment(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const comment = await CommentModel.findById(id);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    await comment.deleteOne();

    res.status(201).json({ message: "Comment deleted!" });
  } catch (error) {
    res.status(500).json({ message: "Opps! Something went wrong" });
  }
}
