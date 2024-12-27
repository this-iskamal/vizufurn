import React, { useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { WebView, WebViewNavigation } from 'react-native-webview';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import axios from 'axios'; // Add this for making HTTP requests
import { RootStackParamList } from '../navigation/Navigation';
import { BackendUrl } from '../utils/utils';
import { appAxios } from '../utils/apiinceptor';

// Define interfaces for our data structures
interface PurchasedItem {
  _id: string;
  name: string;
  price: number;
  quantity: number;
}

interface PaymentScreenParams {
  totalPrice: number;
  items: PurchasedItem[];
}

interface PaymentData {
  amt: string;
  psc: string;
  pdc: string;
  txAmt: string;
  tAmt: string;
  pid: string;
  scd: string;
  su: string;
  fu: string;
}

// Extend RootStackParamList to include PaymentScreen params
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
type PaymentScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const PaymentScreen: React.FC = () => {
  const route = useRoute<PaymentScreenRouteProp>();
  const navigation = useNavigation<PaymentScreenNavigationProp>();
  const { totalPrice, items } = route.params;
  const [loading, setLoading] = useState(false);

  const esewaURL: string = 'https://uat.esewa.com.np/epay/main';
  const successURL: string = `${BackendUrl}api/payment-success`;
  const failureURL: string = `${BackendUrl}api/payment-failure`;

  const paymentData: PaymentData = {
    amt: totalPrice.toString(),
    psc: '0',
    pdc: '0',
    txAmt: '0',
    tAmt: totalPrice.toString(),
    pid: `TXN_${Date.now()}`,
    scd: 'EPAYTEST',
    su: successURL,
    fu: failureURL,
  };

  const generateQueryParams = (params: PaymentData): string => {
    return Object.keys(params)
      .map((key) => `${key}=${encodeURIComponent(params[key as keyof PaymentData])}`)
      .join('&');
  };

  const paymentURL: string = `${esewaURL}?${generateQueryParams(paymentData)}`;

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
          orderId:response.data.orderId
        });
      } else {
        throw new Error('Failed to save order history');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to save order history');
      console.log(error)
    } finally {
      setLoading(false);
    }
  };

  const handleNavigationStateChange = (navState: WebViewNavigation): void => {
    if (navState.url.startsWith(successURL)) {
      handleSuccessfulTransaction(navState.url);
    } else if (navState.url.startsWith(failureURL)) {
      navigation.navigate('PaymentFailure', {
        errorDetails: navState.url,
      });
    }
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <WebView
          source={{ uri: paymentURL }}
          startInLoadingState={true}
          renderLoading={() => <ActivityIndicator size="large" color="#0000ff" />}
          onNavigationStateChange={handleNavigationStateChange}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default PaymentScreen;
