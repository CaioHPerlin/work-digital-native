import { StatusBar } from "expo-status-bar";
import React, { useRef, useState, useEffect } from "react";
import {
  Dimensions,
  FlatList,
  View,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import ImageWithFallback from "./ImageWithFallback";
import { optimizeImageMediumQ } from "../../utils/imageOptimizer";

const { width } = Dimensions.get("window");
const viewConfigRef = { viewAreaCoveragePercentThreshold: 95 };

interface Props {
  imageUrls: string[];
}

export default function Slider({ imageUrls }: Props) {
  const flatListRef = useRef<FlatList<string>>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false); // Track if FlatList is in the middle of a scroll

  const onViewRef = useRef(({ changed }: { changed: any }) => {
    if (changed[0].isViewable) {
      const newIndex = changed[0].index;
      setCurrentIndex(newIndex);
      setIsScrolling(false); // Reset scrolling status when view changes
    }
  });

  const scrollToIndex = (index: number) => {
    if (index >= 0 && index < imageUrls.length && !isScrolling) {
      setIsScrolling(true); // Set scrolling status to true to prevent multiple scrolls
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
    if (imageUrls.length > 0) {
      const interval = setInterval(handleNext, 3000); // Auto-slide every 3 seconds
      return () => clearInterval(interval); // Clear interval on unmount
    }
  }, [imageUrls.length, currentIndex]); // Only reset interval if imageUrls length or currentIndex changes

  const renderItems = ({ item }: { item: string }) => (
    <View>
      <ImageWithFallback
        imageUrl={optimizeImageMediumQ(item)}
        style={styles.image}
      />
    </View>
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
                width: `${100 / imageUrls.length}%`,
                backgroundColor: index <= currentIndex ? "white" : "black",
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
  },
  progressBar: {
    height: "100%",
  },
  carousel: {
    marginTop: 0,
  },
  image: {
    width,
    height: "100%",
    resizeMode: "cover",
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
