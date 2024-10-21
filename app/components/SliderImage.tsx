import React, { useState, useEffect, useRef } from "react";
import {
  ActivityIndicator,
  Animated,
  StyleProp,
  ImageStyle,
  View,
  Dimensions,
} from "react-native";
import { Image } from "expo-image";

interface Props {
  imageUrl: string | null; // Allow imageUrl to be null
  style?: StyleProp<ImageStyle>;
  cache?: "none" | "memory-disk" | "disk" | "memory";
  onLoad?: () => void;
}

const SliderImage: React.FC<Props> = ({ imageUrl, style, cache, onLoad }) => {
  const [loaded, setLoaded] = useState(false);
  const [imageSource, setImageSource] = useState<any>();
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!imageUrl) {
      setImageSource(require("../../assets/images/user.jpg"));
      return;
    }

    const checkUrl = async (url: string) => {
      try {
        const res = await fetch(url);
        if (res.ok) {
          setImageSource({ uri: url });
        } else {
          setImageSource(require("../../assets/images/user.jpg"));
        }
      } catch (error) {
        setImageSource(require("../../assets/images/user.jpg"));
      }
    };

    checkUrl(imageUrl);
  }, [imageUrl]);

  useEffect(() => {
    if (!loaded) {
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
        {
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          height: "100%",
        },
        style,
      ]}
    >
      {!loaded && (
        <Animated.View
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: "#f0f0f0",
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
        contentFit="contain" // Ensures the image maintains aspect ratio and fits within container
        transition={100}
        style={[
          style,
          {
            width: "100%",
            height: "100%",
            opacity: loaded ? 1 : 0,
          },
        ]}
        onLoad={() => {
          setLoaded(true);
          if (onLoad) onLoad();
        }}
      />
    </View>
  );
};

export default SliderImage;
