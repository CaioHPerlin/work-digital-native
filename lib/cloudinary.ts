import { supabase } from "./supabase";
import {
  FunctionsFetchError,
  FunctionsHttpError,
  FunctionsRelayError,
} from "@supabase/supabase-js";
import * as FileSystem from "expo-file-system";
import * as ImageManipulator from "expo-image-manipulator";

// Helper to convert image URI to base64
const uriToBase64 = async (uri: string): Promise<string> => {
  try {
    const base64 = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    return `data:image/jpeg;base64,${base64}`;
  } catch (error) {
    console.error("Error reading file:", error);
    throw new Error("Failed to convert image to base64");
  }
};

// Compress the image
const compressImage = async (uri: string): Promise<string> => {
  try {
    const compressedImage = await ImageManipulator.manipulateAsync(
      uri,
      [{ resize: { width: 600 } }],
      { compress: 0.5, format: ImageManipulator.SaveFormat.JPEG } // Compression settings
    );
    return compressedImage.uri;
  } catch (error) {
    console.error("Error compressing image:", error);
    throw new Error("Failed to compress image");
  }
};

// Function to upload image
export const uploadImage = async (imageUri: string, id: string) => {
  if (!imageUri) {
    console.error("No image selected:", imageUri);
    return;
  }

  try {
    let uploadUri = imageUri;

    // Compress the image if it's a local file
    if (imageUri.startsWith("file://")) {
      uploadUri = await compressImage(imageUri);
      uploadUri = await uriToBase64(uploadUri); // Convert to base64 after compression
    }

    // Prepare form data
    const formData = new FormData();
    formData.append("file", uploadUri);
    formData.append("id", id); // Optional: pass ID to customize the public_id on the server

    // Perform the upload
    const { data, error } = await supabase.functions.invoke("image-upload", {
      method: "POST",
      body: formData,
    });

    if (error) {
      if (error instanceof FunctionsHttpError) {
        const errorMessage = error.message;
        console.error("Function returned an HTTP error:", errorMessage);
      } else if (error instanceof FunctionsRelayError) {
        console.error("Relay error:", error.message);
      } else if (error instanceof FunctionsFetchError) {
        console.error("Fetch error:", error.message);
      } else {
        console.error("Unexpected error:", error);
      }
      throw error;
    }

    // Ensure data is defined before attempting to parse it
    if (!data) {
      throw new Error("No data returned from the function.");
    }

    return { secure_url: data.secure_url };
  } catch (error) {
    console.error("Upload image error:", error);
    return { secure_url: "" };
  }
};
