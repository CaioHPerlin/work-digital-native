import React, { useState, useEffect, useRef } from "react";
import {
  ActivityIndicator,
  Animated,
  StyleProp,
  ImageStyle,
  View,
} from "react-native";
import { Image } from "expo-image";

interface Props {
  imageUrl: string | null; // Allow imageUrl to be null
  style?: StyleProp<ImageStyle>;
  cache?: "none" | "memory-disk" | "disk" | "memory";
  onLoad?: () => void;
}

const ImageWithFallback: React.FC<Props> = ({
  imageUrl,
  style,
  cache,
  onLoad,
}) => {
  const [loaded, setLoaded] = useState(false);
  const [imageSource, setImageSource] = useState<any>();
  const pulseAnim = useRef(new Animated.Value(1)).current; // Animation value for pulse effect

  useEffect(() => {
    if (!imageUrl) {
      setImageSource(require("../../assets/images/user.jpg"));
      return;
    }

    const checkUrl = async (url: string) => {
      try {
        setImageSource({ uri: url });
      } catch (error) {
        setImageSource(require("../../assets/images/user.jpg"));
      }
    };

    checkUrl(imageUrl);
  }, [imageUrl]);

  useEffect(() => {
    if (!loaded) {
      // Start the pulsing animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [loaded, pulseAnim]);
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
        // Pulse animation while image is loading
        <Animated.View
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: "#0r0r0r", // Skeleton color
            transform: [{ scale: pulseAnim }],
            position: "absolute",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ActivityIndicator size="large" color="#FFC88d" />
        </Animated.View>
      )}
      <Image
        source={imageSource}
        cachePolicy={cache ? cache : "disk"}
        contentFit="cover"
        transition={100}
        style={[style, { opacity: loaded ? 1 : 0 }]} // Hide image until loaded
        onLoad={() => {
          setLoaded(true);
          if (onLoad) onLoad();
        }} // Image has loaded
      />
    </View>
  );
};

export default ImageWithFallback;
