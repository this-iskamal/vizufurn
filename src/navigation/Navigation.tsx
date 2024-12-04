import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {tokenStorage} from '../state/Storage';
import Onboarding from '../screens/Onboarding';
import Login from '../screens/Login';
import Register from '../screens/Register';
import Home from '../screens/Home';
import {BackendUrl} from '../utils/utils';
import {appAxios} from '../utils/apiinceptor';
import {View, StyleSheet} from 'react-native';
import Loader from '../components/Loader';

export type RootStackParamList = {
  Onboarding: undefined;
  Login: undefined;
  Register: undefined;
  Home: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

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
            setInitialRoute('Home');
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
        <Stack.Screen name="Home" component={Home} />
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
