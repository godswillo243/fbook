import { Request, Response } from "express";
import { UserModel } from "../models/user.model";
import { hashPassword, verifyPassword } from "../lib/utils";
import { uploadImage } from "../lib/cloudinary";
import { FriendRequest } from "../models/friendRequest.model";
import { NotificationModel } from "../models/notification.model";

export async function getMe(req: Request, res: Response) {
  try {
    const user = await UserModel.findById(req.userId).select("-password");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
}
export async function updateMe(req: Request, res: Response) {
  try {
    const { profileImage, bio, newPassword, currentPassword } = req.body;

    if (!profileImage && !bio && !newPassword) {
      return res.status(400).json({ message: "No fields to update" });
    }

    const user = await UserModel.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({
          message: "Current password is required for password change",
        });
      }
      if (newPassword.length < 6) {
        return res.status(400).json({
          message: "New password must be at least 6 characters long",
        });
      }
      const isMatch = await verifyPassword(
        currentPassword,
        user.password.hash,
        user.password.salt
      );
      if (!isMatch) {
        return res
          .status(400)
          .json({ message: "Previous password is incorrect" });
      }
      const { hash, salt } = await hashPassword(newPassword);
      user.password = { hash, salt };
    }

    if (profileImage) {
      const avatarUrl = await uploadImage(profileImage);
      user.avatarUrl = avatarUrl;
    }
    user.bio = bio || user.bio;

    await user.save();

    res.status(200).json({ message: "User updated" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
}
export async function getUser(req: Request, res: Response) {
  try {
    const user = await UserModel.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ message: "User fetched", user });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
}
export async function getFriends(req: Request, res: Response) {
  try {
    const user = await UserModel.findById(req.params.id)
      .select("friends")
      .populate("friends", "-password -email");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({ message: "Friends fetched", friends: user.friends });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
}
export async function unfriendUser(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const user = await UserModel.findById(userId);
    const targetUser = await UserModel.findById(id);

    if (!user || !targetUser) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.friends.find((fId) => fId.toString() !== id)) {
      return res.status(400).json({ message: "User is not your friend" });
    }

    user.friends.filter((fId) => fId.toString() !== id);
    targetUser.friends.filter((fId) => fId.toString() !== userId);

    await user.save();
    await targetUser.save();

    res
      .status(200)
      .json({
        message: targetUser.name + " has been removed from your friend list",
      });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function sendFriendRequest(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const userId = req.userId;

    if (id === userId) {
      return res
        .status(400)
        .json({ error: "Cannot send friend request to self" });
    }

    const user = await UserModel.findById(userId);
    const targetUser = await UserModel.findById(id);

    if (!user || !targetUser) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.friends.find((friendId) => friendId.toString() === id)) {
      return res.status(400).json({ error: "Already friends" });
    }

    const alreadyRequested = await FriendRequest.findOne({
      $or: [
        { sender: userId, receiver: id },
        { sender: id, receiver: userId },
      ],
    });

    if (alreadyRequested) {
      return res.status(400).json({ error: "Friend request already sent" });
    }

    await FriendRequest.create({
      sender: userId,
      receiver: id,
      status: "pending",
    });
    await NotificationModel.create({
      user: id,
      type: "FRIEND_REQUEST",
      referenceId: id,
      message: `${user.name} sent you a friend request`,
    });

    res.status(200).json({ message: "Friend request sent" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
}
export async function acceptFriendRequest(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const request = await FriendRequest.findOne({
      sender: id,
      receiver: userId,
      status: "pending",
    });

    if (!request) {
      return res.status(404).json({ error: "Friend request not found" });
    }

    const user = await UserModel.findById(userId);
    const targetUser = await UserModel.findById(id);

    if (!user || !targetUser) {
      return res.status(404).json({ error: "User not found" });
    }

    user.friends.push(targetUser._id);
    targetUser.friends.push(user._id);

    await user.save();
    await targetUser.save();

    await NotificationModel.create({
      user: id,
      type: "FRIEND_REQUEST",
      referenceId: id,
      message: `${user.name} accepted your friend request`,
    });
    await FriendRequest.deleteOne({ _id: request._id });

    res.status(200).json({ message: "Friend request accepted" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
}
export async function rejectFriendRequest(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const request = await FriendRequest.findOne({
      sender: id,
      receiver: userId,
      status: "pending",
    });

    if (!request) {
      return res.status(404).json({ error: "Friend request not found" });
    }

    await FriendRequest.deleteOne({ _id: request._id });

    res.status(200).json({ message: "Friend request rejected" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
}
