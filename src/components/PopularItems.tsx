import axios from 'axios';
import React, { FC, useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { BackendUrl } from '../utils/utils';

const PopularItems: FC = () => {
  interface Product {
    _id: string;
    name: string;
    price: string;
    image: any; 
  }
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${BackendUrl}api/products`); // Replace with your actual backend URL
        setProducts(response.data);
 
        setLoading(false);
      } catch (error:any) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchProducts();

  }, []);

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (error) {
    return <Text>Error: {error}</Text>;
  }
  const popularItems = [
    {
      id: 'sverom-chair',
      name: 'Sverom chair',
      price: 'RS 400',
      image: require('../assets/images/productsphoto/chair.png'),
    },
    {
      id: 'norrviken-chair-table',
      name: 'Norrviken chair and table',
      price: 'RS 999',
      image: require('../assets/images/productsphoto/nicechair.png'),
    },
    {
      id: 'ektorp-sofa',
      name: 'Ektorp sofa',
      price: 'RS 599',
      image: require('../assets/images/productsphoto/nicesofe.png'),
    },
    {
      id: 'jan-stiangganvik-sofa',
      name: 'Jan Stiangganvik sofa',
      price: 'RS 599',
      image: require('../assets/images/productsphoto/sofa.png'),
    },
  ];

  const renderItem = ({ item }: { item: typeof products[0] }) => (
    <View style={styles.itemContainer} >
     <Image source={{ uri: item.image }} style={styles.image} />

      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.price}>Rs{" "}{item.price}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Popular</Text>
        <TouchableOpacity>
          <Text style={styles.seeAll}>See All →</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={products}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        numColumns={2} 
        columnWrapperStyle={styles.row} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
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
    paddingBottom: 20,
  },
  row: {
    justifyContent: 'space-between', 
    marginBottom: 12, 
  },
  itemContainer: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.2, 
    shadowRadius: 4, 
    elevation: 4, 
  },
  image: {
    width: '100%',
    height: 150,
    borderRadius: 10,
    resizeMode: 'cover',
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
  },
  price: {
    fontSize: 20,
    fontWeight:"800",
    color: 'black',
    marginTop: 4,
  },
});

export default PopularItems;
