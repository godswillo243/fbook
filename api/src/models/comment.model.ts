import mongoose from "mongoose";

interface Comment extends mongoose.Document {
  post: mongoose.Schema.Types.ObjectId;
  author: mongoose.Schema.Types.ObjectId;
  content: string;
  likes: mongoose.Schema.Types.ObjectId[];
}

const commentSchema = new mongoose.Schema<Comment>(
  {
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    likes: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export const CommentModel = mongoose.model<Comment>("Comment", commentSchema);
