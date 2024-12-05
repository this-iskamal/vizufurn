import React, { FC, useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import axios from 'axios'; 
import { BackendUrl } from '../utils/utils';

const Category: FC = () => {
  const [categories, setCategories] = useState<any[]>([]); 

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

  const renderCategoryItem = ({ item }: any) => (
    <TouchableOpacity style={styles.card} >
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
        <TouchableOpacity>
          <Text style={styles.seeAll}>See all →</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        horizontal
        data={categories}
        renderItem={renderCategoryItem}
        keyExtractor={item => item._id}
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
    height: 150, // Increased height to accommodate the text below the image
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    marginRight: 15,
    overflow: 'hidden',
    elevation: 3,
    justifyContent: 'center', // Ensures content is centered vertically
    alignItems: 'center', // Centers items horizontally
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '75%', // Image occupies 75% of the card height
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    resizeMode: 'cover',
  },
  imageFallback: {
    width: '100%',
    height: '75%', // Placeholder for missing image
    backgroundColor: '#ddd',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  cardText: {
    marginTop: 5, // Adds a small gap between the image and the text
    fontSize: 16,
    fontWeight: '600',
    color: 'black',
    textAlign: 'center', // Centers the text
  },
});

export default Category;
