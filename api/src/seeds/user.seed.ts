import mongoose from "mongoose";
import { connectMonogDB } from "../config/mongodb";
import { MONGODB_URI } from "../config/env";
import { UserModel } from "../models/user.model";
import { hashPassword } from "../lib/utils";
import fs from "fs";
async function seedUsers() {
  try {
    await connectMonogDB();
    const users = [
      {
        name: "John Doe2",
        email: "johndoe2@example.com",
        password: "password",
        emailVerified: true,
      },
      {
        name: "Sam Smith2",
        email: "samsmith2@example.com",
        password: "password",
        emailVerified: true,
      },
      {
        name: "Philip Phillips2",
        email: "phillips2@example.com",
        password: "password",
        emailVerified: true,
      },
      {
        name: "Sara Smith2",
        email: "sarasmith2@example.com",
        password: "password",
        emailVerified: true,
      },
      {
        name: "Jane Doe2",
        email: "janedoe2@example.com",
        password: "password",
        emailVerified: true,
      },
      {
        name: "Peter Rogers2",
        email: "peterrogers2@example.com",
        password: "password",
        emailVerified: true,
      },
    ];

    const hashedPassword = await hashPassword("password");

    for (let i = 0; i < users.length; i++) {
      const user = new UserModel({
        name: users[i].name,
        email: users[i].email,
        password: hashedPassword,
        emailVerified: users[i].emailVerified,
      });
      await user.save();
    }
  } catch (error) {
    console.log(error);
  }
}

seedUsers()
  .then(() => process.exit(0))
  .then(() => console.log("Users seeded"));
