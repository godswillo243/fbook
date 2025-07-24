import mongoose from "mongoose";
interface User {
  _id: mongoose.Schema.Types.ObjectId;
  name: string;
  email: string;
  password: { hash: string; salt: string };
  avatarUrl?: string;
  bio?: string;
  friends: mongoose.Schema.Types.ObjectId[]; // array of User._id
  emailVerified: boolean;
  emailVerificationCode: string;
  createdAt: Date;
  resetPasswordCode?: string;
}

const userSchema = new mongoose.Schema<User>(
  {
    name: {
      type: String,
      required: true,
      min: [3, "Name must be at least 3 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    password: {
      type: {
        hash: { type: String, required: true },
        salt: { type: String, required: true },
      },
      required: [true, "Password is required"],
      min: [6, "Password must be at least 6 characters"],
    },
    avatarUrl: { type: String, default: "" },
    bio: { type: String, default: "" },
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    emailVerified: { type: Boolean, default: false },
    emailVerificationCode: { type: String, default: "" },
    resetPasswordCode: { type: String, default: "" },
  },
  { timestamps: true }
);

export const UserModel = mongoose.model<User>("User", userSchema);
