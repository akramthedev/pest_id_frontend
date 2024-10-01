import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 
import { useNavigation } from '@react-navigation/native';
 import * as Font from 'expo-font';
import { useFonts } from 'expo-font';


const Login = () => {
  const navigation = useNavigation();
 
 
  const [fontsLoaded] = useFonts({
    'DMSerifDisplay': require('../fonts/DMSerifDisplay-Regular.ttf'),  
  });

  if (!fontsLoaded) {
    return null;  
  }



  return (
    <View style={styles.backgroundContainer}>
      <Image 
        source={require('../images/login2.png')}
        style={styles.backgroundImage} 
      />
      <ScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('Home')}>
          <View style={styles.btnRond}>
            <Ionicons name="arrow-back" size={24} color="#3E6715" />
          </View>
        </TouchableOpacity>

        <View style={styles.titleView}>
          <Text style={styles.title}>Welcome Back !</Text>
        </View>
        <View style={styles.descView}>
          <Text style={styles.description}>Connectez vous à votre compte</Text>
        </View>

        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <Ionicons style={styles.iconX} name="mail" size={20} color="#325A0A" />
            <TextInput 
              style={styles.input} 
              placeholder="Adresse email" 
              placeholderTextColor="#325A0A" 
            />
          </View>
          <View style={styles.inputWrapper}>
            <Ionicons style={styles.iconX} name="lock-closed" size={20} color="#325A0A" />
            <TextInput 
              style={styles.input} 
              placeholder="Mot de passe" 
              placeholderTextColor="#325A0A" 
              secureTextEntry 
            />
          </View>
        </View>

        <View style={styles.hrContainer}>
          <View style={styles.hr} />
          <Text style={styles.orText}>ou connectez-vous via</Text>
          <View style={styles.hr} />
        </View>

        <View style={styles.socialButtonsContainer}>
          <TouchableOpacity style={styles.socialButton}>
            <Image
              source={{ uri: "https://upload.wikimedia.org/wikipedia/commons/6/6c/Facebook_Logo_2023.png" }}
              style={styles.socialIcon}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialButton}>
            <Image
              source={{ uri: "https://cdn4.iconfinder.com/data/icons/logos-brands-7/512/google_logo-google_icongoogle-512.png" }}
              style={styles.socialIcon}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialButton}>
            <Image
              source={{ uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRvpQr7jRfGRZXz54j5HdGf6MDP8w5l53a3UQ&s" }}
              style={styles.socialIcon}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.flexibleContainer}> 
          <TouchableOpacity style={styles.registerButton}>
            <Text style={styles.registerButtonText}>Se connecter</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.alreadyRegisteredContainer} onPress={() => navigation.navigate('Register')}>
            <Text style={styles.alreadyRegisteredText}>
              Non inscrit ?{' '}{' '}   
              <Text style={styles.loginText}>
                Créez votre compte
              </Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  backgroundContainer: {
    flex: 1,
   },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
  },
  container: {
    flexGrow: 1,
    padding: 23,
    justifyContent: 'flex-start',
  },
  backButton: {
    marginTop: 20,
    height: 55,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  titleView: {
    width: 'auto',
    marginTop: 120,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  descView: {
    minHeight: 30,
    marginBottom: 70,
    width: '90%',
    marginLeft: 'auto',
    marginRight: 'auto',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  iconX: {
    marginRight: 4,
  },
  title: {
    fontSize: 35,
    color: '#325A0A',
    fontFamily: 'DMSerifDisplay',
  },
  description: {
    fontSize: 15,
    fontWeight: "400",
    color: '#9C9C9C',
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#C4EA9E',
    borderRadius: 10,
    height: 55,
    paddingLeft: 15,
    paddingRight: 15,
    marginBottom: 20,
    backgroundColor: '#D4FFAB',
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: '#325A0A',
  },
  hrContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  hr: {
    flex: 1,
    height: 1,
    backgroundColor: 'lightgray',
  },
  orText: {
    marginHorizontal: 10,
    fontSize: 15,
    color: '#8A8A8A',
  },
  socialButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    width: "70%",
    marginRight: "auto",
    marginLeft: "auto",
  },
  socialButton: {
    flex: 1,
    alignItems: 'center',
  },
  socialIcon: {
    width: 45,
    height: 45,
    resizeMode: 'contain',
  },
  flexibleContainer: {
    marginTop: 'auto', 
    paddingBottom: 20,
  },
  registerButton: {
    backgroundColor: '#487C15',
    height: 55,
    alignItems: "center", 
    justifyContent: "center",
    borderRadius: 10,
    marginBottom: 10,
  },
  registerButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 17,
  },
  alreadyRegisteredContainer: {
    alignItems: 'center',
  },
  alreadyRegisteredText: {
    fontSize: 15,
    color: '#8A8A8A',
  },
  loginText: {
    fontWeight: 'bold',
    fontSize: 15,
    color: '#325A0A',
    textDecorationLine: 'underline',
  },
  btnRond: {
    width: 49,
    height: 49,
    borderRadius: 40,
    backgroundColor: '#D4FFAB',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Login;
