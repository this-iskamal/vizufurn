import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Alert, TouchableOpacity, TextInput, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';
import { BackendUrl } from '../utils/utils';
import { useAuthStore } from '../state/authstore';

interface OrderItem {
  _id: string;
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  _id: string;
  items: OrderItem[];
  totalPrice: number;
  status: string;
  createdAt: string;
}

interface FilterOptions {
  startDate: Date | null;
  endDate: Date | null;
  minAmount: string;
  maxAmount: string;
}

const OrderHistoryScreen: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');
  const [showFilters, setShowFilters] = useState(false);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    startDate: null,
    endDate: null,
    minAmount: '',
    maxAmount: '',
  });
  const { user } = useAuthStore();

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    applyFiltersAndSort();
  }, [orders, filterOptions, sortOrder, sortBy]);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${BackendUrl}api/order?customerId=${user}`, {
        params: { customerId: user },
      });
      setOrders(response.data);
      setFilteredOrders(response.data);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (type: 'start' | 'end', event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      type === 'start' ? setShowStartDatePicker(false) : setShowEndDatePicker(false);
    }

    if (selectedDate) {
      setFilterOptions(prev => ({
        ...prev,
        [type === 'start' ? 'startDate' : 'endDate']: selectedDate
      }));
    }
  };

  const applyFiltersAndSort = () => {
    let filtered = [...orders];

    if (filterOptions.startDate) {
      filtered = filtered.filter(order => 
        new Date(order.createdAt) >= filterOptions.startDate!
      );
    }
    if (filterOptions.endDate) {
      filtered = filtered.filter(order => 
        new Date(order.createdAt) <= filterOptions.endDate!
      );
    }
    if (filterOptions.minAmount) {
      filtered = filtered.filter(order => 
        order.totalPrice >= parseFloat(filterOptions.minAmount)
      );
    }
    if (filterOptions.maxAmount) {
      filtered = filtered.filter(order => 
        order.totalPrice <= parseFloat(filterOptions.maxAmount)
      );
    }

    filtered.sort((a, b) => {
      if (sortBy === 'date') {
        return sortOrder === 'asc' 
          ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      return sortOrder === 'asc' ? a.totalPrice - b.totalPrice : b.totalPrice - a.totalPrice;
    });

    setFilteredOrders(filtered);
  };

  const renderFilterSection = () => (
    <View style={styles.filterContainer}>
      <TouchableOpacity 
        style={[styles.filterButton, { backgroundColor: 'tomato' }]}
        onPress={() => setShowFilters(!showFilters)}
      >
        <Text style={styles.filterButtonText}>
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </Text>
      </TouchableOpacity>

      {showFilters && (
        <View style={styles.filterOptions}>
          <View style={styles.dateInputContainer}>
            <Text style={styles.filterLabel}>Start Date:</Text>
            <TouchableOpacity 
              style={styles.dateButton}
              onPress={() => setShowStartDatePicker(true)}
            >
              <Text>{filterOptions.startDate ? filterOptions.startDate.toLocaleDateString() : 'Select Start Date'}</Text>
            </TouchableOpacity>
            {showStartDatePicker && (
              <DateTimePicker
                value={filterOptions.startDate || new Date()}
                mode="date"
                display="default"
                onChange={(event, date) => handleDateChange('start', event, date)}
              />
            )}
          </View>

          <View style={styles.dateInputContainer}>
            <Text style={styles.filterLabel}>End Date:</Text>
            <TouchableOpacity 
              style={styles.dateButton}
              onPress={() => setShowEndDatePicker(true)}
            >
              <Text>{filterOptions.endDate ? filterOptions.endDate.toLocaleDateString() : 'Select End Date'}</Text>
            </TouchableOpacity>
            {showEndDatePicker && (
              <DateTimePicker
                value={filterOptions.endDate || new Date()}
                mode="date"
                display="default"
                onChange={(event, date) => handleDateChange('end', event, date)}
              />
            )}
          </View>

          <View style={styles.amountInputContainer}>
            <TextInput
              style={styles.amountInput}
              placeholder="Min Amount"
              keyboardType="numeric"
              value={filterOptions.minAmount}
              onChangeText={(text) => setFilterOptions(prev => ({...prev, minAmount: text}))}
            />
            <TextInput
              style={styles.amountInput}
              placeholder="Max Amount"
              keyboardType="numeric"
              value={filterOptions.maxAmount}
              onChangeText={(text) => setFilterOptions(prev => ({...prev, maxAmount: text}))}
            />
          </View>
        </View>
      )}

      <View style={styles.sortingContainer}>
        <TouchableOpacity 
          style={[styles.sortButton, { backgroundColor: 'tomato' }]} 
          onPress={() => setSortBy(sortBy === 'date' ? 'amount' : 'date')}
        >
          <Text style={styles.sortButtonText}>
            Sort by: {sortBy === 'date' ? 'Date' : 'Amount'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.sortButton, { backgroundColor: 'tomato' }]} 
          onPress={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
        >
          <Text style={styles.sortButtonText}>
            Order: {sortOrder === 'asc' ? '↑' : '↓'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderOrderItem = ({ item }: { item: Order }) => {
    const isExpanded = expandedOrderId === item._id;
    return (
      <TouchableOpacity onPress={() => setExpandedOrderId(isExpanded ? null : item._id)}>
        <View style={styles.orderCard}>
          <View style={styles.orderHeader}>
            <Text style={styles.orderId}>Order ID: {item._id}</Text>
            <Text style={styles.orderDate}>
              {new Date(item.createdAt).toLocaleDateString()}
            </Text>
          </View>

          <View style={styles.orderSummary}>
            <Text style={styles.totalPrice}>Rs. {item.totalPrice.toFixed(2)}</Text>
            <Text style={[styles.orderStatus, styles[`status${item.status}`]]}>
              {item.status}
            </Text>
          </View>

          {isExpanded && (
            <View style={styles.orderDetails}>
              <FlatList
                data={item.items}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                  <View style={styles.itemRow}>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <View style={styles.itemDetails}>
                      <Text style={styles.itemQuantity}>×{item.quantity}</Text>
                      <Text style={styles.itemPrice}>Rs. {item.price.toFixed(2)}</Text>
                    </View>
                  </View>
                )}
              />
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="tomato" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Order History</Text>
      {renderFilterSection()}
      {filteredOrders.length === 0 ? (
        <Text style={styles.noOrdersText}>No orders found.</Text>
      ) : (
        <FlatList
          data={filteredOrders}
          keyExtractor={(item) => item._id}
          renderItem={renderOrderItem}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 16,
    color: '#333',
  },
  filterContainer: {
    padding: 16,
    backgroundColor: '#fff',
    marginBottom: 8,
  },
  filterButton: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  filterButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  filterOptions: {
    marginTop: 16,
  },
  filterLabel: {
    fontSize: 14,
    color: '#555',
    marginBottom: 8,
  },
  dateInputContainer: {
    marginBottom: 16,
  },
  dateButton: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
  },
  amountInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  amountInput: {
    flex: 0.48,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
  },
  sortingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  sortButton: {
    padding: 12,
    borderRadius: 8,
    flex: 0.48,
    alignItems: 'center',
  },
  sortButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  listContent: {
    padding: 16,
  },
  orderCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  orderId: {
    fontSize: 14,
    color: '#666',
  },
  orderSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  orderStatus: {
    fontSize: 14,
    fontWeight: '600',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusPending: {
    backgroundColor: '#fff3cd',
    color: '#856404',
  },
  statusCompleted: {
    backgroundColor: '#d4edda',
    color: '#155724',
  },
  statusCancelled: {
    backgroundColor: '#f8d7da',
    color: '#721c24',
  },
  orderDate: {
    fontSize: 14,
    color: '#666',
  },
  orderDetails: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  itemName: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  itemDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemQuantity: {
    fontSize: 14,
    color: '#666',
    marginRight: 8,
  },
  itemPrice: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noOrdersText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 24,
  },
});

export default OrderHistoryScreen;