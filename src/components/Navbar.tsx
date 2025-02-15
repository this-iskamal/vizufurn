import {View, Text, StyleSheet, TouchableOpacity, Modal} from 'react-native';
import React, {FC, useState, useEffect} from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {BackendUrl} from '../utils/utils';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/Navigation';

interface Notification {
  _id: string;
  productId: {
    name: string;
    price: number;
    image: string;
  };
  discountPercentage: number;
  message: string;
  createdAt: string;
}

const Navbar: FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showModal, setShowModal] = useState(false);
   const navigation =
      useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await fetch(`${BackendUrl}api/notifications/customer`);
      const data = await response.json();
     

      setNotifications(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setNotifications([]);
    }
  };

  const handleclick = async (id: string) => {
    try {
      const response = await fetch(`${BackendUrl}api/product/${id}`); // Call the Fastify endpoint
      if (!response.ok) {
        throw new Error("Product not found");
      }
      const product = await response.json(); // Parse the product data from the response
      setShowModal(false);
      navigation.navigate('ProductDetail', {product: product})
    } catch (error) {
      console.error("Error fetching product:", error.message);
    }
  };
  

  return (
    <View style={styles.container}>
      <View style={styles.headingContainer}>
        <Text style={styles.heading}>Explore What {'\n'}Your Home Needs</Text>
      </View>
      <TouchableOpacity
        style={styles.notificationContainer}
        onPress={() => setShowModal(true)}>
        <Icon name="notifications" size={36} color="#FF5722" />
        {notifications.length > 0 && (
          <View style={styles.notificationBadge}>
            <Text style={styles.notificationBadgeText}>
              {notifications.length}
            </Text>
          </View>
        )}
      </TouchableOpacity>

      <Modal
        visible={showModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowModal(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Notifications</Text>
              <TouchableOpacity onPress={() => setShowModal(false)}>
                <Icon name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            {notifications.map(notification => (
              <TouchableOpacity key={notification._id} onPress={()=>handleclick(notification.productId._id)} style={styles.notificationItem} >
                <Text style={styles.productName}>{notification.message}</Text>
                <Text style={styles.discountText}>
                  {notification.discountPercentage}% OFF on{' '}
                  {notification.productId.name}
                </Text>
                <Text style={styles.date}>
                  {new Date(notification.createdAt).toLocaleDateString()}
                </Text>
              </TouchableOpacity>
            ))}
            {notifications.length === 0 && (
              <Text style={styles.noNotifications}>No notifications</Text>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headingContainer: {
    flex: 1,
  },
  heading: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#333333',
  },
  notificationContainer: {
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#FF5722',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-start',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomLeftRadius:20,
    borderBottomRightRadius:20,
    padding: 20,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  notificationItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  productName: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
  },
  discountText: {
    fontSize: 14,
    color: '#FF5722',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  date: {
    color: '#666',
    fontSize: 12,
  },
  noNotifications: {
    textAlign: 'center',
    color: '#666',
    marginTop: 20,
  },
});

export default Navbar;
