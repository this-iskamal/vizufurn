import React, {FC, useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {tokenStorage} from '../state/Storage';
import Onboarding from '../screens/Onboarding';
import Login from '../screens/Login';
import Register from '../screens/Register';
import Home from '../screens/Home';
import Search from '../screens/SearchScreen';
import Favorites from '../screens/FavouritesScreen';
import Cart from '../screens/BookmarkScreen';
import Profile from '../screens/ProfileScreen';
import {BackendUrl} from '../utils/utils';
import {appAxios} from '../utils/apiinceptor';
import {View, StyleSheet} from 'react-native';
import Loader from '../components/Loader';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ProductDetail from '../screens/ProductDeatil';
import ARView from '../screens/ARView';
import PaymentScreen from '../screens/PaymentScreen';
import PaymentSuccess from '../screens/PaymentSuccess';
import PaymentFailure from '../screens/PaymentFailure';

interface Product {
  _id: string;
  name: string;
  price: number;
  images: string[];
  description?: string;
  category: string;
}

export type RootStackParamList = {
  
  Onboarding: undefined;
  Login: undefined;
  Register: undefined;
  MainApp: undefined;
  ProductDetail: { product: Product }; 
  ARView: { product: Product };
  Payment: { totalPrice: number; items: Product[] };
  PaymentSuccess:{transactionDetails:string,purchasedItems:any}
  PaymentFailure:{errorDetails:string}

};

export type TabParamList = {
  Home: undefined;
  Search: { query: string };
  Favorites: undefined;
  Cart: undefined;
  Profile: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

const MainTabNavigator:FC = () => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        headerShown: false,
        tabBarIcon: ({focused, color, size}) => {
          let iconName = '';

          switch (route.name) {
            case 'Home':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'Search':
              iconName = focused ? 'search' : 'search-outline';
              break;
            case 'Favorites':
              iconName = focused ? 'heart' : 'heart-outline';
              break;
            case 'Cart':
              iconName = focused ? 'cart' : 'cart-outline';
              break;
            case 'Profile':
              iconName = focused ? 'person' : 'person-outline';
              break;
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
        tabBarLabelStyle: {
          fontSize: 12,
          marginBottom: -2,
        },
        tabBarIconStyle: {
          marginTop: -5,
        },
        tabBarStyle: {
          height: 60,
          paddingBottom: 5,
          paddingTop: 5,
          backgroundColor: '#f0f0f0',
          borderTopWidth: 0,
          elevation: 0,
        },
      })}>
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Search" component={Search} />
      <Tab.Screen name="Favorites" component={Favorites} />
      <Tab.Screen name="Cart" component={Cart} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
};

const Navigation: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [initialRoute, setInitialRoute] =
    useState<keyof RootStackParamList>('Onboarding');

  useEffect(() => {
    const checkAccessToken = async () => {
      try {
        const accessToken = tokenStorage.getString('accessToken');

        if (accessToken) {
          const response = await appAxios.get(
            `${BackendUrl}api/customer/validatetoken`,
          );

          if (response.data) {
            setInitialRoute('MainApp');
          } else {
            setInitialRoute('Onboarding');
          }
        } else {
          setInitialRoute('Onboarding');
        }
      } catch (error) {
        console.log('Token validation error:', error);
        setInitialRoute('Onboarding');
      } finally {
        setIsLoading(false);
      }
    };

    checkAccessToken();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <Loader />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={initialRoute}
        screenOptions={{headerShown: false}}>
        <Stack.Screen name="Onboarding" component={Onboarding} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="MainApp" component={MainTabNavigator} />
        <Stack.Screen name="ProductDetail" component={ProductDetail} /> 
        <Stack.Screen name="ARView" component={ARView} />
        <Stack.Screen name="Payment" component={PaymentScreen} />
        <Stack.Screen name="PaymentSuccess" component={PaymentSuccess} />
        <Stack.Screen name="PaymentFailure" component={PaymentFailure} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
});

export default Navigation;
