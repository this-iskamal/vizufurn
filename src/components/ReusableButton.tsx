// File: components/ReusableButton.tsx

import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';

type ButtonProps = {
  title: string;
  onPress: () => void;
  style?: ViewStyle; // Custom styles for the button
  textStyle?: TextStyle; // Custom styles for the text
  variant?: 'primary' | 'secondary'; // To handle button variations (primary: blue, secondary: white)
};

const ReusableButton: React.FC<ButtonProps> = ({ title, onPress, style, textStyle, variant = 'primary' }) => {
  const buttonStyles = [styles.button, variant === 'secondary' && styles.secondary, style];
  const buttonTextStyles = [styles.buttonText, variant === 'secondary' && styles.secondaryText, textStyle];

  return (
    <TouchableOpacity style={buttonStyles} onPress={onPress}>
      <Text style={buttonTextStyles}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: '40%',
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
  secondary: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#1F41BB',
  },
  buttonText: {
    color: 'white',
    fontWeight: '900',
    fontSize: 24,
  },
  secondaryText: {
    color: '#1F41BB',
  },
});

export default ReusableButton;
