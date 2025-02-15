import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Modal,
  Button,
} from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { BackendUrl } from '../utils/utils';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/Navigation';

const CategorySection = ({ route }: any) => {
  const { category } = route.params;
  interface Product {
    _id: string;
    images: string[];
    name: string;
    price: number;
  }
  
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterModalVisible, setFilterModalVisible] = useState(false);
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [sortOption, setSortOption] = useState<'lowToHigh' | 'highToLow' | null>(
    null
  );

  const navigation =
      useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          `${BackendUrl}api/products/${category._id}`
        );
        setProducts(response.data);
        setFilteredProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, [category._id]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const filtered = products.filter((product) =>
      product.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredProducts(filtered);
  };

  const handleFilter = () => {
    const { min, max } = priceRange;
    const filtered = products.filter(
      (product) =>
        (!min || product.price >= parseFloat(min)) &&
        (!max || product.price <= parseFloat(max))
    );
    setFilteredProducts(filtered);
    setFilterModalVisible(false);
  };

  const handleSort = (option: 'lowToHigh' | 'highToLow') => {
    setSortOption(option);
    const sorted = [...filteredProducts].sort((a, b) =>
      option === 'lowToHigh'
        ? a.price - b.price
        : b.price - a.price
    );
    setFilteredProducts(sorted);
  };

  const renderProduct = ({
    item,
  }: {
    item: {
      _id: string;
      images: string[];
      name: string;
      price: number;
    };
  }) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => navigation.navigate('ProductDetail', { product: item })}
    >
      <Image source={{ uri: item.images[0] }} style={styles.image} />
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.price}>Rs {item.price}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Products in {category.name}</Text>
      <View style={styles.searchSortContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search products..."
          value={searchQuery}
          onChangeText={handleSearch}
        />
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setFilterModalVisible(true)}
        >
          <Text style={styles.filterButtonText}>Filter</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.sortButton}
          onPress={() =>
            handleSort(sortOption === 'lowToHigh' ? 'highToLow' : 'lowToHigh')
          }
        >
          <Text style={styles.sortButtonText}>
            {sortOption === 'lowToHigh' ? 'Price ↓' : 'Price ↑'}
          </Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={filteredProducts}
        renderItem={renderProduct}
        keyExtractor={(item) => item._id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />
      {/* Filter Modal */}
      <Modal
        visible={isFilterModalVisible}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Filter by Price Range</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Min Price"
              keyboardType="numeric"
              value={priceRange.min}
              onChangeText={(value) =>
                setPriceRange((prev) => ({ ...prev, min: value }))
              }
            />
            <TextInput
              style={styles.modalInput}
              placeholder="Max Price"
              keyboardType="numeric"
              value={priceRange.max}
              onChangeText={(value) =>
                setPriceRange((prev) => ({ ...prev, max: value }))
              }
            />
            <View style={styles.modalButtons}>
              <Button title="Apply" onPress={handleFilter} />
              <Button
                title="Cancel"
                color="red"
                onPress={() => setFilterModalVisible(false)}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  searchSortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  filterButton: {
    backgroundColor: '#f0ad4e',
    borderRadius: 5,
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  filterButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  sortButton: {
    backgroundColor: '#5bc0de',
    borderRadius: 5,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginLeft: 10,
  },
  sortButtonText: {
    color: '#fff',
    fontWeight: 'bold',
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
    marginBottom: 12,
  },
  image: {
    width: '100%',
    height: 120,
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
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalInput: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
});

export default CategorySection;
