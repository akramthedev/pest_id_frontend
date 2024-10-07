import { saveToken, getToken, deleteToken } from '../Helpers/tokenStorage';
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar, ImageBackground, Image } from 'react-native';
import { BlurView } from 'expo-blur';
import { useFonts } from 'expo-font';
import * as Font from 'expo-font';

import { useAuth } from '../Helpers/AuthContext';


const Home = ({ navigation, route }) => {


  const { settriggerIt, triggerIt } = useAuth();

  const [fontsLoaded] = useFonts({
    'DMSerifDisplay': require('../fonts/DMSerifDisplay-Regular.ttf'),  
  });

  if (!fontsLoaded) {
    return null;  
  }


  
  return (
    <>
      <StatusBar 
        barStyle="light-content"         
        translucent={true}     
      />
      <View style={styles.container}>
        <ImageBackground 
          source={require('../images/image1.png')}          
          style={styles.backgroundImage}
          resizeMode="cover"
        >
          <View style={styles.overlay} />
          
          <View style={styles.logo}>
              <Image
                style={styles.imageLogo}  
                source={require('../images/logo.png')}
              />
          </View>

          <View style={styles.content}>
            <Text style={styles.text1}>La solution parfaite pour vos plantes.</Text>
          </View>

         
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.btnSeConecter} onPress={() => {navigation.navigate('Login')}}>
              <BlurView style={styles.blurView} intensity={40} blurType="light">
                <Text style={{ color: 'white',fontWeight : "700", fontSize: 19  }}>Se connecter</Text>
              </BlurView>
            </TouchableOpacity>
          </View>

          <View style={styles.buttonContainer1}>
            <TouchableOpacity style={styles.btnCreerCompte} onPress={() => {navigation.navigate('Register')}}>
              <Text style={{ color: 'white', fontSize : 16 }}>Créer un compte</Text>
            </TouchableOpacity>
          </View>


        </ImageBackground>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, 
  },
  
  backgroundImage: {
    flex: 1,               
    justifyContent: 'space-between', 
    width: '100%',  
    position : "relative",       
    height: '100%',        
  },
  content: {
    flex: 1,
    justifyContent: 'center', 
    alignItems: 'center',     
  },
  overlay: {
    position: 'absolute',  
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.02)',  
  },
  buttonContainer: {
    position: 'absolute', 
    bottom: 100,  
    left: 0,  
    right: 0,  
    alignItems: 'center',  
  },
  buttonContainer1: {
    position: 'absolute',  
    bottom: 50,  
    left: 0, 
    right: 0,  
    alignItems: 'center',  
    backgroundColor : "transparent"
  },
  logo: {
    borderRadius: 20,
    width: 140, 
    height: 45,
    backgroundColor : "white",
    overflow: "hidden",
    margin: "auto",
    marginTop: 40,
  },
  imageLogo: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain', 
  },
  btnSeConecter : {
    borderWidth: 1, 
    overflow : "hidden",
    width : "90%",
    display : "flex",
    alignItems : "center",
    justifyContent : "center",
    borderRadius: 10,
    height: 55,
    borderColor: 'transparent', 
  },
  blurView: {
    width: "100%", 
    height :55,
    borderRadius : 20, 
    justifyContent: 'center',
    alignItems: 'center',
    
  },
  btnCreerCompte: {
    backgroundColor: "transparent", 
    padding: 10, 
    width : "80%",
    borderWidth: 1, 
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'transparent', 
  },
  btnText: {
    color: 'white',  
  },
  text1: {
    color: '#fff',
    fontFamily: 'DMSerifDisplay',      
    fontSize: 50,
    marginBottom :160,
    height: "auto",
    paddingLeft: 29,
    paddingRight: 50,
    width: "100%",
  },

});

export default Home;
