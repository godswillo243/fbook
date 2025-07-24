import crypto from "crypto";
import jwt from "jsonwebtoken";
import { JWT_EXPIRATION, JWT_SECRET, PANTRY_URL } from "../config/env";
import { AccessTokenModel } from "../models/accessToken.model";

export async function hashPassword(
  password: string
): Promise<{ hash: string; salt: string }> {
  const salt = crypto.randomBytes(16).toString("hex");
  const derivedKey = await new Promise<Buffer>((resolve, reject) => {
    crypto.scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) reject(err);
      else resolve(derivedKey);
    });
  });
  return { hash: derivedKey.toString("hex"), salt };
}
export async function verifyPassword(
  password: string,
  hash: string,
  salt: string
): Promise<boolean> {
  const derivedKey = await new Promise<Buffer>((resolve, reject) => {
    crypto.scrypt(password, salt, 64, (err, key) => {
      if (err) reject(err);
      else resolve(key);
    });
  });
  return crypto.timingSafeEqual(Buffer.from(hash, "hex"), derivedKey);
}

export async function generateToken(userId: string): Promise<string> {
  await AccessTokenModel.deleteMany({ userId }); // Clean up old tokens
  const token = await AccessTokenModel.create({
    id: crypto.randomBytes(64).toString("hex"),
    userId,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 10 * 60 * 60 * 24, // Convert minutes to seconds
  });
  return token.id;
}
export async function verifyToken(
  tokenId: string
): Promise<Record<string, string | number> | null> {
  try {
    const accessToken = await AccessTokenModel.findById(tokenId);

    if (!accessToken) {
      return null;
    }else if (accessToken?.exp! < Date.now()) {
      await AccessTokenModel.deleteOne({ id: accessToken.id });
      return null;
    }


    const result: Record<string, string | number> = {
      id: accessToken.id,
      userId: accessToken.userId,
      iat: accessToken.iat || Math.floor(Date.now() / 1000),
      exp:
        accessToken.exp ||
        Math.floor(Date.now() / 1000) + parseInt(JWT_EXPIRATION, 10) * 60 * 60,
    };

    return result;
  } catch (error) {
    return null;
  }
}
