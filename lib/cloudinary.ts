import { Cloudinary } from "@cloudinary/url-gen";
import { upload } from "cloudinary-react-native";
import { Alert } from "react-native";

export const cld = new Cloudinary({
  cloud: {
    cloudName: process.env.EXPO_PUBLIC_CLOUD_NAME,
    apiKey: process.env.EXPO_PUBLIC_CLOUD_API_KEY,
    apiSecret: process.env.EXPO_PUBLIC_CLOUD_API_SECRET,
  },
});

export const uploadImage = async (image: any, id: string) => {
  if (!image) {
    return console.error("No image selected:", image);
  }
  try {
    await upload(cld, {
      file: image,

      options: {
        folder: "profile_pictures",
        public_id: id,
        upload_preset: "default",
        unsigned: true,
      },
      callback: (error: any, response: any) => {
        console.log(response);
      },
    });
  } catch (error) {
    Alert.alert("Erro no upload da imagem.");
  }
};

// https://res.cloudinary.com/dwngturuh/image/upload/profile-pictures/1.jpg
