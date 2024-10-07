import { saveToken, getToken, deleteToken } from '../Helpers/tokenStorage';
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 
import { useNavigation } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../Helpers/AuthContext';
 


const Register = ({route}) => {

   const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, seterror] = useState('');
  const [showerror, setshowerror] = useState(false);
  const { settriggerIt, triggerIt } = useAuth();



  const [fontsLoaded] = useFonts({
    'DMSerifDisplay': require('../fonts/DMSerifDisplay-Regular.ttf'),  
  });

  if (!fontsLoaded) {
    return null;  
  }

  


  const register = async () => {
    if (password.length < 1 || email.length < 5 || fullName.length < 2) {
      Alert.alert('Erreur', 'Veuillez saisir des valeurs correctes');
      return;  
    } else {
      setLoading(true);
      const data = {
        fullName: fullName, 
        email: email, 
        password: password
      };
      const data1 = {
        email: email, 
        password: password
      };
  
      try {
        setLoading(true);
        setshowerror(false);
        seterror('');
        
        const response = await axios.post('http://10.0.2.2:8000/api/register', data);
      
        if (response.status === 201) {
          const response2 = await axios.post('http://10.0.2.2:8000/api/login', data1);
          if (response2.status === 200) {
            const token = response2.data.token;
            
            console.log("User Object: ", response2.data.user); 

            setEmail(''); 
            setPassword(''); 
            setFullName(''); 
            saveToken(token);
            settriggerIt((prev) => !prev);
            setTimeout(()=>{
              navigation.navigate('Dashboard');
            }, 400);
            
           } else {
            Alert.alert("Échec de l'authentification");
            seterror(response2.data.message);
            setshowerror(true);
          }
        } else {
           const errors = response.data.errors;
          const errorMessage = Object.values(errors).flat().join(', ');  
          Alert.alert("Échec de l'inscription", errorMessage);
          seterror(errorMessage);
          setshowerror(true);
        }
  
        console.log(response.data);
  
      } catch (error) {
        setshowerror(true);
        
         const errors = error.response?.data?.errors || error.response?.data || 'Une erreur inconnue est survenue';
        
         const errorMessage = typeof errors === 'object' && !Array.isArray(errors)
          ? Object.values(errors).flat().join(', ')   
          : typeof errors === 'string'
            ? errors
            : 'Erreur inconnue';  
        
        seterror(errorMessage);
        console.log(errorMessage);
      } finally {
        setLoading(false);
      }
    }
  };
  




  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <View style={styles.btnRond}>
          <Ionicons name="arrow-back" size={24} color="#3E6715" />
        </View>
      </TouchableOpacity>

      <View style={styles.titleView}>
        <Text style={styles.title}>Créer un compte</Text>
      </View>
      <View style={styles.descView}>
        <Text style={styles.description}>et profitez d'un accès exclusif à des fonctionnalités personnalisées</Text>
      </View>

      <View style={styles.inputContainer}>
        <View style={styles.inputWrapper}>
          <Ionicons style={styles.iconX} name="person" size={20} color="#325A0A" />
          <TextInput 
            value={fullName}
            onChangeText={setFullName}  
            style={styles.input} 
            placeholder="Nom et Prénom" 
            placeholderTextColor="#325A0A" 
          />
        </View>
        <View style={styles.inputWrapper}>
          <Ionicons style={styles.iconX} name="mail" size={20} color="#325A0A" />
          <TextInput 
            value={email}
            style={styles.input} 
            autoCapitalize="none"
            onChangeText={setEmail}
            keyboardType="email-address"
            placeholder="Adresse email" 
            placeholderTextColor="#325A0A" 
          />
        </View>
        <View style={styles.inputWrapper}>
          <Ionicons style={styles.iconX} name="lock-closed" size={20} color="#325A0A" />
          <TextInput 
            value={password}
            style={styles.input} 
            onChangeText={setPassword}
            autoCapitalize="none"
            placeholder="Mot de passe" 
            placeholderTextColor="#325A0A" 
            secureTextEntry 
          />
        </View>
        {
          showerror ? 
          <Text style={{ textAlign : "center" , color : "red", fontWeight : "bold", fontSize : 17 }} >
            {error}
          </Text>
          : null
        }
      </View>

      <View style={styles.hrContainer}>
        <View style={styles.hr} />
        <Text style={styles.orText}>ou inscrivez-vous via</Text>
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
        <TouchableOpacity onPress={register} style={[styles.registerButton, loading && styles.registerButtonDisabled]} disabled={loading}>
          <Text style={[styles.registerButtonText, loading && styles.registerButtonDisabledText]}>
            {loading ? "Authentification en cours..." : "S'inscrire"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.alreadyRegisteredContainer} onPress={() =>{ setEmail('');setFullName('');setPassword('');seterror('');setshowerror(false);navigation.navigate('Login')}}>
          <Text style={styles.alreadyRegisteredText}>
            Déjà inscrit ?{' '}
            <Text style={styles.loginText}>
              Connectez-vous
            </Text>
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};



const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 23,
    backgroundColor: '#fff',
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
    marginTop: 60,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  descView: {
    minHeight: 50,
    marginBottom: 60,
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
    
    fontWeight : "400",
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
    height : 55,
    paddingLeft: 15,
    paddingRight: 15,
    marginBottom: 20,
    backgroundColor: '#DDFFBD',
  },
  input: {
    height: 55,
    width : '100%',
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
    width : "70%",
    marginRight : "auto",
    marginLeft : "auto"
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
    height : 55,
    alignItems : "center", 
    justifyContent : "center",
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  registerButtonDisabled : {
    backgroundColor: '#DAFFB5',
    height : 55,
    alignItems : "center", 
    justifyContent : "center",
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },registerButtonDisabledText : {
    color : "black", 
    fontWeight : "500", 
    fontSize : 17 ,
  },
  registerButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize : 17,
    

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
    textDecorationLine: 'underline'
  },
  btnRond: {
    width: 49,
    height: 49,
    borderRadius: 40,
    backgroundColor: '#DDFFBD',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Register;
