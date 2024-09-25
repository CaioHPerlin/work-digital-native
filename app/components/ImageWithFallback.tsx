import React, { useState, useEffect } from "react";
import {
  ActivityIndicator,
  Image,
  StyleProp,
  ImageStyle,
  View,
} from "react-native";

interface Props {
  imageUrl: string | null; // Allow imageUrl to be null
  style?: StyleProp<ImageStyle>;
  cache?: boolean;
}

const ImageWithFallback: React.FC<Props> = ({ imageUrl, style, cache }) => {
  const [loaded, setLoaded] = useState(false);
  const [imageSource, setImageSource] = useState(
    require("../../assets/images/user.jpg")
  );

  useEffect(() => {
    const checkUrl = async (url: string) => {
      try {
        const response = await fetch(url); // check URL validity
        if (response.ok) {
          let imageUri = url;
          if (cache === false) {
            imageUri += `?random=${Date.now()}`; // Disable caching
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
  }, [imageUrl, cache]);

  const handleError = () => {
    setImageSource(require("../../assets/images/user.jpg"));
    setLoaded(true); // Mark image as loaded even on error
  };

  console.log(style);

  return (
    <View
      style={[
        style,
        {
          padding: 0,
          justifyContent: "center",
          alignItems: "center",
        },
      ]}
    >
      {!loaded && (
        <ActivityIndicator size="small" color="#FFC88d" style={style} />
      )}
      <Image
        fadeDuration={250}
        source={imageSource}
        style={[style, !loaded && { opacity: 0 }]} // Hide image until loaded
        onError={handleError}
        onLoad={() => setLoaded(true)} // Set to true once image is loaded
      />
    </View>
  );
};

export default ImageWithFallback;
