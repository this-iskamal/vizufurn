import React, { useRef, useEffect } from 'react';
import { View, Text, Animated, StyleSheet, Easing } from 'react-native';

const Loader = () => {
  // Create animated values for different animations
  const personRotation = useRef(new Animated.Value(0)).current;
  const clockRotation = useRef(new Animated.Value(0)).current;
  const personScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Animate person waiting (slight body sway)
    Animated.loop(
      Animated.sequence([
        Animated.timing(personRotation, {
          toValue: 0.2,
          duration: 1000,
          easing: Easing.linear,
          useNativeDriver: true
        }),
        Animated.timing(personRotation, {
          toValue: -0.2,
          duration: 1000,
          easing: Easing.linear,
          useNativeDriver: true
        })
      ])
    ).start();

    // Animate clock hands
    Animated.loop(
      Animated.timing(clockRotation, {
        toValue: 1,
        duration: 4000,
        easing: Easing.linear,
        useNativeDriver: true
      })
    ).start();

    // Animate person scale (subtle breathing effect)
    Animated.loop(
      Animated.sequence([
        Animated.timing(personScale, {
          toValue: 1.05,
          duration: 1500,
          easing: Easing.linear,
          useNativeDriver: true
        }),
        Animated.timing(personScale, {
          toValue: 1,
          duration: 1500,
          easing: Easing.linear,
          useNativeDriver: true
        })
      ])
    ).start();
  }, []);

  // Interpolate rotation and scale values
  const personRotationInterpolate = personRotation.interpolate({
    inputRange: [-1, 1],
    outputRange: ['-10deg', '10deg']
  });

  const clockRotationInterpolate = clockRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[
        styles.personContainer,
        {
          transform: [
            { rotate: personRotationInterpolate },
            { scale: personScale }
          ]
        }
      ]}>
        {/* Person body */}
        <View style={styles.personBody} />
        <View style={styles.personHead} />
      </Animated.View>

      {/* Clock */}
      <View style={styles.clockContainer}>
        <View style={styles.clockFace}>
          <Animated.View 
            style={[
              styles.clockHourHand, 
              { 
                transform: [
                  { rotate: clockRotationInterpolate }
                ] 
              }
            ]} 
          />
          <View style={styles.clockCenter} />
        </View>
      </View>

      <Text style={styles.loadingText}>Loading...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0'
  },
  personContainer: {
    alignItems: 'center',
    marginBottom: 20
  },
  personBody: {
    width: 20,
    height: 50,
    backgroundColor: '#3498db',
    borderRadius: 10
  },
  personHead: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#3498db',
    marginTop: -10
  },
  clockContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2
  },
  clockFace: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: '#2c3e50',
    justifyContent: 'center',
    alignItems: 'center'
  },
  clockHourHand: {
    position: 'absolute',
    width: 2,
    height: 30,
    backgroundColor: '#2c3e50',
    top: '50%',
    marginTop: -30
  },
  clockCenter: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#2c3e50'
  },
  loadingText: {
    marginTop: 20,
    fontSize: 18,
    color: '#7f8c8d'
  }
});

export default Loader;