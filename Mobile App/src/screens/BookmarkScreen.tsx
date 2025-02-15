import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
} from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';
import {useCartStore} from '../state/cartStore';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigation/Navigation';

const Cart = () => {
  const {items, totalPrice, updateQuantity, removeFromCart, clearCart} =
    useCartStore();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handleRemove = (itemId: string) => {
    removeFromCart(itemId);
  };

  const handleQuantityChange = (
    itemId: string,
    operation: 'increment' | 'decrement',
  ) => {
    const newQuantity = operation === 'increment' ? 1 : -1;
    const item = items.find(item => item._id === itemId);
    if (item) {
      updateQuantity(itemId, item.quantity + newQuantity);
    }
  };

  const handleEmptyCart = () => {
    clearCart();
  };

  const handleEsewaPayment = () => {
    navigation.navigate('Payment', {totalPrice, items, method: 'eSewa' });
  };

  const handleKhaltiPayment = () => {
    navigation.navigate('Payment', {totalPrice, items, method: 'Khalti' });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Your Cart</Text>
        <TouchableOpacity
          onPress={handleEmptyCart}
          style={styles.emptyCartButton}>
          <Ionicons name="trash-bin-outline" size={24} color="tomato" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={items}
        keyExtractor={item => item._id}
        renderItem={({item}) => (
          <View style={styles.itemContainer}>
            <Image source={{uri: item.image}} style={styles.image} />
            <View style={styles.itemDetails}>
              <Text style={styles.name}>{item.name}</Text>
              <View style={styles.quantityContainer}>
                <TouchableOpacity
                  onPress={() => handleQuantityChange(item._id, 'decrement')}
                  disabled={item.quantity === 1}>
                  <Text style={styles.quantityButton}>-</Text>
                </TouchableOpacity>
                <Text style={styles.quantity}>{item.quantity}</Text>
                <TouchableOpacity
                  onPress={() => handleQuantityChange(item._id, 'increment')}>
                  <Text style={styles.quantityButton}>+</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.price}>Rs {item.price * item.quantity}</Text>
            </View>
            <TouchableOpacity onPress={() => handleRemove(item._id)}>
              <Text style={styles.removeButton}>X</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      <View style={styles.totalContainer}>
        <Text style={styles.totalText}>Total</Text>
        <Text style={styles.totalPrice}>Rs {totalPrice}</Text>
      </View>
      <View style={styles.paymentOptions}>
        <TouchableOpacity
          style={styles.paymentButton}
          onPress={handleEsewaPayment}>
          <Image
            source={{uri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAMAAABF0y+mAAAAmVBMVEVHcEzb7dRbxzRZyjBWwjBTvyhFnBxXwzhiyCJTwi8+hRxbzjL1+/BgyTVh0ixYxTROsSRQxClOuBzr9OVt5j5P0UHP5shQyCtPvTfc8teo35yp3p2n3JxIrQtIrA5WwDpWxTn///9UwzJOxj1UzCxLvCdUxCSLznno9OZ2yV5CtRPW6tG43a5MwRZpwlHF5r76/fmi1pKt3Z/rUK2VAAAAH3RSTlMAOP6ewmQN9S3sJHRP7Y+sQdWkHYXpE/n+X39zXt3v02dUywAAAW5JREFUKJGNkulywjAMhHM7aRpCuKcFbDmxE+eG93+4SoEyYWA63Z/+RvJqJcv6p9b2J8pev2Ohn2ZRlK38jxe0jFMvkqjIS+NnHISuIyYdhHCSTfjU0k3ukCSTzaw2XCSO4wipUEJwwWc0WBDSZqiqpu05Qp7Ej0JPSq4u0AwNwMiRSukGN7bzMylVCU2t6hagPRD1lrsJ2i7OwAFKZ4KNIshW9gSP2b7QJYAx4wgAg+KMsci7we99UegrVjZNaUwvOfMWse/fYvwqiqLDfr1SmBD6idxlYN0NEaRKsolT4BwzOLW9YCUBovO2xwxL0VCriHJlyBC7G8JR8FM0aojWA2D44neUwMdSDAj9YgwDlDnC9B4CxVeIukJaVSNUKkelwSN4JvO8J4qcE9v6s5UxfOjM5XotO0lsfgyhy/AjqbtOOwi382XTmRxwT1Jrjd9vn8/ECqYDU0rryHPj1/sL/dXpfD69O03r76N+1Q/D/jLM9jHGPAAAAABJRU5ErkJggg=='}}
            style={styles.paymentIcon}
          />
          <Text style={styles.paymentButtonText}>Pay with eSewa</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.paymentButton}
          onPress={handleKhaltiPayment}>
          <Image
            source={{
              uri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABtUlEQVR4AdWXAUQEQRSGAwAsAGADABIAagEQNkAOEiFgCwQ0kES4CnTgCoU4ywk42hJEcZAEZ5GD0CpKYJqXfTzXvvZNo91r+ODW3vt25u0/OxNa61oZH4H16X3P0DYkFRJSgcigKyajAqoGAT0eAm97k8HWzGajBoEEimug01iK6hLIDPpiZX617IbWckcPbh517+C68Lqabem788EXuwsnEoEmCCT5LJT2wPDhSeOAYqPF6fWr475EQIFALBUgA2aDK06vlxGBgMoFMBzkAkzx042etAcCJwGn4kTAM/h5FrRtBG679y7FAQ9yQBxGdIw++fPwBRtTDG5G4v2AH+LOp6RFAoGNwPvrx7dlOFo7E4eQkwAUx7DB5cDfRUvBCHhSAfqkIEIHJKEkhAq/iCxzAIF4FrwRMoHUVgCBN8FiKUJGgA8j+FMc23OHRZuVTRwHnEDM3ACvWekad3cuMRdQksPnBIIqvgPYz3JJJDuSGXxWgEiEXEM60DR40oMJ5oICa9cpN0z9+mQEU4bNaUlqWHQ/mtEGlS+LItPtLFC0a2Y/TLf/14dTepbs5zKxIfh3p+NPTddJR315k6QAAAAASUVORK5CYII=',
            }}
            style={styles.paymentIcon}
          />
          <Text style={styles.paymentButtonText}>Pay with Khalti</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },

  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },

  emptyCartButton: {
    padding: 8,
    backgroundColor: 'lightgray',
    borderRadius: 50,
  },

  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  image: {
    width: 80,
    height: 80,
    resizeMode: 'cover',
    borderRadius: 8,
  },
  itemDetails: {
    flex: 1,
    marginHorizontal: 16,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  quantityButton: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'tomato',
    marginHorizontal: 8,
  },
  quantity: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'tomato',
  },
  removeButton: {
    fontSize: 20,
    fontWeight: 'bold',
    padding: 8,
    color: 'tomato',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'tomato',
  },
  paymentOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  paymentButton: {
    flex: 0.48,
    backgroundColor: 'white',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    elevation: 2, // For slight shadow
  },
  paymentButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 8,
    color: 'black',
  },
  paymentIcon: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
});

export default Cart;
