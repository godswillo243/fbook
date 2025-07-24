import { NextFunction, Request, Response } from "express";
import { AccessTokenModel } from "../models/accessToken.model";
import { UserModel } from "../models/user.model";

declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

export async function checkAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const tokenId = req.headers.authorization?.split(" ")[1];
    if (!tokenId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const token = await AccessTokenModel.findOne({ id: tokenId });
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    req.userId = token.userId;
    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
}
export async function checkEmailVerified(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const user = await UserModel.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (!user.emailVerified) {
      return res.status(401).json({ message: "Email not verified" });
    }
    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
}
