import { StatusBar } from 'expo-status-bar';
import React, { useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  View,
} from 'react-native';

const { width } = Dimensions.get('window');
const carouselItem = require('../../assets/carousel.json');
const viewConfigRef = { viewAreaCoveragePercentThreshold: 95 };

interface CarouselItems {
  title: string;
  url: string;
  promo: string;
}

export default function Slider() {
  let flatListRef = useRef<FlatList<CarouselItems> | null>();
  const [currentIndex, setCurrentIndex] = useState(0);

  const onViewRef = useRef(({ changed }: { changed: any }) => {
    if (changed[0].isViewable) {
      setCurrentIndex(changed[0].index);
    }
  });

  const scrollToIndex = (index: number) => {
    flatListRef.current?.scrollToIndex({ animated: true, index: index });
  };

  const renderItems: React.FC<{ item: CarouselItems }> = ({ item }) => {
    return (
      <View>
        <Image source={{ uri: item.url }} style={styles.image} />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      
      {/* Barra de progresso na parte superior */}
      <View style={styles.progressBarContainer}>
        {carouselItem.map((_, index: number) => (
          <View
            key={index.toString()}
            style={[
              styles.progressBar,
              {
                width: `${100 / carouselItem.length}%`,
                backgroundColor: index <= currentIndex ? 'black' : 'grey',
              },
            ]}
          />
        ))}
      </View>

      <FlatList
        data={carouselItem}
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
    backgroundColor: 'transparent',
  },
  progressBarContainer: {
    flexDirection: 'row',
    position: 'absolute',
    top: 10,
    left: 0,
    right: 0,
    height: 5,
    zIndex: 10,
  },
  progressBar: {
    height: '100%',
  },
  carousel: {
    marginTop: 0, // Ajuste o valor conforme necessário para não sobrepor a barra de progresso
  },
  image: {
    width,
    height: '100%',
    resizeMode: 'cover',
  },
});
