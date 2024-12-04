import {View, Text, StyleSheet} from 'react-native';
import React, {FC} from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';

const Navbar: FC = () => {
  return (
    <View style={styles.container}>
      <View style={styles.headingContainer}>
        <Text style={styles.heading}>Explore What {'\n'}Your Home Needs</Text>
      </View>
      <View style={styles.notificationContainer}>
        <Icon name="notifications" size={36} color="#FF5722" />
        <View style={styles.notificationBadge}>
          <Text style={styles.notificationBadgeText}>3</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,

    // shadowColor: '#000',
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
    // shadowOpacity: 0.05,
    // shadowRadius: 4,
    // elevation: 2,
  },
  headingContainer: {
    flex: 1,
  },
  heading: {
    fontSize: 30,

    fontWeight:"bold",
    color: '#333333',
  },
  notificationContainer: {
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#FF5722',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default Navbar;
