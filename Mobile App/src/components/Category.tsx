import React, { FC, useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native'; // Import the navigation hook
import { BackendUrl } from '../utils/utils';

const Category: FC = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const navigation = useNavigation(); // Initialize navigation

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${BackendUrl}api/categories`);
        setCategories(response.data);
        
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryPress = (category: any) => {
    // Navigate to the category section, passing the category data
   
    navigation.navigate('CategorySection', { category });
  };

  const renderCategoryItem = ({ item }: any) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => handleCategoryPress(item)} // Handle category press
    >
      {item.image ? (
        <Image source={{ uri: item.image }} style={styles.image} />
      ) : (
        <View style={styles.imageFallback} />
      )}
      <Text style={styles.cardText}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Categories</Text>
       
      </View>
      <FlatList
        horizontal
        data={categories}
        renderItem={renderCategoryItem}
        keyExtractor={(item) => item._id}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  seeAll: {
    fontSize: 14,
    color: 'tomato',
    fontWeight: '600',
  },
  listContainer: {
    paddingHorizontal: 0,
  },
  card: {
    width: 125,
    height: 150,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    marginRight: 15,
    overflow: 'hidden',
    elevation: 3,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '75%',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    resizeMode: 'cover',
  },
  imageFallback: {
    width: '100%',
    height: '75%',
    backgroundColor: '#ddd',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  cardText: {
    marginTop: 5,
    fontSize: 16,
    fontWeight: '600',
    color: 'black',
    textAlign: 'center',
  },
});

export default Category;
