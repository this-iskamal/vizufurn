import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  ListRenderItem,
} from 'react-native';
import {useRoute, useNavigation, RouteProp} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useAuthStore} from '../state/authstore';

interface PurchasedItem {
  _id: string;
  name: string;
  price: number;
  quantity: number;
}

interface TransactionQueryParams {
  [key: string]: string; // For dynamic query parameters
}

interface RouteParams {
  transactionDetails: string;
  purchasedItems: PurchasedItem[];
  orderId: string;
}

type RootStackParamList = {
  MainApp: undefined;
  PaymentSuccess: RouteParams;
};

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'PaymentSuccess'
>;

type PaymentSuccessRouteProp = RouteProp<RootStackParamList, 'PaymentSuccess'>;

const PaymentSuccess: React.FC = () => {
  const {user} = useAuthStore();
  const route = useRoute<PaymentSuccessRouteProp>();
  const navigation = useNavigation<NavigationProp>();
  const {transactionDetails, purchasedItems, orderId} = route.params;

  const getQueryParams = (url: string): TransactionQueryParams => {
    const params: {[key: string]: string} = {};
    const queryString = url.split('?')[1];

    if (queryString) {
      const pairs = queryString.split('&');
      pairs.forEach(pair => {
        const [key, value] = pair.split('=');
        params[decodeURIComponent(key)] = decodeURIComponent(value);
      });
    }
    return params;
  };

  const queryParams = getQueryParams(transactionDetails);
  const isEsewa = queryParams.oid !== undefined; // Check if it's eSewa
  const isKhalti = queryParams.pidx !== undefined; // Check if it's Khalti

  const transactionDetailsData = isEsewa
    ? [
        {title: 'Reference ID', value: queryParams.refId || 'N/A'},
        {title: 'Order ID', value: orderId},
        {title: 'Customer Name', value: user?.name ?? 'N/A'},
        {title: 'Customer Address', value: user?.address ?? 'N/A'},
        {title: 'Amount', value: `$${queryParams.amt || '0'}`},
      ]
    : isKhalti
    ? [
        {title: 'Transaction ID', value: queryParams.purchase_order_id || 'N/A'},
        {title: 'Order ID', value: orderId || 'N/A'},
        {title: 'Order Name', value: queryParams.purchase_order_name || 'N/A'},
        {title: 'Mobile', value: user?.phone || 'N/A'},
        {
          title: 'Amount',
          value: `$${(parseInt(queryParams.amount, 10) / 100).toFixed(2)}`,
        }, // Convert from paisa
        {title: 'Status', value: queryParams.status || 'N/A'},
      ]
    : [];

  const grandTotal: number = purchasedItems.reduce(
    (total: number, item: PurchasedItem) => total + item.price * item.quantity,
    0,
  );

  const renderTransactionItem: ListRenderItem<{
    title: string;
    value: string;
  }> = ({item}) => (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{item.title}</Text>
      <Text style={styles.detailValue}>{item.value}</Text>
    </View>
  );

  const renderPurchasedItem: ListRenderItem<PurchasedItem> = ({item}) => (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>
        {item.name} x{item.quantity}
      </Text>
      <Text style={styles.detailValue}>
        ${(item.price * item.quantity).toFixed(2)}
      </Text>
    </View>
  );

  const renderMainContent: ListRenderItem<{key: string}> = ({item}) => {
    if (item.key === 'transactionDetails') {
      return (
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Transaction Details:</Text>
          <FlatList
            data={transactionDetailsData}
            renderItem={renderTransactionItem}
            keyExtractor={item => item.title}
            scrollEnabled={false}
          />
        </View>
      );
    }

    if (item.key === 'purchasedItems') {
      return (
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Purchased Items:</Text>
          <FlatList
            data={purchasedItems}
            renderItem={renderPurchasedItem}
            keyExtractor={item => item._id}
            scrollEnabled={false}
          />
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Grand Total:</Text>
            <Text style={styles.totalValue}>${grandTotal.toFixed(2)}</Text>
          </View>
        </View>
      );
    }

    return null;
  };

  const handleContinueShopping = (): void => {
    navigation.navigate('MainApp');
  };

  return (
    <FlatList
      data={[{key: 'transactionDetails'}, {key: 'purchasedItems'}]}
      keyExtractor={item => item.key}
      contentContainerStyle={styles.container}
      renderItem={renderMainContent}
      ListHeaderComponent={
        <>
          <Image
            source={{
              uri: 'https://cdn-icons-png.flaticon.com/512/190/190411.png',
            }}
            style={styles.successImage}
          />
          <Text style={styles.title}>Payment Successful!</Text>
          <Text style={styles.subtitle}>
            Your transaction has been completed successfully.
          </Text>
        </>
      }
      ListFooterComponent={
        <TouchableOpacity
          style={styles.button}
          onPress={handleContinueShopping}>
          <Text style={styles.buttonText}>Continue Shopping</Text>
        </TouchableOpacity>
      }
    />
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
  successImage: {
    width: 120,
    height: 120,
    marginBottom: 20,
    alignSelf: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#28a745',
    marginBottom: 10,
    alignSelf: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 20,
  },
  sectionContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: {width: 0, height: 2},
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  detailLabel: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  detailValue: {
    fontSize: 16,
    color: '#555',
    fontWeight: '500',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 15,
    marginTop: 5,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#28a745',
  },
  button: {
    backgroundColor: '#28a745',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 5,
    marginTop: 10,
    alignSelf: 'center',
  },
  buttonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default PaymentSuccess;
