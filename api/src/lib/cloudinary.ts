import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import {
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
  CLOUDINARY_CLOUD_NAME,
} from "../config/env";

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

export const uploadImage = async (filePath: string) => {
  const result = await cloudinary.uploader.upload(filePath, {
    resource_type: "image",
    folder: "fbook",
  });
  return result.secure_url;
};
export const deleteImage = async (filePath: string) => {
  const parts = filePath.split("/");
  const publicId = parts[parts.length - 1].split(".")[0];

  if (!publicId) return;

  const result = await cloudinary.uploader.destroy(publicId, {
    resource_type: "image",
  });
  return result;
};


export default cloudinary;
