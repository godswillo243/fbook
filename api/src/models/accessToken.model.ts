import mongoose from "mongoose";

interface AccessToken extends mongoose.Document {
  id: string;
  userId: string;
  iat?: number; // issued at
  exp?: number; // expiration time
}

const accessTokenSchema = new mongoose.Schema<AccessToken>(
  {
    id: { type: String, required: true },
    userId: { type: String, required: true },
    iat: { type: Number, default: Date.now() },
    exp: { type: Number, default: Date.now() + 3600 }, // default expiration time of 1 hour
  },
  { timestamps: true }
);

export const AccessTokenModel = mongoose.model<AccessToken>(
  "Access_token",
  accessTokenSchema
);
