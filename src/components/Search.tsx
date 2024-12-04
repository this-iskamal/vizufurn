import React, { FC } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const Search: FC = () => {
  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Icon name="search" size={28} color="#888" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Chair, desk, lamp, etc"
          placeholderTextColor="#aaa"
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
