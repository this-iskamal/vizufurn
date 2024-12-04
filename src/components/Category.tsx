import React, {FC} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';

const categories = [
  {
    id: '1',
    title: 'Chair',
    image: require('../assets/images/categoryIcons/chair.png'),
  },
  {
    id: '2',
    title: 'Sofa',
    image: require('../assets/images/categoryIcons/sofa.png'),
  },
  {
    id: '3',
    title: 'Desk',
    image: require('../assets/images/categoryIcons/table.png'),
  },
];

const Category: FC = () => {
  const renderCategoryItem = ({item}: any) => (
    <TouchableOpacity style={styles.card}>
      <Image source={item.image} style={styles.image} />
      <Text style={styles.cardText}>{item.title}</Text>
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
        keyExtractor={item => item.id}
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
    color: '#FF8C00',
    fontWeight: '600',
  },
  listContainer: {
    paddingHorizontal: 0,
  },
  card: {
    width: 125,
    height: 56, // Keeping the card height to match the image size
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    marginRight: 15,
    overflow: 'hidden',
    elevation: 3,
    justifyContent: 'flex-end', // Ensures text is aligned at the bottom
    position: 'relative', // Important for absolute positioning of text
  },
  image: {
    width: '100%',
    height: '100%',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    resizeMode:"cover"
  },
  cardText: {
    position: 'absolute',
    bottom: 15,
    left: 10,
    fontSize: 21,
    fontWeight: '600',

    color: 'black',
  },
});

export default Category;
