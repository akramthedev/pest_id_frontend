import { saveToken, getToken, deleteToken } from '../Helpers/tokenStorage';
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 
import { useNavigation } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../Helpers/AuthContext';
import { ENDPOINT_API } from './endpoint';
import { AlertError, AlertSuccess } from "../Components/AlertMessage";
import rateLimit from 'axios-rate-limit';
import { Svg, Path } from 'react-native-svg';


const axiosInstance = rateLimit(axios.create(), {
  maxRequests: 3, // maximum number of requests
  perMilliseconds: 1000, // time window in milliseconds
});



const Register = ({route}) => {

   const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, seterror] = useState('');
  const [showerror, setshowerror] = useState(false);
  const { settriggerIt, triggerIt } = useAuth();
  const [showError, setShowError] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isNoticeSeen, setIsNoticeSeen] = useState(false);



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
        
        const response = await axiosInstance.post(`${ENDPOINT_API}register`, data);
      
        if (response.status === 201) {

          
          setEmail(''); 
          setPassword(''); 
          setFullName(''); 
          setIsNoticeSeen(true);
            
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




{
        isNoticeSeen && 
        <View style={{
          position: 'absolute', 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0, 
          zIndex : 10000,
          backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fond sombre transparent
          justifyContent: 'center', 
          alignItems: 'center'
        }}>
          
          <View style={{
            backgroundColor: 'white', // Pop-up en blanc
            padding: 20, 
            borderRadius: 10, 
            width: '90%', 
            shadowColor: '#000', 
            shadowOpacity: 0.2, 
            shadowRadius: 10,
            elevation: 5 // Ombre pour Android
          }}>
            <TouchableOpacity style={{
                backgroundColor: 'black', 
                height : 35,
                width : 35,
                alignItems : "center", 
                justifyContent : "center",  
                position : "absolute",
                top : 14,
                right : 14,              
                borderRadius: 100, 
                zIndex : 9999,
              }}
                disabled={false}
                onPress={()=>{
                  setIsNoticeSeen(false);
                }}
              >
                 <Ionicons name="close" size={24} color="white" />

              </TouchableOpacity>
              
            <Text style={{ 
              fontSize: 23, 
              fontWeight: '600', 
              marginBottom: 25 , 
              alignItems  :"flex-end", 
            }}>

              <Svg xmlns="http://www.w3.org/2000/svg" width="23" height="23" fill="none" viewBox="0 0 57 57">
                <Path   
                  fill="#FFC017" 
                  d="m39.637 40.831-5.771 15.871a1.99 1.99 0 0 1-3.732 0l-5.771-15.87a2.02 2.02 0 0 0-1.194-1.195L7.298 33.866a1.99 1.99 0 0 1 0-3.732l15.87-5.771a2.02 2.02 0 0 0 1.195-1.194l5.771-15.871a1.99 1.99 0 0 1 3.732 0l5.771 15.87a2.02 2.02 0 0 0 1.194 1.195l15.871 5.771a1.99 1.99 0 0 1 0 3.732l-15.87 5.771a2.02 2.02 0 0 0-1.195 1.194"
                />
              </Svg>
              &nbsp;&nbsp;
              Inscription réussie
            </Text>
            <Text style={{ 
              fontSize: 18, 
              fontWeight: '400', 
              marginBottom: 21 
            }}>

            Nous allons examiner votre profil et vous recevrez un email dans un délai de 24 heures pour la prochaine étape.
            </Text>


            <Text style={{ 
              fontSize: 18, 
              fontWeight: '500', 
              marginBottom: 21,
            }}>
              Restez à l’écoute !
            </Text>
             

            <View style={{ 
              flexDirection: 'row', 
              justifyContent: 'space-between' 
            }}>
            
            </View>
          </View>
        </View>
      }



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

        <View style={styles.hrContainer}>
          <Text style={styles.orText}> En vous connectant, vous acceptez nos conditions générales d'utilisation et notre politique de confidentialité.</Text>
        </View>



        {
          showerror ? 
          <Text style={{ textAlign : "center" , color : "red", fontWeight : "bold", fontSize : 17 }} >
            {error}
          </Text>
          : null
        }
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
    marginTop: 70,
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
     
    borderRadius: 10,
    height: 55,
    paddingLeft: 15,
    paddingRight: 15,
    marginBottom: 20,
    backgroundColor: '#f6f6f6',
    borderWidth: 1,
    borderColor: '#f6f6f6',
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
    textAlign : "center"

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
    backgroundColor: '#f6f6f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
});


export default Register;
