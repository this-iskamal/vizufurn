import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  Dimensions,
  ImageBackground,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/Navigation';
import axios from 'axios';
import { BackendUrl } from '../utils/utils';
import ReusableButton from '../components/ReusableButton'; // Import the ReusableButton component

type RegisterScreenProps = NativeStackScreenProps<RootStackParamList, 'Register'>;

const { width } = Dimensions.get('window');

const Register: React.FC<RegisterScreenProps> = ({ navigation }) => {
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    try {
      const API_URL = `${BackendUrl}api/customer/register`;

      const response = await axios.post(API_URL, {
        phone: phoneNumber,
        password: password,
      });

      if (response.status === 200) {
        Alert.alert('Success', response.data.message);
        navigation.navigate('Login');
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'An error occurred';
      Alert.alert('Error', message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        {/* Background Overlay */}
        <View style={styles.overlay} />

        {/* Content without animation */}
        <View style={styles.content}>
          <Text style={styles.title}>Register</Text>

          <View style={styles.inputContainer}>
            {/* Label for Phone Number */}
            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your phone number"
              keyboardType="phone-pad"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              placeholderTextColor="gray"
            />

            {/* Label for Password */}
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your password"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              placeholderTextColor="gray"
            />

            {/* Label for Confirm Password */}
            <Text style={styles.label}>Confirm Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Re-enter your password"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholderTextColor="gray"
            />

            {/* Reusable Register Button */}
            <ReusableButton title="Register" onPress={handleRegister} />
          </View>

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.loginLink}>Login</Text>
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
  overlay: {
    ...StyleSheet.absoluteFillObject,
    
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    marginTop: -50,
    alignItems: 'center',
  },
  title: {
    fontSize: 40,
    fontWeight: '700',
    color: 'black',
    marginBottom: 20,
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
    backgroundColor: 'rgba(255, 255, 255, 0.7)', // Semi-transparent background
  },
  registerButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#1F41BB',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginTop: 20,
  },
  registerButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  loginText: {
    color: 'black',
  },
  loginLink: {
    color: '#1F41BB',
    fontWeight: 'bold',
  },
});

export default Register;
