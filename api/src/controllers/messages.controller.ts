import { NextFunction, Request, Response } from "express";
import { UserModel } from "../models/user.model";
import { MessageModel } from "../models/message.model";

export async function getMessages(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;
    const targetUser = await UserModel.findById(id);
    const user = await UserModel.findById(req.userId);

    if (!targetUser) {
      return res.status(404).json({ message: "Target user not found" });
    }

    if (!targetUser.friends.find((id) => id.toString() === req.userId)) {
      return res
        .status(404)
        .json({ message: "You are not friends with this user" });
    }

    const messages = await MessageModel.find({
      $or: [
        {
          recipient: targetUser._id,
          sender: user?._id,
        },
        {
          recipient: user?._id,
          sender: targetUser._id,
        },
      ],
    });


    res.status(200).json(messages);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
}
export async function sendMessage(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { content } = req.body;
    const { id } = req.params;
    const targetUser = await UserModel.findById(id);
    if (!content) {
      return res.status(400).json({ message: "message content required" });
    }
    if (!targetUser) {
      return res.status(404).json({ message: "Target user not found" });
    }

    if (!targetUser.friends.find((id) => id.toString() === req.userId)) {
      return res
        .status(404)
        .json({ message: "You are not friends with this user" });
    }

    const message = new MessageModel({
      content,
      recipient: targetUser._id,
      sender: req.userId,
    });
    await message.save();
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
}
export async function deleteMessages(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;

    const message = await MessageModel.findById(id);

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }
    if (message.sender.toString() !== req.userId) {
      return res
        .status(401)
        .json({ message: "You are not authorized to delete this message" });
    }
    await message.deleteOne();
    res.status(200).json({ message: "Message deleted" });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
}
export async function editMessage(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const message = await MessageModel.findById(id);

    if (!content) {
      return res.status(400).json({ message: "new message content required" });
    }
    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }
    if (message.sender.toString() !== req.userId) {
      return res
        .status(401)
        .json({ message: "You are not authorized to delete this message" });
    }
    message.content = content;

    await message.save();

    res.status(200).json({ message: "Message deleted" });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
}

// export async function deleteMessages(
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) {
//   try {
//     const { id } = req.params;

//   } catch (error) {
//     res.status(500).json({ message: "Something went wrong" });
//   }
// }
