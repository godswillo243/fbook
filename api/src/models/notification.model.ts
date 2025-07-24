import mongoose from "mongoose";

interface Notification {
  _id: mongoose.Schema.Types.ObjectId;
  user: mongoose.Schema.Types.ObjectId;
  type: "LIKE" | "COMMENT" | "FRIEND_REQUEST";
  referenceId: mongoose.Schema.Types.ObjectId; // post, comment, etc.
  read: boolean;
  message: string;
  createdAt: Date;
}

const notificationSchema = new mongoose.Schema<Notification>({
  user: { type: mongoose.Schema.Types.ObjectId, required: true },
  type: {
    type: String,
    enum: ["LIKE", "COMMENT", "FRIEND_REQUEST"],
    required: true,
  },
  referenceId: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: "type",
    // This allows the referenceId to point to different collections based on the type
    required: true,
  },
  message: {
    type: String,
    default: "",
  },
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export const NotificationModel = mongoose.model<Notification>(
  "Notification",
  notificationSchema
);
