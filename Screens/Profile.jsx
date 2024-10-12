import * as ImagePicker from 'expo-image-picker';
import { saveToken, getToken, deleteToken } from '../Helpers/tokenStorage';
import React, { useState, useEffect, useRef } from 'react';
import { useCallback } from 'react';
import { Picker } from '@react-native-picker/picker'; 
import { useFocusEffect } from '@react-navigation/native';
import { Image,TextInput, ScrollView,Alert, StyleSheet, TouchableOpacity, Text, View, PanResponder, Animated, Dimensions, SafeAreaView, FlatList } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import ProfileSkeleton from '../Components/ProfileSkeleton';
import { useAuth } from '../Helpers/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { formatLocation } from '../Helpers/locationTransf';
import { formatDate } from '../Components/fct';
import { ENDPOINT_API } from './endpoint';
import { AlertError, AlertSuccess } from "../Components/AlertMessage";
import CardAdmin from '../Components/CardAdmin2';
const { width: screenWidth, height : screenHeight  } = Dimensions.get('window');
import LoaderSVG from '../images/Loader.gif'

const Profile = () => {
  const [isSupprimerClicked,setIsSupprimerClicked] = useState(false);
  const [loaderDelete, setloaderDelete] = useState(false);
  const hasFetched = useRef(false);
  const [showError, setShowError] = useState(false);
  const [messageError,setmessageError] = useState("");
  const [messageSuccess,setmessageSuccess] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [TriggerTheFucker, setTriggerTheFucker] = useState(false);
  const [loader1, setLoader1]=useState(false)
  const [loader2, setLoader2]=useState(false)
  const [image, setImage] = useState(null);  
  const [URi, setURi] = useState(null);  
  const [imageName, setImageName] = useState('');
  const route = useRoute();
  const { id } = route.params; 
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [isModify, setisModify] = useState(false);
  const [isCurrent, setisCurrent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dataProfile, setdataProfile] = useState(null);
  const [dataOfVisitor, setdataOfVisitor] = useState(null);
  const [dataProfileOfChangement, setdataProfileOfChangement] = useState(null);
  const slideAnim = useRef(new Animated.Value(screenWidth)).current;
  const navigation = useNavigation();
  const { settriggerIt, triggerIt } = useAuth();
  const [role, setRole] = useState(null);
  const [canHeAccess, setCanHeAccess] = useState(null);
  const [changePasswordClicked, setchangePasswordClicked] = useState(null);
  const [PayemenetClicked, setPayemenetClicked] = useState(null);
  const [ancienMotDepasse, setancienMotDepasse] = useState("");
  const [nouveauMotDePasse, setnouveauMotDePasse] = useState("");
  const [confirmNvmotedepasse, setconfirmNvmotedepasse] = useState("");
  const [loadingPassword, setloadingPassword] = useState(false);
  //const [voirPersonelClicked, setvoirPersonelClicked] = useState(null);


  useFocusEffect(
    useCallback(() => {

    const x = async ()=>{
      const rolex = JSON.parse(await AsyncStorage.getItem('type'));
      if(rolex !== null && rolex !== undefined ){
        setRole(rolex);
        const userId = await AsyncStorage.getItem('userId');
        const userIdNum = parseInt(userId);
        if(id!== null && id !== undefined){
          if(id === 666 || id === "666" || userIdNum === id){
            setisCurrent(true);
          }
          else{
            setisCurrent(false);
          }
        }
      }
      else{
        console.log('Rolex Undefined... WTF');
      }
     }
    x(); 
  
  }, [navigation, id])
);


 
  useFocusEffect(
    useCallback(() => {
    const fetchProfileData = async ()=>{
      setLoading(true);
      if(id!== null && id !== undefined){
         try{
          const token = await getToken(); 
          const userId = await AsyncStorage.getItem('userId');          
          const userIdNum = parseInt(userId);

          if(id === 666 || id === "666" || userIdNum === id){
            //fetch my infos
            const response = await axios.get(`${ENDPOINT_API}user/${userIdNum}`, {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });

            if(response.status === 200){
              setdataProfile(response.data);
              
              setdataProfileOfChangement(response.data);
               

              if(response.data.image === null || response.data.image === ""){
                setImage("https://cdn-icons-png.flaticon.com/256/149/149071.png");
              }
              else{
                setImage(response.data.image);
              }
               
            }
            else{
              setmessageError("Oups, Une erreur est survenue!");
              setShowError(true);
              setTimeout(() => {
                setShowError(false);
              }, 3000);
              setTimeout(() => {
                setmessageError("");
              }, 4000);
            }
          }
          else{
            //fetch other infos
            setdataProfile(null);
            setdataProfileOfChangement(null)
            const response = await axios.get(`${ENDPOINT_API}user/${id}`, {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });

            if(response.status === 200){

              const responseVisitor = await axios.get(`${ENDPOINT_API}user/${userIdNum}`, {
                headers: {
                  'Authorization': `Bearer ${token}`
                }
              });

              if(responseVisitor.status === 200){
                setdataOfVisitor(responseVisitor.data);
              }
              if(response.data.canAccess ===  0 || response.data.canAccess === "0"){
                setCanHeAccess(false);
              }
              else{
                setCanHeAccess(true);
              }
              setdataProfile(response.data);
              setdataProfileOfChangement(response.data);
              if(response.data.image === null || response.data.image === ""){
                setImage("https://cdn-icons-png.flaticon.com/256/149/149071.png");
              }
              else{
                setImage(response.data.image)
              }
            }
            else{
              setmessageError("Oups, Une erreur est survenue!");
              setShowError(true);
              setTimeout(() => {
                setShowError(false);
              }, 3000);
              setTimeout(() => {
                setmessageError("");
              }, 4000);
            }
          }
        } 
        catch(e){
          console.log(e.message);
          if(e.message === "Request failed with status code 404"){
            setmessageError("Oups, utilisateur introuvable!");
              setShowError(true);
              setTimeout(() => {
                setShowError(false);
              }, 3000);
              setTimeout(() => {
                setmessageError("");
              }, 4000);           
          }
          else{
            setmessageError("Oups, problème interne du serveur!");
              setShowError(true);
              setTimeout(() => {
                setShowError(false);
              }, 3000);
              setTimeout(() => {
                setmessageError("");
              }, 4000);
          }
        } finally{
          setLoading(false);
        }
      } 
    }
    fetchProfileData();
    return () => setLoading(false);  
  
  }, [id, TriggerTheFucker])
);


  const toggleMenu = () => {
    if (isMenuVisible) {
      Animated.timing(slideAnim, {
        toValue: screenWidth,
        duration: 300,
        useNativeDriver: false,
      }).start(() => {
        setIsMenuVisible(false);
      });
    } else {
      setIsMenuVisible(true);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  };

   const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (evt, gestureState) => {
        if (gestureState.dx > 0) {
          Animated.timing(slideAnim, {
            toValue: screenWidth,
            duration: 300,
            useNativeDriver: false,
          }).start(() => {
            setIsMenuVisible(false);
          });
        }
      },
    })
  ).current;

  const getFileNameFromUri = (uri) => {
    return uri.split('/').pop();  
  };



  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
  
    if (!result.canceled) {
      const imageUri = result.assets[0].uri;
      setImage(imageUri);
  
      setURi(imageUri);
      setImageName(getFileNameFromUri(imageUri)); 
       
    }
  };



  const handleSaveData = async()=>{

    if( dataProfileOfChangement.fullName.length <= 1 || dataProfileOfChangement.email.length < 6){
              setmessageError("Vos informations ne sont pas conformes aux exigences.");
              setShowError(true);
              setTimeout(() => {
                setShowError(false);
              }, 3000);
              setTimeout(() => {
                setmessageError("");
              }, 4000);
    }
    else{
      setLoader1(true);
          const userId = await AsyncStorage.getItem('userId');
          const token = await getToken(); 
          let userIdNum;
          if(id  === 666 || id === "666"){
            userIdNum =  parseInt(userId);
          }
          else{
            userIdNum = id;
          }
           
      try{
        let data = {
          fullName : dataProfileOfChangement.fullName, 
          email : dataProfileOfChangement.email, 
          mobile : dataProfileOfChangement.mobile, 
          image : image ? image : "https://cdn-icons-png.flaticon.com/256/149/149071.png", 
          type : dataProfileOfChangement.type
        }
        const resp = await axios.post(`${ENDPOINT_API}updateUserInfos/${userIdNum}`, data, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if(resp.status === 200){
          setdataProfile({ ...dataProfile, email: data.email, fullName : data.fullName, mobile : data.mobile, image : data.image, type : data.type })
          setdataProfileOfChangement({ ...dataProfileOfChangement, email: data.email, fullName : data.fullName, mobile : data.mobile, image : data.image, type : data.type })
          setisModify(false);
          setmessageSuccess("Succès : Vos informations ont été mis à jour.");
          setShowSuccess(true);
          setTimeout(() => {
            setShowSuccess(false);
          }, 3000);
          setTimeout(() => {
            setmessageSuccess("");
          }, 4000);
        }
        else{
          setmessageError("Oups, un incident est survenu lors de l'enregistrement.");
          setShowError(true);
          setTimeout(() => {
            setShowError(false);
          }, 3000);
          setTimeout(() => {
            setmessageError("");
          }, 4000);
        }
      }
      catch(e){
        console.log(e.message);
        console.log(e);
        setmessageError("Oups, problème interne du serveur!");
              setShowError(true);
              setTimeout(() => {
                setShowError(false);
              }, 3000);
              setTimeout(() => {
                setmessageError("");
              }, 4000);
      } finally{
        setLoader1(false);
      }
    }
  }


  const restreindreCompte = async()=>{
    if(id!== null && id !== undefined && dataProfile!== null){
      try{
        setLoader2(true);
        const token = await getToken(); 

          let access;

          if(dataProfile.canAccess === 1){
            access = "canAccess"; 
          }
          else{
            access = "canNotAccess";
          }

          const resp = await axios.get(`${ENDPOINT_API}updateUserRestriction/${id}/${access}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          if(resp.status === 200){

            if(dataProfile.canAccess === 1){
              setdataProfile({ ...dataProfile, canAccess: 0 });
            }
            else{
              setdataProfile({ ...dataProfile, canAccess: 1 })
            }
            setTriggerTheFucker(!TriggerTheFucker);
           
            setmessageSuccess("Succès : le status du client a été mis à jour.");
            setShowSuccess(true);
            setTimeout(() => {
              setShowSuccess(false);
            }, 3000);
            setTimeout(() => {
              setmessageSuccess("");
            }, 4000);

          }
          else{
            setmessageError("Oups, Une erreur est survenue!");
              setShowError(true);
              setTimeout(() => {
                setShowError(false);
              }, 3000);
              setTimeout(() => {
                setmessageError("");
              }, 4000);
          }

      }
      catch(e){
        setmessageError("Oups, problème interne du serveur!");
        setShowError(true);
              setTimeout(() => {
                setShowError(false);
              }, 3000);
              setTimeout(() => {
                setmessageError("");
              }, 4000);
        console.log(e.message);
      } finally{
        setLoader2(false);
      }
    }
  }

  
 
  const handleClick = (number)=>{
    if(isModify){
      if(dataProfile){
        //annuler la modification du profil si elle est debuté 
        if(dataProfile.image === null || dataProfile.image === ""){
          setImage("https://cdn-icons-png.flaticon.com/256/149/149071.png");
        }
        else{
          setImage(dataProfile.image);
        }
        setURi(null);setImageName('');setdataProfileOfChangement(dataProfile);setisModify(!isModify);
      }
    }
    if (number === 2){
      //change password
      setchangePasswordClicked(true);
    }
    else if (number === 3){
      //reglages payement
      setPayemenetClicked(true);
    }
  }



  const handleConfirmPassword = async()=>{
    if(ancienMotDepasse.length<5 || nouveauMotDePasse.length <5 || confirmNvmotedepasse.length < 5){
      setmessageError("Votre mot de passe doit comporter au moins 5 caractères.");
      setShowError(true);
              setTimeout(() => {
                setShowError(false);
              }, 3000);
              setTimeout(() => {
                setmessageError("");
              }, 4000);
    }
    else if((nouveauMotDePasse !== confirmNvmotedepasse) && (nouveauMotDePasse.length !== confirmNvmotedepasse.length)){
      setmessageError("le mot de passe et la confirmation ne sont pas identiques.");
              setShowError(true);
              setTimeout(() => {
                setShowError(false);
              }, 3000);
              setTimeout(() => {
                setmessageError("");
              }, 4000);
    }
    else{
      try{
        setloadingPassword(true);
        const userId = await AsyncStorage.getItem('userId');
        const token = await getToken(); 
        const userIdNum = parseInt(userId);
        let dataPss = {
          ancien : ancienMotDepasse, 
          nouveau : nouveauMotDePasse, 
          confirmnouveau : confirmNvmotedepasse
        }
        let userIdX;
        if(id === 666 || id === "666"){
          userIdX = userIdNum;
        }
        else{
          userIdX = id;
        }
        const resp = await axios.post(`${ENDPOINT_API}updatePassword/${userIdX}`,dataPss, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if(resp.status === 200){
          setancienMotDepasse('');
          setnouveauMotDePasse("");
          setconfirmNvmotedepasse('');
          setchangePasswordClicked(false);
          setmessageSuccess("Succès : Votre mot de passe a été mis à jour.");
          setShowSuccess(true);
          setTimeout(() => {
            setShowSuccess(false);
          }, 3000);
          setTimeout(() => {
            setmessageSuccess("");
          }, 4000);
        }
        else if (resp.status === 287){
          setmessageError("l'ancien mot de passe est invalide.");
              setShowError(true);
              setTimeout(() => {
                setShowError(false);
              }, 3000);
              setTimeout(() => {
                setmessageError("");
              }, 4000);
        }
        else if (resp.status === 301){
          setmessageError("un problème technique est survenu. Veuillez réessayer plus tard.");
              setShowError(true);
              setTimeout(() => {
                setShowError(false);
              }, 3000);
              setTimeout(() => {
                setmessageError("");
              }, 4000);
              console.log(e.message)

        }
        else if(resp.status === 399){
          setmessageError("Votre mot de passe doit comporter au moins 5 caractères.");
              setShowError(true);
              setTimeout(() => {
                setShowError(false);
              }, 3000);
              setTimeout(() => {
                setmessageError("");
              }, 4000);
        }
      }
      catch(e){
        console.log(e.message);
        setmessageError("une erreur interne du serveur s'est produite.");
        setShowError(true);
        setTimeout(() => {
          setShowError(false);
        }, 3000);
        setTimeout(() => {
          setmessageError("");
        }, 4000);
      } finally{
        setloadingPassword(false);
      }
    }
  }

  /*
  
  const [allPersonnels, setallPersonnels] = useState(null);
  const [loadingPersonnel, setloadingPersonnel] = useState(null);

  


  

  const fetchPersonnels = async () => {
    if (loadingPersonnel) return; // Prevent duplicate requests
    if (dataProfile !== null) {
      if (dataProfile.type === "admin" || dataProfile.type === 'superadmin') {
        try {
          setloadingPersonnel(true);
          const token = await getToken();
          let adminId;
          let userId;

          if (id === 666 || id === "666") {
            const u = await AsyncStorage.getItem('userId');
            userId = parseInt(u);
          } else {
            userId = id;
          }

          const resp1 = await axios.get(`${ENDPOINT_API}getAdminIdFromUserId/${userId}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          if (resp1.status === 200) {
            adminId = resp1.data.id;

            const resp2 = await axios.get(`${ENDPOINT_API}staffs/${adminId}`, {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });
            if (resp2.status === 200) {
              setallPersonnels(resp2.data);
            }
          }
        } catch (e) {
          console.log(e);
          setmessageError("un problème technique est survenu. Veuillez réessayer plus tard.");
          setShowError(true);
          setTimeout(() => {
            setShowError(false);
          }, 3000);
          setTimeout(() => {
            setmessageError("");
          }, 4000);
          Alert.alert(e.message);
        } finally {
          setloadingPersonnel(false);
        }
      }
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (dataProfile !== null && dataProfile.type !== "staff" && !hasFetched.current) {
        fetchPersonnels();
        hasFetched.current = true;  
      }
    }, [dataProfile, id])  
  );

  useEffect(() => {
    hasFetched.current = false;  
  }, [id]);
  
  */



  const handleLickDelete = async ()=>{

    let staffsUsers = [];

    if(id !== null && id !== undefined){
      if(dataProfile.type === "admin"){
        try{
          setloaderDelete(true);
          const token = await getToken();

          const resp0 = await axios.get(`${ENDPOINT_API}getAdminIdFromUserId/${parseInt(id)}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if(resp0.status === 200){
            const idAdmin = resp0.data.id;
            console.log("-------------");
            console.log(idAdmin);
            console.log('-------------');
            const resp00 = await axios.get(`${ENDPOINT_API}staffs/${idAdmin}`, {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            }); 

            if(resp00.status === 200){
              staffsUsers = resp00.data;
              console.log("-------------");
              console.log(resp00.data);
              console.log("-------------");
            }
          }

          const resp = await axios.delete(`${ENDPOINT_API}deleteUserWhoIsAdmin/${parseInt(id)}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          if(resp.status === 200){

            if (staffsUsers.length !== 0) {
              for (const staff of staffsUsers) {
                try {
                  await axios.delete(`${ENDPOINT_API}deleteUserStaffNotAdmin/${staff.user_id}`, {
                    headers: {
                      'Authorization': `Bearer ${token}`
                    }
                  });
                } catch (error) {
                  console.error('Error deleting user:', error);
                }
              }
            }
            
            setIsSupprimerClicked(false);
            setmessageSuccess("Succès : utilisateur supprimé.");
            setShowSuccess(true);
            setTimeout(() => {
              setShowSuccess(false);
            }, 3000);
            setTimeout(() => {
              setmessageSuccess("");
            }, 4000);
            navigation.goBack();
          }
          else{
            setmessageError("Oups, Une erreur est survenue!");
              setShowError(true);
              setTimeout(() => {
                setShowError(false);
              }, 3000);
              setTimeout(() => {
                setmessageError("");
              }, 4000);
          }
        }
        catch(e){
          setmessageError("Oups, Une erreur est survenue!");
              setShowError(true);
              setTimeout(() => {
                setShowError(false);
              }, 3000);
              setTimeout(() => {
                setmessageError("");
              }, 4000);
          console.log(e.message);
        } finally{
          setloaderDelete(false);
        }
      }
      else if(dataProfile.type === "staff"){
        try{
          setloaderDelete(true);
          const token = await getToken();
          const resp = await axios.delete(`${ENDPOINT_API}deleteUserStaffNotAdmin/${parseInt(id)}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          if(resp.status === 200){
            setIsSupprimerClicked(false);
            setmessageError("Oups, Une erreur est survenue!");
              setShowError(true);
              setTimeout(() => {
                setShowError(false);
              }, 3000);
              setTimeout(() => {
                setmessageError("");
              }, 4000);
              navigation.goBack();
            }
          else{
            setmessageError("Oups, Une erreur est survenue!");
              setShowError(true);
              setTimeout(() => {
                setShowError(false);
              }, 3000);
              setTimeout(() => {
                setmessageError("");
              }, 4000);
          }
        }
        catch(e){
          setmessageError("Oups, Une erreur est survenue!");
              setShowError(true);
              setTimeout(() => {
                setShowError(false);
              }, 3000);
              setTimeout(() => {
                setmessageError("");
              }, 4000);
          console.log(e.message);
        } finally{
          setloaderDelete(false);
        }
      }
    }
  }


  return (
    <>
     

     
    {
        isSupprimerClicked && 
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
            <Text style={{ 
              fontSize: 18, 
              fontWeight: 'bold', 
              marginBottom: 5 
            }}>

              Si vous supprimez ce membre du personnel,
            
            </Text>
            <Text style={{ 
              fontSize: 18, 
              fontWeight: '400', 
              marginBottom: 25 
            }}>

              toutes les données associées, notamment ses données, seront également supprimées.

            </Text>
            <View style={{ 
              flexDirection: 'row', 
              justifyContent: 'space-between' 
            }}>

              <TouchableOpacity style={{
                backgroundColor: '#eee', 
                paddingVertical: 13,
                width : "30%",
                borderRadius: 5,
                alignItems : "center", 
                justifyContent : "center"
                }}
                onPress={()=>{setIsSupprimerClicked(false)}}
                disabled={loaderDelete}
                >
                <Text style={{ color: 'black', fontWeight: 'bold' }}>
                Annuler
                </Text>
              </TouchableOpacity>


              <TouchableOpacity style={{
                backgroundColor: 'black', 
                paddingVertical: 13,
                width : "67%",
                borderRadius: 5,
                alignItems : "center", 
                justifyContent : "center",                
                borderRadius: 5
              }}
                disabled={loaderDelete}
                onPress={()=>{
                  handleLickDelete();
                }}
              >
                <Text style={{ color: 'white', fontWeight: 'bold' }}>
                {
                  loaderDelete ? 
                  "suppression en cours..."
                  :
                  "Supprimer définitivement"
                }
                </Text>
              </TouchableOpacity>
              
            </View>
          </View>
        </View>
      }



    {
      changePasswordClicked  &&
        <View  style={[styles.popUpSecond, { height: screenHeight - 110  }]} >

              <Text style={styles.titlePP}>
                <Ionicons name="arrow-forward" size={18} color="black" />&nbsp;
                Modification du mot de passe
              </Text>

              <View style={styles.inputRowPP}>
                <TextInput
                  value={ancienMotDepasse}
                  onChangeText={(text) => setancienMotDepasse(text)}
                  style={styles.inputPP}
                  placeholder="Ancien mot de passe"
                  
                />
                <TextInput
                  style={styles.inputPP}
                  placeholder="Nouveau mot de passe"
                  value={nouveauMotDePasse}
                  onChangeText={(text) => setnouveauMotDePasse(text)}
                />
                <TextInput
                  style={styles.inputPP}
                  placeholder="Confirmer mot de passe"
                  value={confirmNvmotedepasse}
                  onChangeText={(text) => setconfirmNvmotedepasse(text)}
                />
              </View>

              <View style={styles.buttonRowPP}>
                <TouchableOpacity disabled={loadingPassword} onPress={()=>{setchangePasswordClicked(false);setnouveauMotDePasse('');setancienMotDepasse('');setconfirmNvmotedepasse('');}}  style={styles.buttonPPA}>
                  <Text style={styles.buttonTextPPA}>Annuler</Text>
                </TouchableOpacity>
                <TouchableOpacity disabled={loadingPassword}  
                  style={[
                    styles.buttonPPC,
                    { opacity: loadingPassword ? 0.3 : 1 }
                  ]} 
                  onPress={handleConfirmPassword} 
                >
                  <Text style={styles.buttonTextPPC}>Confirmer</Text>
                </TouchableOpacity>
              </View>
             
        </View>
    }


    {/*
    
    {
      (voirPersonelClicked  && isCurrent!== null) &&
        <View  style={[styles.popUpSecond, { height: screenHeight - 110  }]} >

              <Text style={styles.titlePP}>
                <Ionicons name="arrow-forward" size={18} color="black" />&nbsp;
                Liste de {isCurrent ? "mes" : "ses"} personnels
              </Text>

              <ScrollView style={[styles.scrollViewXX, { height: screenHeight - 500  }]}  >
              {
                loadingPersonnel ? 
                <View style={{ height : 333, alignItems : "center", justifyContent : "center" }} >           
                  <Text style={{ fontSize : 15, textAlign : "center" }}>Chargement...</Text>
                </View> 
                :
                <>
                {
                  allPersonnels && 
                  <>
                  {
                    allPersonnels.length === 0 ? 
                    <View style={{ height : 333, alignItems : "center", justifyContent : "center" }} >           
                      <Text style={{ fontSize : 15, textAlign : "center" }}>Aucune donnée</Text>
                    </View>
                    :
                    allPersonnels.map((personel)=>{
                      return(
                        <CardAdmin 
                          item={personel} 
                          index={personel.id} 
                          isXClicked={true} 
                           
                        />
                      )
                    })
                  }
                  </>   
                }
                </>
              }
              </ScrollView>

              <View style={styles.buttonRowPP}>
                <TouchableOpacity 
                  onPress={()=>{
                    setvoirPersonelClicked(false);
                  }}
                  style={styles.buttonPPQUITER}
                >
                  <Text style={styles.buttonTextPPA}>Quitter cette fenêtre</Text>
                </TouchableOpacity>
              </View>
             
        </View>
    }
    
    */}




    <View style={styles.container}>
      <AlertError message={messageError} visible={showError} />
      <AlertSuccess message={messageSuccess} visible={showSuccess} />
     <View>
      {loading === false && (
        <>
          <View style={styles.titleContainer}>
          {
            loading && 
            <View style={{ position: "absolute", left :23 ,zIndex: 10,}} > 
              <Image
                source={LoaderSVG}  
                style={styles.imageJOZNJORSFDOJFSWNVDO} 
              />
            </View>
          }

            <Text style={styles.titleText}>
              {isCurrent !== null && <>{isCurrent ? "Mon " : ""}</>} Profil
            </Text>
            <TouchableOpacity onPress={toggleMenu} style={styles.menu}>
              <Ionicons name="menu" size={24} color="#3E6715" />
            </TouchableOpacity>
          </View>

          <View style={styles.profileContainer}>
            
             

            {
              isModify ? 
                <>
                {
                  image && 
                  <Image
                    style={styles.profileImage}
                    source={{ uri: image }} 
                  />
                }
                </>
                :
                <Image
                  style={styles.profileImage}
                  source={{
                    uri: dataProfile && dataProfile.image
                      ? dataProfile.image
                      : "https://cdn-icons-png.flaticon.com/256/149/149071.png"
                  }}
                />
            }
             


            <Text style={styles.roleText}>
              {dataProfile && (
                <>
                  {dataProfile.type.toLowerCase() === "admin"
                    ? "Administrateur"
                    : dataProfile.type.toLowerCase() === "superadmin"
                      ? "Super-Administrateur"
                      : "Personnel"}
                </>
              )}
            </Text>

            
            {
              dataProfile && 
              (
                dataProfile.canAccess === 0 &&
                <Text  style={styles.zisfudowcuosdw} >
                Accès restreint
                </Text>
              )
            }


            {isModify && (
              <TouchableOpacity 
                style={styles.modifyButton} 
                onPress={pickImage}  
              >
                <Text style={styles.modifyButtonText}>Modifier l'image</Text>
              </TouchableOpacity>
            )}
 
            
          </View>
        </>
      )}

      {loading ? (
        <ProfileSkeleton />
      ) : dataProfile && (
        <>
          <View style={styles.rowXXX}>
            <Text style={styles.label}>Nom et prénom :</Text>
            {isModify ? (
              <TextInput
                placeholderTextColor="#ccc"
                placeholder="Champs obligatoire"
                style={styles.input2}
                value={dataProfileOfChangement.fullName}
                onChangeText={(text) => setdataProfileOfChangement({ ...dataProfileOfChangement, fullName: text })}
              />
            ) : (
              <Text style={styles.value}>{dataProfile.fullName}</Text>
            )}
          </View>
          <View style={styles.rowXXX}>
            <Text style={styles.label}>Adresse email :</Text>
            {isModify ? (
              <TextInput
                style={styles.input2}
                placeholderTextColor="#ccc"
                placeholder="Champs obligatoire"
                value={dataProfileOfChangement.email}
                onChangeText={(text) => setdataProfileOfChangement({ ...dataProfileOfChangement, email: text })}
              />
            ) : (
              <Text style={styles.value}>{dataProfile.email}</Text>
            )}
          </View>
          <View style={styles.rowXXX}>
            <Text style={styles.label}>Téléphone :</Text>
            {isModify ? (
              <TextInput
                style={styles.input2}
                placeholderTextColor="#ccc"
                placeholder="Champs non obligatoire"
                value={dataProfileOfChangement.mobile}
                onChangeText={(text) => setdataProfileOfChangement({ ...dataProfileOfChangement, mobile: text })}
              />
            ) : (
              <Text style={styles.value}>{dataProfile.mobile ? dataProfile.mobile : '--'}</Text>
            )}
          </View>

          <>
          {
            ((!isCurrent && dataOfVisitor!== null) && isModify) &&
            <>
          {
            dataProfileOfChangement &&  
            <View style={styles.rowXXX}>
            <Text style={styles.label}>Role : </Text>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={dataProfileOfChangement.type}
                style={styles.picker}
                onValueChange={(itemValue) => setdataProfileOfChangement({ ...dataProfileOfChangement, type: itemValue })}
              >
                <Picker.Item label="Administrateur" value="admin" />
                <Picker.Item label="Staff" value="staff" />
              </Picker>
            </View>
          </View>
          }

            </>
          }
          </>
          
          <View style={styles.rowXXX}>
            <Text style={styles.label}>Date de création</Text>
            <Text style={styles.value}>{formatDate(dataProfile.created_at)}</Text>
          </View>

          {isCurrent !== null && (
            <>
              <View style={styles.hr} />
              {(isCurrent === true || (role && role === "superadmin")) && (
                <>

                   
                   
                  <TouchableOpacity  onPress={()=>{handleClick(2)}} style={styles.modifierVotreX}>
                    <Text style={styles.modifierVotreXText}>Modifier le mot de passe</Text>
                    <Ionicons name="arrow-forward" size={24} color="gray" />
                  </TouchableOpacity>
                  <TouchableOpacity  onPress={()=>{handleClick(3)}} style={styles.modifierVotreX}>
                    <Text style={styles.modifierVotreXText}>Réglages de paiements</Text>
                    <Ionicons name="arrow-forward" size={24} color="gray" />
                  </TouchableOpacity >
                </>
              )}
            </>
          )}

          
        </>
      )}
    </View>






        <View style={styles.buttonContainer}>
          {role && isCurrent !== null && (
            <>
              {role === "superadmin" || isCurrent === true ? (
                <>
                  {!isModify ? (
                    <>

                      {
                        isCurrent ? 
                        <>
                          <TouchableOpacity
                            disabled={loading || !dataProfile || loader1 }
                            style={[
                              styles.saveButton, 
                              { opacity: loading || !dataProfile || loader1  ? 0.3 : 1 } 
                            ]} 
                            onPress={() => { setisModify(!isModify); }}
                          >
                            <Text style={styles.buttonTextWhite}>Modifier le profil</Text>
                          </TouchableOpacity>
                        </>
                        :
                        <>
                          
                          {
                            canHeAccess!== null && 
                            (
                              <TouchableOpacity
                                disabled={loading || !dataProfile || loader2}
                                style={[
                                   styles.canHeAccessNot,
                                  { opacity: loading || !dataProfile || loader2 || loader1 ? 0.3 : 1 }
                                ]}
                                onPress={() => {restreindreCompte()}}
                              >
                                <Text style={styles.buttonTextWhite}>{canHeAccess ? "Restreindre" : "Autoriser"}</Text>
                              </TouchableOpacity>
                            )
                          }

                          <TouchableOpacity
                            disabled={loading || !dataProfile || loader1 || loader2}
                            style={[
                              styles.saveButton, 
                              { opacity: loading || !dataProfile || loader1 || loader2 ? 0.3 : 1 } 
                            ]} 
                            onPress={() => { setisModify(!isModify); }}
                          >
                            <Text style={styles.buttonTextWhite}>Modifier</Text>
                          </TouchableOpacity>

                          <TouchableOpacity
                            onPress={()=>{
                              setIsSupprimerClicked(true);
                            }}
                            disabled={loading || loader2 || loader1 || !dataProfile}
                            style={[
                              
                              styles.supprimerLepersonel2, 
                              { opacity: loading ? 0.3 : 1 } 
                            ]}
                          >
                            <Text style={styles.buttonTextWhite}>Supprimer</Text>
                          </TouchableOpacity>

                        </>
                      }
                      
                    </>
                  ) : (
                    <>
                      <TouchableOpacity
                       disabled={loading || !dataProfile || loader1}
                        style={styles.cancelButton}
                        onPress={() => { 
                          if(dataProfile.image === null || dataProfile.image === ""){
                            setImage("https://cdn-icons-png.flaticon.com/256/149/149071.png");
                          }
                          else{
                            setImage(dataProfile.image);
                          }
                          setURi(null);setImageName('');setdataProfileOfChangement(dataProfile);setisModify(!isModify); }}
                      >  
                        <Text style={styles.buttonTextBlack}>Annuler</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        disabled={loading || !dataProfile || loader1}
                        style={[
                          styles.saveButton, 
                          { opacity: loading|| !dataProfile || loader1 ? 0.3 : 1 } 
                        ]}
                        
                        onPress={handleSaveData}
                      >
                        <Text style={styles.buttonTextWhite}>Sauvegarder</Text>
                      </TouchableOpacity>
                    </>
                  )}
                </>
              ) : (
                <>
                  <TouchableOpacity
                    onPress={()=>{
                      setIsSupprimerClicked(true);
                    }}
                    disabled={loading || !dataProfile}
                     style={[
                      styles.supprimerLepersonel, 
                      { opacity: loading ? 0.3 : 1 } 
                    ]}
                  >
                    <Text style={styles.buttonTextWhite}>Supprimer le personnel</Text>
                  </TouchableOpacity>
                </>
              )}
            </>
          )}
        </View>
      </View>











      
      {isMenuVisible && (
        <Animated.View
          style={[styles.popup, { transform: [{ translateX: slideAnim }] }]}
          {...panResponder.panHandlers}
        >
          <ScrollView style={styles.popupContent}>
            <TouchableOpacity onPress={() => { navigation.navigate('Dashboard'); toggleMenu(); }} style={styles.logo}>
              <Image
                source={require('../images/logo.png')}
                style={styles.imageLogo}
                resizeMode="cover"
              />
            </TouchableOpacity>
            
            <TouchableOpacity onPress={() => { navigation.navigate('Dashboard'); toggleMenu(); }} style={styles.menuItem}>
              <Ionicons name="bar-chart-outline" size={24} color="black" />
              <Text style={styles.menuText}>Tableau de bord</Text>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={() => { navigation.navigate('Profile', { id: 666 }); toggleMenu(); }} style={styles.menuItem}>
              <Ionicons name="person-outline" size={24} color="black" />
              <Text style={styles.menuText}>Mon Profile</Text>
            </TouchableOpacity>
           
            {
              (role && (role.toLowerCase() === "superadmin") )&&
              <>
              <TouchableOpacity onPress={() => { navigation.navigate('MesClients'); toggleMenu(); }} style={styles.menuItem}>
                <Ionicons name="people-outline" size={24} color="black" />
                <Text style={styles.menuText}>Liste des Utilisateurs</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => { navigation.navigate('SuperAdminDemande'); toggleMenu(); }} style={styles.menuItem}>
                <Ionicons name="mail-outline" size={24} color="black" />
                <Text style={styles.menuText}>Demandes Clients</Text>
              </TouchableOpacity>
              
              </>
            }

           
           
            <TouchableOpacity onPress={() => { navigation.navigate('Historique'); toggleMenu(); }} style={styles.menuItem}>
              <MaterialIcons name="history" size={24} color="black" />
              <Text style={styles.menuText}>Historique de calcul</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { navigation.navigate('AjouterUnCalcul'); toggleMenu(); }} style={styles.menuItem}>
              <Ionicons name="add-circle-outline" size={24} color="black" />
              <Text style={styles.menuText}>Ajouter un calcul</Text>
            </TouchableOpacity>
            
            
            {
              ((role !== null && role !== undefined) && (role.toLowerCase() === "superadmin" || role.toLowerCase() === "admin") ) &&
                <>
                  <TouchableOpacity onPress={() => { navigation.navigate('MesFermes'); toggleMenu(); }} style={styles.menuItem}>
                    <Ionicons name="business-outline" size={24} color="black" />
                    <Text style={styles.menuText}>Mes fermes</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => { navigation.navigate('AjouterUneFerme'); toggleMenu(); }} style={styles.menuItem}>
                    <Ionicons name="add-circle-outline" size={24} color="black" />
                    <Text style={styles.menuText}>Ajouter une ferme</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => { navigation.navigate('MesPersonels'); toggleMenu(); }} style={styles.menuItem}>
                    <Ionicons name="people-outline" size={24} color="black" />
                    <Text style={styles.menuText}>Mes personnels</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => { navigation.navigate('AjouterUnPersonel'); toggleMenu(); }} style={styles.menuItem}>
                    <Ionicons name="add-circle-outline" size={24} color="black" />
                    <Text style={styles.menuText}>Ajouter un personnel</Text>
                  </TouchableOpacity>
                </>
            }
            
            
            <TouchableOpacity 
                onPress={async ()=>{
                    deleteToken();
                    settriggerIt((prev) => !prev);
                    setTimeout(()=>{
                      navigation.navigate('Home');
                    }, 400);
                  }
                } 
                style={styles.menuItem}>
              <Ionicons name="log-out-outline" size={24} color="black" />
              <Text style={styles.menuText}>Logout</Text>
            </TouchableOpacity>
          </ScrollView>
          <View style={styles.footer}>
            <Text style={styles.footerText}>PCS AGRI</Text>
            <Text style={styles.footerText}>© all rights reserved • 2024</Text>
          </View>
          <TouchableOpacity onPress={toggleMenu} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>
              <Ionicons style={styles.iconX} name="close" size={20} color="#325A0A" />
            </Text>
          </TouchableOpacity>
        </Animated.View>
      )}

      

    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: 23,
  },
  titleContainer: {
    marginTop : 18,

    marginBottom : 23,
    alignItems: 'center',
    position : "relative"
  },

  
  rowXXX: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height : 40,
    marginLeft : 23,
    marginRight : 23 
  },
  hr: {
    borderBottomColor: '#dcdcdc', 
    borderBottomWidth: 1,         
    marginTop : 20,
    marginBottom : 20,
    marginRight : 23, 
    marginLeft : 23
  },
  label: {
    fontWeight: '500',
    fontSize : 16
  },
  value: {
    textAlign: 'right',
    fontSize : 16
  },



  menu: {
    position: "absolute",
    right: 23,
    zIndex: 10,
  },
  titleText: {
    color: 'black',
    fontSize: 19,
    fontWeight: 'bold',
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  profileImage: {
    width: 110,
    height: 110,
    borderRadius: 1000,
  },
  roleText: {
    marginTop: 10,
    fontSize: 14,
    color : "#B8B8B8",
    fontWeight: '500',
  },
  pickerWrapper: {  
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    marginBottom: 16,
    height : 30,
    width : 190,
    justifyContent : "center"
  },
  picker: {
    borderWidth: 1,
     borderRadius: 10,
    fontSize : 16,
     height: 48, 
  },
  imageJOZNJORSFDOJFSWNVDO : {
    height : 23, width : 23
  },
  
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingLeft : 22,
    borderRadius: 8,
    marginBottom: 16,
    paddingRight: 22,
    marginLeft : 23, 
    marginRight : 23,
    fontSize : 16
  },input2: {
    height: 30,
    borderColor: '#ccc',
    borderWidth: 1,
     borderRadius: 8,
     fontSize : 16, 
     width : 190,
     paddingLeft : 10,
     paddingRight : 10
  },
  buttonContainer: {
    flexDirection: "row",
    marginLeft: 23,
    justifyContent : "space-between", 
    position: 'absolute',  
    bottom: 20,           
    left: 0,
    right: 0,
    marginRight: 23,
   },
   buttonContainer2: {
    flexDirection: "row",
    marginLeft: 23,
    justifyContent : "space-between", 
    position: 'absolute',  
    bottom: 75,           
    left: 0,
    right: 0,
    marginRight: 23,
   },
   zisfudowcuosdw : {
    backgroundColor : "#AF0000", 
    padding : 3, 
    paddingLeft : 10, 
    paddingRight : 10,
    marginTop : 6, 
    borderRadius : 30,
    color : "white",
   },
   newImageContainer: {
    marginTop: 10,
    alignItems: 'center',
  },
  newImage: {
    width: 100,
    height: 100,
    borderRadius: 10, // Optional: Add border radius for rounded corners
  },

  cancelButton: {
    flex: 1,
    marginRight: 8,
    paddingVertical: 12,
    backgroundColor: 'white',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth : 1, 
    borderColor : "#C8C8C8"
  },
  saveButton: {
    marginLeft: 8,
    paddingVertical: 12,
    backgroundColor: '#487C15',
    alignItems: 'center',
    borderRadius: 8,
    flex : 1
  },
  supprimerLepersonel2 :{
    marginLeft: 8,
    paddingVertical: 12,
    backgroundColor: '#AF0000',
    alignItems: 'center',
    borderRadius: 8,
    flex : 1
  },
  canHeAccess : {
    marginLeft: 8,
    paddingVertical: 12,
    backgroundColor: '#AF0000',
    alignItems: 'center',
    borderRadius: 8,
    flex : 1
  },
  
  canHeAccessNot : {
    marginLeft: 8,
    paddingVertical: 12,
    backgroundColor: '#C66C02',
    alignItems: 'center',
    borderRadius: 8,
    flex : 1
  },
  supprimerLepersonel : {
    flex: 1,
    marginLeft: 8,
    paddingVertical: 12,
    backgroundColor: '#B40000',
    alignItems: 'center',
    borderRadius: 8,
  },

  modifyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor : 'white', // Button color
    padding: 10,
    paddingLeft : 15,
    paddingRight : 15,
    borderRadius: 40,
    marginTop: 10,
    borderWidth : 1, 
    borderColor : "#487C15",
  },
  modifyButtonText: {
    color: '#487C15', // Text color
    marginLeft: 5,
    fontWeight : "500", 
  },
  buttonTextWhite: {
    color: '#fff',
    fontSize: 16,
  },
  buttonTextBlack: {
    color: 'black',
    fontSize: 16,
  },
  buttonTextBlack2 : {
    color: '#457515',
    fontSize: 16,
    fontWeight : "500"
  },
  popUpSecond: {
    position: 'absolute',
    top: 71,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 300,
    backgroundColor: 'white',  
    alignItems: 'center',
    width: '100%', 
    padding : 23
  },



  titlePP: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 30,
  },
  inputRowPP: {
    flexDirection: 'column',
    width: '100%',
    height : 385,
    justifyContent : "flex-end",
  },
  inputPP: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    width: '100%',
    borderRadius: 8,
    fontSize : 15,
    textAlign : "center",
    marginTop : 14,
    backgroundColor: '#fff',
  },
  buttonRowPP: {
    flexDirection: "row",
    marginLeft: 23,
    justifyContent : "space-between", 
    position: 'absolute',  
    bottom: 20,           
    left: 0,
    right: 0,
    marginRight: 23,
  },
  buttonPPC: {
    backgroundColor: '#487C15',
    paddingVertical: 12,
    alignItems : "center",
    justifyContent : "center",
    borderRadius: 8,
    width : "61%"
  },
  buttonPPA: {
    backgroundColor: 'white',
    paddingVertical: 12,
    alignItems : "center",
    justifyContent : "center",
    borderRadius: 8,
    borderWidth : 1, 
    borderColor : "#487C15",
    width : "35%",
  },
  buttonPPQUITER : {
    backgroundColor: 'white',
    paddingVertical: 12,
    alignItems : "center",
    justifyContent : "center",
    borderRadius: 8,
    borderWidth : 1, 
    borderColor : "#487C15",
    width : "100%",
  },
  buttonTextPPA: {
    color: '#487C15',
    fontSize: 16,
    fontWeight : "500",
    textAlign: 'center',
  },

  buttonTextPPC: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },




  popupText: {
    color: '#fff',
    fontSize: 20,
  },
  popup: {
    position: 'absolute',
    top: 0,
    right: 0,
    height: '105%',
    width: '66%',
    backgroundColor: '#C4EA9E',  
    shadowColor: '#000',
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    elevation: 15,
    zIndex: 9999,
  },
  popupContent: {
    padding: 20,
  },
  imagePreview: {
    alignItems: 'center',
    marginVertical: 16,
  },
  imageName: {
    marginTop: 8,
    fontSize: 16,
    color: 'gray',
  },

  logo: {
    marginTop : 40,
    marginLeft : "auto",
    marginRight : "auto",
    marginBottom: 20,
    height : 40,
    width : 130,
  },
  imageLogo : {
    height : "100%", 
    width : "100%"
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 15,    marginLeft: 20 ,

  },
  menuText: {
    fontSize: 16,
    color: 'black',
    marginLeft: 10,
  },
  footer: {
    position: 'absolute',
    bottom: 53,
    width: '100%',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#656565',
    textAlign: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 35,
    right: 17,
    backgroundColor: '#BAE790',
    padding: 10,
    borderRadius: 50,
  },
  closeButtonText: {
    fontSize: 16,
    color: 'white',
  },
  modifierVotreX : {
    height: 21,
    marginTop : 6 ,
    width : "auto",
    justifyContent : "space-between",
    marginBottom: 16,
    flexDirection: 'row',      
    justifyContent: 'space-between',
    alignItems: 'center', 
    marginLeft : 23, 
    marginRight : 23
  },
  modifierVotreXText : {
    color: "#6D6D6D",
    fontSize : 16
  },
  scrollViewXX : {
    width : "100%", 
    marginBottom : 60
  }
});

export default Profile;