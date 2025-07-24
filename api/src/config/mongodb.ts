import mongoose from "mongoose";
import { MONGODB_URI } from "./env";

export async function connectMonogDB() {
  try {
    const connection = await mongoose.connect(MONGODB_URI);

    return connection;
  } catch (error) {
    console.log("\x1b[31m \nError Connecting to mongodb:\n", error);
  }
}
