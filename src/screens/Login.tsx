import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  ImageBackground,
  Alert,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigation/Navigation';
import {BackendUrl} from '../utils/utils';
import axios from 'axios';
import {useAuthStore} from '../state/authstore';
import {tokenStorage} from '../state/Storage';

type LoginScreenProps = NativeStackScreenProps<RootStackParamList, 'Login'>;

const {width} = Dimensions.get('window');

const Login: React.FC<LoginScreenProps> = ({navigation}) => {
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleLogin = async () => {
    try {
      console.log('object')
      const API_URL = `${BackendUrl}api/customer/login`;

      const response = await axios.post(API_URL, {
        phone: phoneNumber,
        password,
      });
  

      if (response.status === 200) {
        const {customer, accessToken, refreshToken} = response.data;
        tokenStorage.set('accessToken', accessToken);
        tokenStorage.set('refreshToken', refreshToken);

        const {setUser} = useAuthStore.getState();
        setUser(customer);

        Alert.alert('Success', 'Login Successful');
        navigation.navigate('Home');
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'An error occurred';
      Alert.alert('Error', message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={require('../assets/images/login.jpg')}
        style={styles.backgroundImage}
        resizeMode="cover">
        <View style={styles.content}>
          <Text style={styles.title}>Login</Text>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your phone number"
              keyboardType="phone-pad"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
            />
            {/* Label for Password */}
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your password"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
              <Text style={styles.loginButtonText}>Login</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={styles.registerLink}>Register</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: width * 0.1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    marginTop: -100,
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    color: 'white',
    marginBottom: 30,
    textAlign: 'center',
  },
  inputContainer: {
    width: '100%',
  },
  label: {
    fontSize: 18,
    fontWeight: '700',
    color: 'black',
    marginBottom: 8,
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#1F41BB',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
    fontSize: 16,
    color: 'black',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },
  loginButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#1F41BB',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  registerText: {
    color: '#1F1F1F',
  },
  registerLink: {
    color: '#1F41BB',
    fontWeight: 'bold',
  },
});

export default Login;
