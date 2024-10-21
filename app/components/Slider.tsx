import { StatusBar } from "expo-status-bar";
import React, { useRef, useState, useEffect } from "react";
import {
  Dimensions,
  FlatList,
  View,
  StyleSheet,
  TouchableOpacity,
  BackHandler,
} from "react-native";
import { optimizeImageMediumQ } from "../../utils/imageOptimizer";
import SliderImage from "./SliderImage";

const { width } = Dimensions.get("window");
const viewConfigRef = { viewAreaCoveragePercentThreshold: 95 };

interface Props {
  imageUrls: string[];
  paused?: boolean;
}

export default function Slider({ imageUrls, paused = false }: Props) {
  const flatListRef = useRef<FlatList<string>>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isUserScrolling, setIsUserScrolling] = useState(false); // Track user scrolling state
  const intervalRef = useRef<NodeJS.Timeout | null>(null); // To store the interval ID

  const onViewRef = useRef(({ changed }: { changed: any }) => {
    if (changed[0].isViewable) {
      const newIndex = changed[0].index;
      setCurrentIndex(newIndex);
      setIsUserScrolling(false); // Reset user scrolling status when view changes
    }
  });

  const scrollToIndex = (index: number) => {
    if (index >= 0 && index < imageUrls.length) {
      flatListRef.current?.scrollToIndex({ animated: true, index });
    }
  };

  const handleNext = () => {
    const nextIndex = (currentIndex + 1) % imageUrls.length;
    scrollToIndex(nextIndex);
  };

  const handlePrev = () => {
    const prevIndex = (currentIndex - 1 + imageUrls.length) % imageUrls.length;
    scrollToIndex(prevIndex);
  };

  useEffect(() => {
    // Set interval for auto-slide if not paused and user is not scrolling
    if (imageUrls.length > 0 && !paused && !isUserScrolling) {
      intervalRef.current = setInterval(handleNext, 3000); // Auto-slide every 3 seconds
    }

    // Cleanup interval on unmount or when conditions change
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [imageUrls.length, paused, isUserScrolling]); // Only reset interval if these change

  useEffect(() => {
    // Restart interval if user is not scrolling and not paused
    if (imageUrls.length > 0 && !paused && !isUserScrolling) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      intervalRef.current = setInterval(handleNext, 3000); // Restart auto-slide every 3 seconds
    }
  }, [currentIndex]); // Restart interval when currentIndex changes

  const renderItems = ({ item }: { item: string }) => (
    <SliderImage
      style={{ width: width }}
      imageUrl={optimizeImageMediumQ(item)}
    />
  );

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />

      {/* Progress bar at the top */}
      <View style={styles.progressBarContainer}>
        {imageUrls.map((_, index: number) => (
          <View
            key={index.toString()}
            style={[
              styles.progressBar,
              {
                width: `${90 / imageUrls.length}%`, // Reduce width to leave space for the margin
                backgroundColor: index <= currentIndex ? "white" : "black", // Highlight current step
              },
            ]}
          />
        ))}
      </View>

      <FlatList
        data={imageUrls}
        renderItem={renderItems}
        keyExtractor={(item, index) => index.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        ref={flatListRef}
        style={styles.carousel}
        viewabilityConfig={viewConfigRef}
        onViewableItemsChanged={onViewRef.current}
        onTouchStart={() => {
          setIsUserScrolling(true); // Set user scrolling state to true on touch
          if (intervalRef.current) {
            clearInterval(intervalRef.current); // Clear interval on touch
          }
        }}
        onTouchEnd={() => {
          setIsUserScrolling(false); // Set user scrolling state to false when touch ends
          // Restart interval after user interaction
          if (!paused) {
            intervalRef.current = setInterval(handleNext, 3000);
          }
        }}
      />

      {/* Touchable areas on the sides */}
      <TouchableOpacity style={styles.leftTouchArea} onPress={handlePrev} />
      <TouchableOpacity style={styles.rightTouchArea} onPress={handleNext} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
  },
  progressBarContainer: {
    flexDirection: "row",
    position: "absolute",
    top: 5,
    left: 0,
    right: 0,
    height: 5,
    zIndex: 10,
    justifyContent: "space-between", // Ensure space between each rectangle
    paddingHorizontal: 5, // Add padding to give some space on the sides
  },
  progressBar: {
    height: "100%",
    backgroundColor: "black",
    marginHorizontal: 2, // Space between each rectangle
    borderRadius: 2, // Make them slightly rounded
  },
  carousel: {
    marginTop: 0,
  },
  leftTouchArea: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: width / 2,
    zIndex: 20,
  },
  rightTouchArea: {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    width: width / 2,
    zIndex: 20,
  },
});
