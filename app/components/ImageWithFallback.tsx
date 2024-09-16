import React, { useState, useEffect } from "react";
import { Image, StyleProp, ImageStyle } from "react-native";

interface Props {
  imageUrl: string | null; // Allow imageUrl to be null
  style?: StyleProp<ImageStyle>;
  cache?: boolean;
}

const ImageWithFallback: React.FC<Props> = ({ imageUrl, style, cache }) => {
  const [imageSource, setImageSource] = useState(
    require("../../assets/images/user.jpg")
  );

  useEffect(() => {
    const checkUrl = async (url: string) => {
      try {
        const response = await fetch(url, { method: "HEAD" }); // check URL validity
        if (response.ok) {
          let imageUri = url;
          if (cache !== undefined && cache === false) {
            imageUri += `?random=${Date.now()}`;
          }
          setImageSource({ uri: imageUri });
        }
      } catch (error) {
        setImageSource(require("../../assets/images/user.jpg"));
      }
    };

    if (imageUrl) {
      checkUrl(imageUrl);
    } else {
      setImageSource(require("../../assets/images/user.jpg"));
    }
  }, [imageUrl]);

  const handleError = () => {
    setImageSource(require("../../assets/images/user.jpg"));
  };

  return <Image source={imageSource} onError={handleError} style={style} />;
};

export default ImageWithFallback;
