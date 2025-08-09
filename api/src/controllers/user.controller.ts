import { Request, Response } from "express";
import { UserModel } from "../models/user.model";
import { hashPassword, verifyPassword } from "../lib/utils";
import { deleteImage, uploadImage } from "../lib/cloudinary";
import { FriendRequest } from "../models/friendRequest.model";
import { NotificationModel } from "../models/notification.model";
import { MessageModel } from "../models/message.model";

export async function getMe(req: Request, res: Response) {
  try {
    const user = await UserModel.findById(req.userId).select("-password");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
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
      const prevAvatarUrl = user.avatarUrl || "";
      const avatarUrl = await uploadImage(profileImage);

      user.avatarUrl = avatarUrl;
      await deleteImage(prevAvatarUrl);
    }
    user.bio = bio || user.bio;

    await user.save();

    res.status(200).json({ message: "User updated" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
}
export async function getUser(req: Request, res: Response) {
  try {
    const user = await UserModel.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}
export async function getUserStuff(req: Request, res: Response) {
  try {
    const user = await UserModel.findById(req.userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const friends = await UserModel.find({ _id: { $in: user.friends } }).select(
      "name avatarUrl email"
    );
    const notifications = await NotificationModel.find({
      receiver: req.userId,
    });
    const friendRequests = await FriendRequest.find({
      $or: [{ receiver: req.userId }, { sender: req.userId }],
    })
      .populate("sender", "name email avatarUrl")
      .populate("receiver", "name email avatarUrl");
    const messages = await MessageModel.find({
      $or: [{ recipient: req.userId }, { sender: req.userId }],
    });
    const stuff = { friends, notifications, friendRequests, messages };

    res.status(200).json(stuff);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}
export async function searchForUsers(req: Request, res: Response) {
  try {
    const { q } = req.query;
    if (q!.length === 0) return res.status(200).json([]);
    const users = await UserModel.find({
      $or: [{ name: { $regex: q, $options: "i" } }],
    })
      .sort({ name: 1 })
      .select("name avatarUrl email");

    res.status(200).json(users);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
}
export async function getSuggestedUsers(req: Request, res: Response) {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 5;

    const users = await UserModel.aggregate([
      { $sample: { size: limit } },
      {
        $match: {
          $and: [
            { _id: { $ne: req.userId } },
            { friends: { $nin: [req.userId] } },
          ],
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          avatarUrl: 1,
        },
      },
      {
        $limit: 5,
      },
    ]);

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
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
    res.status(200).json(user.friends);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
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

    res.status(200).json({
      message: targetUser.name + " has been removed from your friend list",
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getFriendRequests(req: Request, res: Response) {
  try {
    const friendRequests = await FriendRequest.find({
      receiver: req.userId,
    }).populate("sender", "name avatarUrl email");

    res.status(200).json(friendRequests);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
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

    const pendingRequested = await FriendRequest.findOne({
      $or: [
        { sender: userId, receiver: id },
        { sender: id, receiver: userId },
      ],
    });

    if (pendingRequested) {
      if (pendingRequested.sender.toString() === req.userId) {
        await pendingRequested.deleteOne();
      }
      return res.status(200).json({ message: "Request cancelled" });
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
    res.status(500).json({ message: "Internal server error" });
  }
}
export async function acceptFriendRequest(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const request = await FriendRequest.findById(id);

    if (!request) {
      return res.status(404).json({ error: "Friend request not found" });
    }

    const user = await UserModel.findById(userId);
    const targetUser = await UserModel.findById(request.sender);

    if (!user || !targetUser) {
      return res.status(404).json({ message: "User not found" });
    }

    user.friends.push(targetUser._id);
    targetUser.friends.push(user._id);

    await user.save();
    await targetUser.save();

    await NotificationModel.create({
      user: targetUser._id,
      type: "FRIEND_REQUEST",
      referenceId: id,
      message: `${user.name} accepted your friend request`,
    });
    await FriendRequest.deleteOne({ _id: request._id });

    res.status(200).json({ message: "Friend request accepted" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
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
    res.status(500).json({ message: "Internal server error" });
  }
}
export async function getNotifications(req: Request, res: Response) {
  try {
    const notifications = await NotificationModel.find({
      user: req.userId,
    }).sort({ createdAt: -1 });

    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}
