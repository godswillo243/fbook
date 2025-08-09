import dotenv from "dotenv";

dotenv.config({
  quiet: true,
});

type EnvironmentVariables = {
  CLOUDINARY_CLOUD_NAME: string;
  CLOUDINARY_API_KEY: string;
  CLOUDINARY_API_SECRET: string;
  JWT_EXPIRATION: string;
  JWT_REFRESH_EXPIRATION: string;
  JWT_REFRESH_SECRET: string;
  JWT_SECRET: string;
  MONGODB_URI: string;
  NODE_ENV: "development" | "production" | "test";
  PORT: string;
  SMTP_EMAIL: string;
  SMTP_PASSWORD: string;
  SMTP_SERVICE: string;
  CLIENT_URL: string;
  PANTRY_URL: string;
};

// Define the environment variables with types
export const {
  CLIENT_URL,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
  CLOUDINARY_CLOUD_NAME,
  JWT_EXPIRATION,
  JWT_REFRESH_EXPIRATION,
  JWT_REFRESH_SECRET,
  JWT_SECRET,
  MONGODB_URI,
  NODE_ENV,
  PANTRY_URL,
  PORT,
  SMTP_EMAIL,
  SMTP_PASSWORD,
  SMTP_SERVICE,
} = process.env as EnvironmentVariables;
