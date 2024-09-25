import { Alert } from "react-native";
import { supabase } from "./supabase";
import {
  FunctionsFetchError,
  FunctionsHttpError,
  FunctionsRelayError,
} from "@supabase/supabase-js";
import * as FileSystem from "expo-file-system";

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

export const uploadImage = async (imageUri: string, id: string) => {
  if (!imageUri) {
    console.error("No image selected:", imageUri);
    return;
  }

  try {
    let uploadUri = imageUri;
    if (imageUri.startsWith("file://")) {
      uploadUri = await uriToBase64(imageUri);
    }
    // Prepare form data
    const formData = new FormData();

    formData.append("file", uploadUri);
    formData.append("id", id); // Optional: you can pass the ID if you want to customize the public_id on the server

    // Perform the upload
    const { data, error } = await supabase.functions.invoke("image-upload", {
      method: "POST",
      body: formData,
    });

    console.log(imageUri);

    if (error) {
      if (error instanceof FunctionsHttpError) {
        const errorMessage = error.message;
        console.error("Function returned an HTTP error:", errorMessage);
        console.error(error.name);
      } else if (error instanceof FunctionsRelayError) {
        console.error("Relay error:", error.message);
      } else if (error instanceof FunctionsFetchError) {
        console.error("Fetch error:", error.message);
      } else {
        console.error("Unexpected error:", error);
      }
      throw error; // Rethrow to handle it in the catch block
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
