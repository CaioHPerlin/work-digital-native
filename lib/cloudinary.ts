import { Cloudinary } from "@cloudinary/url-gen";

export const cld = new Cloudinary({
  cloud: {
    cloudName: process.env.EXPO_PUBLIC_CLOUD_NAME,
    apiKey: process.env.EXPO_PUBLIC_CLOUD_API_KEY,
    apiSecret: process.env.EXPO_PUBLIC_CLOUD_API_SECRET,
  },
});

import { Alert } from "react-native";

// Cloudinary configuration
const CLOUD_NAME = process.env.EXPO_PUBLIC_CLOUD_NAME;
const UPLOAD_PRESET = "default"; // Your unsigned upload preset

export const uploadImage = async (imageUri: string, id: string) => {
  if (!imageUri) {
    console.error("No image selected:", imageUri);
    return;
  }

  try {
    // Cloudinary unsigned upload URL
    const uploadUrl = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

    // Prepare form data
    const formData = new FormData();
    formData.append("file", {
      uri: imageUri,
      type: "image/jpeg", // Adjust if necessary
      name: "image.jpg", // Adjust if necessary
    } as any);
    formData.append("upload_preset", UPLOAD_PRESET);
    formData.append("folder", "profile_pictures"); // Specify the folder
    formData.append("public_id", id); // Optional: you can omit this if you want Cloudinary to generate the public_id

    // Perform the upload
    const response = await fetch(uploadUrl, {
      method: "POST",
      body: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    const result = await response.json();
    if (response.ok) {
      return { secure_url: result.secure_url };
    } else {
      console.error(result);
      return { secure_url: "" };
    }
  } catch (error) {
    console.error("Upload image error:", error);
    Alert.alert("Erro no upload da imagem.");
    return { secure_url: "" };
  }
};

// https://res.cloudinary.com/dwngturuh/image/upload/profile-pictures/1.jpg
