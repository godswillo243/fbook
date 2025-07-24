import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: "your-cloud-name",
  api_key: "your-api-key",
  api_secret: "your-api-secret",
});

export const uploadImage = async (filePath: string) => {
  const result = await cloudinary.uploader.upload(filePath, {
    folder: "facebook_clone",
    resource_type: "image",
  });
  return result.secure_url;
};
export const deleteImage = async (filePath: string) => {
  const publicId = filePath;
  const result = await cloudinary.uploader.destroy(publicId, {
    resource_type: "image",
  });
  return result;
};

export default cloudinary;
