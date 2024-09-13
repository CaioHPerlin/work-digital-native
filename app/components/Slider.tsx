import { StatusBar } from "expo-status-bar";
import React, { useRef, useState, useEffect } from "react";
import { Dimensions, FlatList, Image, StyleSheet, View } from "react-native";
import { HighlightImage } from "../types";

const { width } = Dimensions.get("window");
const viewConfigRef = { viewAreaCoveragePercentThreshold: 95 };

interface Props {
  highlight: HighlightImage;
}

export default function Slider({ highlight }: Props) {
  let flatListRef = useRef<FlatList<string[]> | null>();
  const [currentIndex, setCurrentIndex] = useState(0);

  const onViewRef = useRef(({ changed }: { changed: any }) => {
    if (changed[0].isViewable) {
      setCurrentIndex(changed[0].index);
    }
  });

  const scrollToIndex = (index: number) => {
    flatListRef.current?.scrollToIndex({ animated: true, index: index });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (currentIndex + 1) % highlight.images.length;
      scrollToIndex(nextIndex);
    }, 3000); // Muda a imagem a cada 3 segundos

    return () => clearInterval(interval); // Limpa o intervalo quando o componente desmonta
  }, [currentIndex]);

  const renderItems: React.FC<{ item: string }> = ({ item }) => {
    return (
      <View>
        <Image source={{ uri: item }} style={styles.image} />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />

      {/* Barra de progresso na parte superior */}
      <View style={styles.progressBarContainer}>
        {highlight.images.map((_, index: number) => (
          <View
            key={index.toString()}
            style={[
              styles.progressBar,
              {
                width: `${100 / highlight.images.length}%`,
                backgroundColor: index <= currentIndex ? "black" : "grey",
              },
            ]}
          />
        ))}
      </View>

      <FlatList
        data={highlight.images}
        renderItem={renderItems}
        keyExtractor={(item, index) => index.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        ref={(ref) => {
          flatListRef.current = ref;
        }}
        style={styles.carousel}
        viewabilityConfig={viewConfigRef}
        onViewableItemsChanged={onViewRef.current}
      />
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
    top: 10,
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
});
