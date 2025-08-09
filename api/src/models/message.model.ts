import mongoose from "mongoose";

interface Message extends mongoose.Document {
  sender: mongoose.Schema.Types.ObjectId;
  recipient: mongoose.Schema.Types.ObjectId;
  content: string;
  read: boolean;
}

const messageSchema = new mongoose.Schema<Message>(
  {
    content: {
      type: String,
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const MessageModel = mongoose.model<Message>("Message", messageSchema);
