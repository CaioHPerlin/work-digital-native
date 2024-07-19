import { StatusBar } from 'expo-status-bar';
import React, { useRef, useState, useEffect } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const { width, height } = Dimensions.get('window');
const carouselItem = require('../../assets/carousel.json');
const viewConfigRef = { viewAreaCoveragePercentThreshold: 50 };

interface CarouselItems {
  title: string;
  url: string;
}

interface SliderProps {
  onLastItemVisible: () => void;
}

const Slider: React.FC<SliderProps> = ({ onLastItemVisible }) => {
  let flatListRef = useRef<FlatList<CarouselItems> | null>();
  const [currentIndex, setCurrentIndex] = useState(0);

  // Only needed if want to know the index
  const onViewRef = useRef(({ changed }: { changed: any }) => {
    if (changed[0].isViewable) {
      setCurrentIndex(changed[0].index);
      if (changed[0].index === carouselItem.length - 1) {
        onLastItemVisible();
      }
    }
  });

  const scrollToIndex = (index: number) => {
    flatListRef.current?.scrollToIndex({ animated: true, index: index });
  };

  const renderItems: React.FC<{ item: CarouselItems }> = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => console.log('clicked')}
        activeOpacity={1}
      >
        <Image source={{ uri: item.url }} style={styles.image} />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.dotView}>
        {carouselItem.map(({}, index: number) => (
          <TouchableOpacity
            key={index.toString()}
            style={[
              styles.circle,
              { backgroundColor: index == currentIndex ? 'black' : 'grey' },
            ]}
            onPress={() => scrollToIndex(index)}
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
    backgroundColor: '#fff',
    padding: 0,
  },
  carousel: {
    maxHeight: '100%',
  },
  image: {
    width,
    height: '100%',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 50,
    paddingHorizontal: 40,
    alignItems: 'center',
    backgroundColor: '#000',
  },
  footerText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  dotView: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 5,
  },
  circle: {
    maxWidth:'90%',
    width: 5,
    height: 5,
    backgroundColor: 'grey',

    marginHorizontal: 5,
  },
});

export default Slider;
