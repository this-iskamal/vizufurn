import React, { FC, useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const carouselData = [
  {
    id: '1',
    title: 'Product 1',
    image: require('../assets/images/carousel/carousel1.jpg'),
  },
  {
    id: '2',
    title: 'Product 2',
    image: require('../assets/images/carousel/carousel2.jpg'),
  },
  {
    id: '3',
    title: 'Product 3',
    image: require('../assets/images/carousel/carousel4.jpg'),
  },
];

const Carousel: FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((activeIndex + 1) % carouselData.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [activeIndex]);

  return (
    <View style={styles.container}>
      <Image
        source={carouselData[activeIndex].image}
        style={styles.carouselImage}
        resizeMode="cover"
      />

      <View style={styles.indicatorContainer}>
        {carouselData.map((_, index) => (
          <View
            key={index}
            style={[styles.indicator, index === activeIndex ? styles.activeIndicator : null]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10, 
    position: 'relative',
    paddingHorizontal:20
  },
  carouselImage: {
    width: '100%',
    height: 150, 
    borderRadius:10,
   
  },
  indicatorContainer: {
    position: 'absolute',
    bottom: 10,  
    flexDirection: 'row',
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ccc',
    marginHorizontal: 4,
  },
  activeIndicator: {
    backgroundColor: '#333',
  },
});

export default Carousel;
