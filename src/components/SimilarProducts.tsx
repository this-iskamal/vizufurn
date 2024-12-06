import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import axios from 'axios';
import {useNavigation} from '@react-navigation/native';
import {BackendUrl} from '../utils/utils'; 
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigation/Navigation';

interface SimilarProductProps {
  category: string;
  currentitem: string;
}

const SimilarProduct: React.FC<SimilarProductProps> = ({
  category,
  currentitem,
}) => {
  const [similarProducts, setSimilarProducts] = useState([]);
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    const fetchSimilarProducts = async () => {
      try {
        const response = await axios.get(
          `${BackendUrl}api/products?category=${category}`,
        );
        const filteredProducts = response.data.filter(
          (item: any) => item._id !== currentitem,
        );
        setSimilarProducts(filteredProducts);
      } catch (error) {
        console.error('Error fetching similar products:', error);
      }
    };

    if (category) {
      fetchSimilarProducts();
    }
  }, [category]);

  const renderProduct = ({
    item,
  }: {
    item: {
      _id: string;
      images: string[];
      name: string;
      price: string;
      category: string;
    };
  }) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => navigation.push('ProductDetail', {product: item})}>
      <Image source={{uri: item.images[0]}} style={styles.image} />
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.price}>Rs {item.price}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Similar Products</Text>
      <FlatList
        data={similarProducts}
        renderItem={renderProduct}
        keyExtractor={item => item._id}
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
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  itemContainer: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  image: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
  },
  name: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '500',
  },
  price: {
    marginTop: 5,
    fontSize: 16,
    fontWeight: 'bold',
  },
  listContainer: {
    paddingBottom: 20,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 12,
  },
});

export default SimilarProduct;
