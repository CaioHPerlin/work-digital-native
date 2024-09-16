import { Cloudinary } from "@cloudinary/url-gen";

export const cld = new Cloudinary({
  cloud: {
    cloudName: process.env.EXPO_PUBLIC_CLOUD_NAME,
    apiKey: process.env.EXPO_PUBLIC_CLOUD_API_KEY,
    apiSecret: process.env.EXPO_PUBLIC_CLOUD_API_SECRET,
  },
});

import { Alert } from "react-native";
import { supabase } from "./supabase";

export const uploadImage = async (imageUri: string, id: string) => {
  if (!imageUri) {
    console.error("No image selected:", imageUri);
    return;
  }

  try {
    // Prepare form data
    const formData = new FormData();
    formData.append("file", {
      uri: imageUri,
      type: "image/jpeg", // Adjust if necessary
      name: "image.jpg", // Adjust if necessary
    } as any);
    formData.append("id", id); // Optional: you can pass the ID if you want to customize the public_id on the server

    // Perform the upload
    const { data, error } = await supabase.functions.invoke("upload-image", {
      method: "POST",
      body: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (error) {
      console.error("Upload failed:", error);
      throw new Error(`Upload failed: ${error}`);
    }

    const result = await data.json();
    return { secure_url: result.secure_url };
  } catch (error) {
    console.error("Upload image error:", error);
    Alert.alert("Erro no upload da imagem.", (error as Error).message);
    return { secure_url: "" };
  }
};

// https://res.cloudinary.com/dwngturuh/image/upload/profile-pictures/1.jpg
