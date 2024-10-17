import React, { useEffect, useState } from 'react';
import { Alert,View, Text,Image, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { saveToken, getToken, deleteToken } from '../Helpers/tokenStorage';
import { BlurView } from 'expo-blur';
import LoaderSVG from '../images/Loader.gif'
import { Ionicons } from '@expo/vector-icons'; 
import { useNavigation, useRoute } from '@react-navigation/native';
import * as Font from 'expo-font';
import { useFonts } from 'expo-font';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from "axios"; 
import { ENDPOINT_API } from './endpoint';
import { AlertError, AlertSuccess } from "../Components/AlertMessage";
import { useAuth } from '../Helpers/AuthContext';
import rateLimit from 'axios-rate-limit';

const axiosInstance = rateLimit(axios.create(), {
  maxRequests: 3, // maximum number of requests
  perMilliseconds: 1000, // time window in milliseconds
});

const NewPassword = ( ) => {

  const route = useRoute();
  const { email2 } = route.params; 
  const { settriggerIt, triggerIt } = useAuth();
  const [messageError,setmessageError] = useState("");
  const [messageSuccess,setmessageSuccess] = useState("");
  const [showError, setShowError] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [passwordCheck, setpasswordCheck] = useState("");
  const [password, setpassword] = useState("");
   
  
  const [loading, setLoading] = useState(false);
 
  const [fontsLoaded] = useFonts({
    'DMSerifDisplay': require('../fonts/DMSerifDisplay-Regular.ttf'),  
  });

  if (!fontsLoaded) {
    return null;  
  }


  useEffect(()=>{
    if(email2){
      setEmail(email2)
    }
  }, [email2]);
 

  const resetTheShit = async () => {


    const emailRegex = /\S+@\S+\.\S+/;



          if (!emailRegex.test(email)) {
            setmessageError('Veuillez saisir une addresse email valide.');
            setShowError(true);
            setTimeout(() => {
                setShowError(false);
            }, 3000);
            setTimeout(() => {
                setmessageError("");
            }, 4000);
            return;
          }
          else if(password !== passwordCheck){
            setmessageError('Les mots de passe ne sont pas identiques.');
            setShowError(true);
            setTimeout(() => {
                setShowError(false);
            }, 3000);
            setTimeout(() => {
                setmessageError("");
            }, 4000);
            return;
          } 
          else{
            
            setLoading(true);
            try {
 
              const resp = await axios.post(`${ENDPOINT_API}updatePassword2`, {
                email : email,
                nouveau : password
              });

              if(resp.status === 200){
                setEmail('');
                setpassword('');
                setpasswordCheck('');
                setmessageSuccess("Le mot de passe a été réinitialisé avec succès.");
                setShowSuccess(true);
                setTimeout(() => {
                  setShowSuccess(false);
                }, 2000);
                setTimeout(() => {
                  setmessageSuccess("");    
                   navigation.navigate('Login');
                }, 2900);   
                 
               }  
               else{
                setmessageError(`Oups, le mot de passe n'a pas été changé.`);
                setShowError(true);
                setTimeout(() => {
                    setShowError(false);
                }, 3000);
                setTimeout(() => {
                    setmessageError("");
                }, 4000);
               }
            } 
            catch (error) {
                setmessageError(`Oups, une erreur est survenue : ${JSON.stringify(error.message)}`);
                setShowError(true);
                setTimeout(() => {
                    setShowError(false);
                }, 5000);
                setTimeout(() => {
                    setmessageError("");
                }, 5000);
                console.log(error.message);
            } 
            finally {
                setLoading(false);
            }
          }
          
  };



  return (

    <>
     
      <View style={styles.backgroundContainer}>

 

        <Image 
          source={require('./background4.png')}
          style={styles.backgroundImage} 
        />
        <ScrollView contentContainerStyle={styles.container}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <View style={styles.btnRond}>
              
              <BlurView intensity={110} tint="dark" style={styles.backgroundBlur}>
                <Ionicons name="arrow-back" size={24} color="white" />
              </BlurView>
            </View>
          </TouchableOpacity>

          <View style={styles.titleView}>
            <Text style={styles.title}>Nouvel mot de passe</Text>
          </View>
          <View style={styles.descView}>
            <Text style={styles.description}>Saisissez votre nouveau mot de passe et confirmez-le pour mettre à jour votre compte.</Text>
          </View>

          <View style={styles.inputContainer}>
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
                autoCapitalize="none"
                onChangeText={setpassword}
                placeholder="Nouveau mot de passe" 
                placeholderTextColor="#325A0A" 
              />
            </View>


            <View style={styles.inputWrapper}>
              <Ionicons style={styles.iconX} name="lock-closed" size={20} color="#325A0A" />
              <TextInput 
                value={passwordCheck}
                style={styles.input} 
                autoCapitalize="none"
                onChangeText={setpasswordCheck}
                placeholder="Confirmer le mot de passe" 
                placeholderTextColor="#325A0A" 
              />
            </View>
           </View>

     

   
           <View style={styles.hrContainer}>
                {showError && (
                    <Text style={{ textAlign: "center", color: "red", fontSize: 16, fontWeight: '700' }}>
                        {messageError}
                    </Text>
                )}
                {showSuccess && (
                    <Text style={{ textAlign: "center", color: "green", fontSize: 16, fontWeight: '700' }}>
                        {messageSuccess}
                    </Text>
                )}
            </View>

          <View style={styles.flexibleContainer}> 
          <TouchableOpacity onPress={resetTheShit} style={[styles.registerButton, loading && styles.registerButtonDisabled]} disabled={loading || messageSuccess!==""}>
            <Text style={[styles.registerButtonText, loading && styles.registerButtonDisabledText]}>
              {loading ? "Traitement en cours..." : "Modifier le mot de passe"}
            </Text>
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
     </>
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
    marginTop: 167,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  descView: {
    minHeight: 29,
    marginBottom: 70,
    width: '90%',
    marginTop : 20,
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
    textAlign : "center",
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
    borderRadius: 10,
    height: 55,
    paddingLeft: 15,
    paddingRight: 15,
    marginBottom: 20,
    borderColor: '#f6f6f6',
    borderWidth: 1,
    backgroundColor: '#f6f6f6',

  },

  inputWrapper2: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    height: 55,
    paddingLeft: 15,
    paddingRight: 15,
    borderColor: '#f6f6f6',
    borderWidth: 1,
    backgroundColor: '#f6f6f6',

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
    justifyContent : "center",
  },
  hr: {
    flex: 1,
    height: 1,
    backgroundColor: 'lightgray',
  },
  orText: {
    fontSize: 16,
    height :  60,
    paddingTop : 13,
    width : "100%",
    alignItems : "center",
    justifyContent : "center",
    textAlign : "center",
    fontWeight : "700",
    color: '#8A8A8A',
    textDecorationLine : "underline"
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
  containerOZFSD: {
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
    overflow : 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backgroundBlur: {
    width: 49,
    height: 49,
    borderRadius: 40,
    overflow : 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default NewPassword;
