import React, { FC, useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { TabParamList } from '../navigation/Navigation';

type NavigationProp = BottomTabNavigationProp<TabParamList, 'Search'>;

const Search: FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [searchQuery, setSearchQuery] = useState<string>(''); // State to hold search input

  const handleNavigate = () => {
    if (searchQuery.trim().length > 0) {
      navigation.navigate('Search', { query: searchQuery }); // Pass searchQuery as a parameter
    } else {
      Alert.alert('Please enter a search query.'); // Inform user if input is empty
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Icon name="search" size={28} color="#888" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Chair, desk, lamp, etc"
          placeholderTextColor="#aaa"
          value={searchQuery}
          onChangeText={setSearchQuery} // Update state on text change
          onSubmitEditing={handleNavigate} // Navigate on submit
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    height: 50,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
});

export default Search;
