import React, {useEffect, useState} from 'react';
import {View, StyleSheet, ActivityIndicator, Alert, Text} from 'react-native';
import {WebView, WebViewNavigation} from 'react-native-webview';
import {useRoute, useNavigation, RouteProp} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import axios from 'axios';
import {RootStackParamList} from '../navigation/Navigation';
import {BackendUrl} from '../utils/utils';
import {appAxios} from '../utils/apiinceptor';
import {SECRET_KEY} from '@env';
import {useAuthStore} from '../state/authstore';

interface PurchasedItem {
  _id: string;
  name: string;
  price: number;
  quantity: number;
}

interface PaymentScreenParams {
  totalPrice: number;
  items: PurchasedItem[];
  method: string; // 'eSewa' or 'Khalti'
}

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {
      PaymentScreen: PaymentScreenParams;
      PaymentSuccess: {
        transactionDetails: string;
        purchasedItems: PurchasedItem[];
      };
      PaymentFailure: {
        errorDetails: string;
      };
    }
  }
}

type PaymentScreenRouteProp = RouteProp<RootStackParamList, 'Payment'>;
type PaymentScreenNavigationProp =
  NativeStackNavigationProp<RootStackParamList>;

const PaymentScreen: React.FC = () => {
  const user = useAuthStore(state => state.user);
  const route = useRoute<PaymentScreenRouteProp>();
  const navigation = useNavigation<PaymentScreenNavigationProp>();
  const {totalPrice, items, method} = route.params;

  const [loading, setLoading] = useState(true);
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);

  const esewaURL = 'https://rc-epay.esewa.com.np/';
  const esewaSuccessURL = `${BackendUrl}api/payment-success`;
  const esewaFailureURL = `${BackendUrl}api/payment-failure`;

  const khaltiURL = 'https://dev.khalti.com/api/v2/epayment/initiate/';
  const khaltiSuccessURL = `${BackendUrl}api/khalti-success`;
  const khaltiFailureURL = `${BackendUrl}api/khalti-failure`;

  const esewaPaymentData = {
    amt: totalPrice.toString(),
    psc: '0',
    pdc: '0',
    txAmt: '0',
    tAmt: totalPrice.toString(),
    pid: `TXN_${Date.now()}`,
    scd: 'EPAYTEST',
    su: esewaSuccessURL,
    fu: esewaFailureURL,
  };

  useEffect(() => {
    const fetchPaymentUrl = async () => {
      try {
        if (method === 'Khalti') {
          const payload = {
            return_url: khaltiSuccessURL,
            website_url: BackendUrl,
            amount: totalPrice * 100, // Khalti requires amount in paisa
            purchase_order_id: `TXN_${Date.now()}`,
            purchase_order_name: 'Cart Purchase',
            customer_info: {
              name: user?.name,

              phone: user?.phone,
            },
          };


          const response = await axios.post(khaltiURL, payload, {
            headers: {
              'Authorization': `key ${SECRET_KEY}`,
              'Content-Type': 'application/json',
            },
          });

          if (response.status === 200 && response.data.payment_url) {
            setPaymentUrl(response.data.payment_url);
          } else {
            throw new Error('Failed to initiate Khalti payment');
          }
        } else {
          const queryString = new URLSearchParams(esewaPaymentData).toString();
          setPaymentUrl(`${esewaURL}?${queryString}`);
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to initiate payment');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentUrl();
  }, [method, totalPrice]);

  const handleNavigationStateChange = (navState: WebViewNavigation): void => {
    if (method === 'eSewa' && navState.url.startsWith(esewaSuccessURL)) {
      handleSuccessfulTransaction(navState.url);
    } else if (method === 'eSewa' && navState.url.startsWith(esewaFailureURL)) {
      navigation.navigate('PaymentFailure', {errorDetails: navState.url});
    } else if (
      method === 'Khalti' &&
      navState.url.startsWith(khaltiSuccessURL)
    ) {
      handleSuccessfulTransaction(navState.url);
    } else if (
      method === 'Khalti' &&
      navState.url.startsWith(khaltiFailureURL)
    ) {
      navigation.navigate('PaymentFailure', {errorDetails: navState.url});
    }
  };

  const handleSuccessfulTransaction = async (transactionDetails: string) => {
    setLoading(true);
    try {
      const response = await appAxios.post(`${BackendUrl}api/order`, {
        items,
        totalPrice,
      });

      if (response.status === 201) {
        navigation.navigate('PaymentSuccess', {
          transactionDetails,
          purchasedItems: items,
          orderId: response.data.orderId,
        });
      } else {
        throw new Error('Failed to save order history');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to save order history');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return paymentUrl ? (
    <WebView
      source={{uri: paymentUrl}}
      startInLoadingState={true}
      renderLoading={() => <ActivityIndicator size="large" color="#0000ff" />}
      onNavigationStateChange={handleNavigationStateChange}
    />
  ) : (
    <View style={styles.container}>
      <Text> Alert.alert('Error', 'Failed to load payment page.')</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default PaymentScreen;
