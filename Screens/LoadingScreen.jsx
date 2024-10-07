import { saveToken, getToken, deleteToken } from '../Helpers/tokenStorage';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const LoadingScreen = () => {
 

  return (
    <View style={styles.container}>
      <Text style={styles.loadingText}>Loading...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',  
    alignItems: 'center',      
    backgroundColor: '#fff',   
  },
  loadingText: {
    fontSize: 15,             
    fontWeight: '500',         
    color: '#000',            
  },
});

export default LoadingScreen;
