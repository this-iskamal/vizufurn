import React from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ImageBackground,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/Navigation';

type OnboardingScreenProps = NativeStackScreenProps<RootStackParamList, 'Onboarding'>;

const { width, height } = Dimensions.get('window');

const Onboarding: React.FC<OnboardingScreenProps> = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={require('../assets/images/onboarding.jpg')} 
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.content}>
          <Text style={styles.slogan}>
            Get your home furnitures{'\n'}with one click
          </Text>
        </View>
        <View style={styles.buttonContainer}>
          <View style={styles.buttons}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate('Login')}
            >
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.registerButton]}
              onPress={() => navigation.navigate('Register')}
            >
              <Text style={[styles.buttonText, styles.registerButtonText]}>
                Register
              </Text>
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
      backgroundColor: '#FFFFFF',
    },
    backgroundImage: {
      flex: 1,
      justifyContent: 'center',
    },
    content: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 20,
    },
    buttonContainer: {
      marginBottom: height * 0.1, 
      paddingHorizontal: width * 0.05,
    },
    slogan: {
      fontSize: 36,
      fontWeight: '800',
      textAlign: 'center',
      lineHeight: 45,
      color: '#1F1F1F',
      backgroundColor: 'rgba(255, 255, 255, 0.8)', 
      padding: 10,
      borderRadius: 10,
    },
    buttons: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    button: {
      width: width * 0.4,
      height: 60,
      backgroundColor: '#1F41BB',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 15,
      elevation: 3,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    registerButton: {
      backgroundColor: '#FFFFFF',
      borderWidth: 2,
      borderColor: '#1F41BB',
    },
    buttonText: {
      color: 'white',
      fontWeight: '900',
      fontSize: 24,
    },
    registerButtonText: {
      color: '#1F41BB',
    },
  });
  

export default Onboarding;
