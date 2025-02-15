// File: screens/Onboarding.tsx

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Dimensions,
  ImageBackground,
  Animated,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/Navigation';
import ReusableButton from '../components/ReusableButton'; // Import the ReusableButton component

type OnboardingScreenProps = NativeStackScreenProps<RootStackParamList, 'Onboarding'>;

const { width, height } = Dimensions.get('window');

const Onboarding: React.FC<OnboardingScreenProps> = ({ navigation }) => {
  const [fadeAnim] = useState(new Animated.Value(0)); // For fade-in animation

  useEffect(() => {
    // Fade in effect
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={require('../assets/images/onboarding.jpg')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        {/* Background Overlay for better contrast */}
        <View style={styles.overlay} />

        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          <Text style={styles.slogan}>
            Get your home furnitures{'\n'}with one click
          </Text>
        </Animated.View>

        <View style={styles.buttonContainer}>
          <View style={styles.buttons}>
            <ReusableButton
              title="Login"
              onPress={() => navigation.navigate('Login')}
            />
            <ReusableButton
              title="Register"
              onPress={() => navigation.navigate('Register')}
              variant="secondary"
            />
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
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  slogan: {
    fontSize: 36,
    fontWeight: '800',
    textAlign: 'center',
    lineHeight: 45,
    color: '#FFFFFF',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 10,
    borderRadius: 10,
  },
  buttonContainer: {
    marginBottom: height * 0.1,
    paddingHorizontal: width * 0.05,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default Onboarding;
