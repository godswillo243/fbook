import { Request, Response } from "express";
import {
  createUserValidationSchema,
  loginValidationSchema,
} from "../lib/validationSchemas";
import { UserModel } from "../models/user.model";
import { generateToken, hashPassword, verifyPassword } from "../lib/utils";
import { AccessTokenModel } from "../models/accessToken.model";
import crypto from "crypto";
import { sendMail } from "../lib/nodemailer";

export async function createUser(req: Request, res: Response) {
  try {
    const result = createUserValidationSchema.safeParse(req.body);
    if (!result.success) {
      console.log(result.error);
      res.status(400).json({ message: result.error.issues[0].message });
      return;
    }

    const { email, name, password } = result.data;

    const existingUser = await UserModel.findOne({ email });

    if (existingUser) {
      res.status(400).json({ message: "Email already used" });
      return;
    }

    const hashedPassword = await hashPassword(password);

    const emailVerificationCode = crypto
      .randomInt(0, 999999)
      .toString()
      .padStart(6, crypto.randomInt(0, 9).toString());

    const newUser = new UserModel({
      name,
      email,
      password: hashedPassword,
      emailVerificationCode,
    });

    await sendMail({
      to: email,
      subject: "Verify your email",
      html: `<h1>Verify your email on Fbook</h1><p>Use this code to verify your email: ${emailVerificationCode}</p>`,
      text: `Use this code to verify your email: ${emailVerificationCode}`,
    });

    const tokenId = await generateToken(newUser._id.toString());
    await newUser.save();

    res.status(201).json({
      message: "User created successfully",
      tokenId,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
}
export async function loginUser(req: Request, res: Response) {
  try {
    const result = loginValidationSchema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({ message: result.error.issues[0].message });
      return;
    }

    const { email, password } = result.data;

    const existingUser = await UserModel.findOne({ email });

    if (!existingUser) {
      res.status(400).json({ message: "Invalid email or password" });
      return;
    }

    if (
      !(await verifyPassword(
        password,
        existingUser.password.hash,
        existingUser.password.salt
      ))
    ) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const tokenId = await generateToken(existingUser._id.toString());
    res.status(201).json({
      message: "User logged in successfully",
      tokenId,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
}
export async function getAuthUser(req: Request, res: Response) {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await UserModel.findById(userId).select(
      "-password -emailVerificationCode"
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
}
export async function logoutUser(req: Request, res: Response) {
  try {
    const userId = req.userId; // Assuming req.user is set by checkAuth middleware

    await AccessTokenModel.deleteMany({ userId });

    res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
}
export async function verifyEmail(req: Request, res: Response) {
  try {
    const userId = req.userId; // Assuming req.user is set by checkAuth middleware
    const { code } = req.body;

    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.emailVerified) {
      return res.status(400).json({ message: "Email already verified" });
    }

    if (user.emailVerificationCode !== code) {
      return res.status(400).json({ message: "Invalid verification code" });
    }

    user.emailVerified = true;
    user.emailVerificationCode = "";
    await user.save();

    res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
}
export async function sendResetPasswordEmail(req: Request, res: Response) {
  try {
    const { email } = req.params;

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const resetPasswordCode = crypto
      .randomInt(0, 999999)
      .toString()
      .padEnd(6, crypto.randomInt(0, 9).toString());

    user.resetPasswordCode = resetPasswordCode;
    
    await sendMail({
      to: email,
      subject: "Reset your password",
      html: `<h1>Reset your password on Fbook</h1><p>Your reset password code is: ${resetPasswordCode}</p>`,
      text: `Your reset password code is: ${resetPassword}`,
    });
    await user.save();

    res.status(200).json({
      message:
        "We have sent a code to your email to reset your password, please enter the code to reset your password",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
}
export async function resetPassword(req: Request, res: Response) {
  try {
    const { email } = req.params;
    const { code, newPassword } = req.body;

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (code !== user.resetPasswordCode) {
      return res.status(400).json({ message: "Invalid reset password code" });
    }

    if (newPassword.length < 6) {
      return res
        .status(400)
        .json({ message: "New password must be at least 6 characters long" });
    }

    const hashedPassword = await hashPassword(newPassword);

    user.password = hashedPassword;
    user.resetPasswordCode = "";
    await user.save();

    await sendMail({
      to: email,
      subject: "Your password has been reset",
      html: `<h1>Your Fbook password was reset</h1><p></p>`,
      text: ``,
    });

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
}
