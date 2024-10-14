import { saveToken, getToken, deleteToken } from '../Helpers/tokenStorage';
import React from 'react';
import { View,Image ,Text, StyleSheet } from 'react-native';
import LoaderSVG from '../images/Loader.gif'


const LoadingScreen = () => {
  return (
   <View style={styles.container}>
     <Image
        source={LoaderSVG}  
        style={styles.image} 
      />
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
  image: {
    width: 39,
    height: 39,  
  },
});

export default LoadingScreen;
