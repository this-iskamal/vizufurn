import React, { FC } from 'react';
import { View, SafeAreaView, StyleSheet, FlatList } from 'react-native';
import Navbar from '../components/Navbar';
import Search from '../components/Search';
import Category from '../components/Category';
import Carousel from '../components/Carousel';
import PopularItems from '../components/PopularItems';

const Home: FC = () => {
  const renderContent = () => (
    <View style={styles.contentContainer}>
      <Navbar />
      <Search />
      <Category />
      <Carousel />
      <PopularItems />
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={[{ key: 'content' }]} 
        renderItem={renderContent}
        keyExtractor={(item) => item.key}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  contentContainer: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'column',
    paddingBottom: 20, 
  },
});

export default Home;
