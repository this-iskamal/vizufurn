import React, {FC, useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {RouteProp, useRoute, useNavigation} from '@react-navigation/native';
import {RootStackParamList, TabParamList} from '../navigation/Navigation';
import {BackendUrl} from '../utils/utils';
import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type SearchScreenRouteProp = RouteProp<TabParamList, 'Search'>;
type NavigationProp = BottomTabNavigationProp<TabParamList, 'Search'>;

interface Product {
  _id: string;
  name: string;
  price: number;
  images: string[];
  description?: string;
  category: string;
}

const SearchScreen: FC = () => {
  const route = useRoute<SearchScreenRouteProp>();
  const navigation = useNavigation<NavigationProp>();
  const navigationtoproduct =
      useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {query: initialQuery} = route.params || {}; // Retrieve query parameter
  const [searchQuery, setSearchQuery] = useState<string>(initialQuery || ''); // State to hold search input
  const [results, setResults] = useState<Product[]>([]); // State to hold search results
  const [isLoading, setIsLoading] = useState(false); // State for loading indicator

  // Function to fetch search results
  const fetchSearchResults = async (query: string) => {
    if (!query.trim()) {
      Alert.alert('Please enter a search query.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `${BackendUrl}api/products/search?query=${query}`,
      );
      const data = await response.json();

      setResults(data);
    } catch (error) {
      console.error('Error fetching search results:', error);
      Alert.alert('Failed to fetch search results. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch results if there's an initial query passed
  useEffect(() => {
    if (initialQuery) {
      setSearchQuery(initialQuery); // Update searchQuery state when initialQuery changes
      fetchSearchResults(initialQuery);
    }
  }, [initialQuery]);

  // Function to handle submit
  const handleSearch = () => {
    // Update the initialQuery when navigating to this screen with new parameters
    navigation.navigate('Search', {query: searchQuery});
  };

  // Render each product in the list
  const renderItem = ({item}: {item: Product}) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => navigationtoproduct.navigate('ProductDetail', {product: item})}>
      <Image source={{uri: item.images[0]}} style={styles.image} />
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.price}>Rs {item.price}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Search Input */}
      <View style={styles.searchContainer}>
        <Icon name="search" size={28} color="#888" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Search for products..."
          placeholderTextColor="#aaa"
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>
      </View>

      {/* Search Results */}
      {isLoading ? (
        <Text style={styles.loadingText}>Loading...</Text>
      ) : results.length > 0 ? (
        <>
          <View style={styles.header}>
            <Text style={styles.title}>Popular</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>See All →</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={results}
            renderItem={renderItem}
            keyExtractor={item => item._id}
            numColumns={2}
            columnWrapperStyle={styles.row}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
          />
        </>
      ) : (
        <Text style={styles.noResultsText}>
          {initialQuery
            ? `No results for "${initialQuery}"`
            : 'No search results yet.'}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  searchButton: {
    backgroundColor: 'tomato',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  searchButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  loadingText: {
    textAlign: 'center',
    fontSize: 18,
    color: '#555',
    marginTop: 20,
  },
  noResultsText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#aaa',
    marginTop: 20,
  },
  resultsContainer: {
    paddingBottom: 20,
  },
  productCard: {
    padding: 15,
    marginBottom: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: {width: 0, height: 4},
    elevation: 5,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  productPrice: {
    fontSize: 16,
    color: 'tomato',
    marginBottom: 5,
  },
  productDescription: {
    fontSize: 14,
    color: '#555',
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
    shadowOffset: {width: 0, height: 2},
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
    fontWeight: '800',
    color: 'tomato',
    marginTop: 4,
  },
});

export default SearchScreen;
