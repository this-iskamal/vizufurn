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
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/Navigation';

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

  
  const handlePayment = () => {
    navigation.navigate('Payment', { totalPrice, items });
  }

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
      <TouchableOpacity style={styles.paymentButton} onPress={handlePayment}>
        <Text style={styles.paymentButtonText}>Proceed to Payment</Text>
      </TouchableOpacity>
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
  paymentButton: {
    backgroundColor: 'tomato',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  paymentButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
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
});

export default Cart;
