import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';




const SkeletonLoader = () => {

  const { width: screenWidth } = Dimensions.get('window');

  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <View style={styles.profileImage} />
        <View style={styles.infoContainer}>
          <View style={styles.name} />
          <View style={styles.details} />
          <View style={styles.details} />
          <View style={styles.details} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    padding: 15,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#e0e0e0',  
    marginRight: 12,
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    height: 20,
    backgroundColor: '#e0e0e0',
    marginBottom: 4,
    borderRadius: 4,
  },
  details: {
    height: 15,
    backgroundColor: '#e0e0e0',
    marginBottom: 4,
    borderRadius: 4,
  },
});

export default SkeletonLoader;
