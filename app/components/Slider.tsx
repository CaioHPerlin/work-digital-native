import { StatusBar } from 'expo-status-bar';
import React, { useRef, useState } from 'react';
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
const viewConfigRef = { viewAreaCoveragePercentThreshold: 95 };

interface CarouselItems {
  title: string;
  url: string;
  promo: string;
}
export default function Slider() {
  let flatListRef = useRef<FlatList<CarouselItems> | null>();
  const [currentIndex, setCurrentIndex] = useState(0);

  // Only needed if want to know the index
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 0.9,
    margin:0,
 
  },
  carousel: {
    maxHeight: 300,
  },
  image: {
    width,
    height: 250,
    resizeMode: 'cover',
  },


  dotView: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: -30,
  },
  circle: {
    width: 10,
    height: 10,
    backgroundColor: 'grey',
    borderRadius: 50,
    marginHorizontal: 5,
  },
});
