import AsyncStorage from '@react-native-async-storage/async-storage';
import { saveToken, getToken, deleteToken } from '../Helpers/tokenStorage';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import {Image ,Alert,ScrollView, TextInput,StyleSheet, TouchableOpacity, Text, View, PanResponder, Animated, Dimensions  } from 'react-native';
import { Picker } from '@react-native-picker/picker'; 
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons'; 
import { MaterialIcons } from '@expo/vector-icons'; 
const { width: screenWidth } = Dimensions.get('window');
import CustomDatePicker from "../Components/CustomDatePicker";
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../Helpers/AuthContext';
import axios from "axios";
import { ENDPOINT_API } from './endpoint';
import { AlertError, AlertSuccess } from "../Components/AlertMessage";
import LoaderSVG from '../images/Loader.gif'
import rateLimit from 'axios-rate-limit';
const axiosInstance = rateLimit(axios.create(), {
  maxRequests: 5, // maximum number of requests
  perMilliseconds: 1000, // time window in milliseconds
});


const CreateCalculation = ({route}) => {
  const [showError, setShowError] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [messageError,setmessageError] = useState("");
  const [messageSuccess,setmessageSuccess] = useState("");
  const [farms, setFarms] = useState([]);
  const [selectedFarm, setSelectedFarm] = useState('');
  const [greenhouses, setGreenhouses] = useState([]);
  const [selectedGreenhouse, setSelectedGreenhouse] = useState('');
  const [LoadingX,setLoadingX] = useState(true);
  const [role, setRole] = useState(null);

  useEffect(()=>{
    const x = async ()=>{
      const rolex = JSON.parse(await AsyncStorage.getItem('type'));
      setRole(rolex);
     }
    x();
  },[ ]);


  const navigation = useNavigation();
  const [plaqueId, setPlaqueId] = useState('');
  const [serre, setSerre] = useState('');
  const [ferme, setFerme] = useState('');
  const [loading, setloading] = useState(false);
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(screenWidth)).current;
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { settriggerIt, triggerIt } = useAuth();
  const [image, setImage] = useState(null);  
  const [URi, setURi] = useState(null);  
  const [imageName, setImageName] = useState('');

  const getFileNameFromUri = (uri) => {
    return uri.split('/').pop();  // Extracts the last part of the URI which is the file name
  };


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

const takePhoto = async () => {
  let result = await ImagePicker.launchCameraAsync({
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
 


const formatDateForCreatedAt = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};


  useEffect(()=>{
    const x = async()=>{
      try{
        setLoadingX(true);
        const userId = await AsyncStorage.getItem('userId');
        const userIdNum = parseInt(userId);
        
        const token = await getToken();   
        const response = await axiosInstance.get(`${ENDPOINT_API}getFarmsWithGreenhouses/${userIdNum}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if(response.status  === 200){
          console.log(response.data);
          setFarms(response.data);
        }
        else{
          console.log("Not Fetched All Farms With Their Serres");
        }
      }
      catch(e){
        console.log(e.message);
      } finally{
        setLoadingX(false);

      }
    }
    x();
  }, []);


  const handleFarmChange = (farmId) => {
    setSelectedFarm(farmId);
    
    const selectedFarm = farms.find(farm => farm.id === farmId);
    
    if (selectedFarm && selectedFarm.serres && Array.isArray(selectedFarm.serres)) {
      setGreenhouses(selectedFarm.serres);
    } else {
      setGreenhouses([]);
    }
  };


  const createCalculation = async () => {
   
      if (!URi) {
        setmessageError("Veuillez sélectionner une image avant de faire un calcul.");
        setShowError(true);
        setTimeout(() => {
          setShowError(false);
        }, 3000);
        setTimeout(() => {
          setmessageError("");
        }, 4000);
        return;
      }

      setloading(true);
      const userId = await AsyncStorage.getItem('userId');
      const userIdNum = parseInt(userId);
      console.log(URi, serre, ferme);
      console.log("User Id : "+userIdNum);
      let formData = new FormData();
      
      formData.append('image', {
        uri: URi,   
        name: 'photo.jpg',   
        type: 'image/jpeg'   
      });
      
      
      formData.append('serre_id', selectedGreenhouse); 
      formData.append('farm_id', ferme);
      formData.append('farm_id', selectedFarm);
      formData.append('user_id', userIdNum);  
      formData.append('plaque_id', plaqueId);  
      formData.append('created_at',formatDateForCreatedAt(selectedDate));  
  
      try {
        const token = await getToken();   
        const response = await axiosInstance.post(`${ENDPOINT_API}create_prediction`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
          }
        });
        if(response.status === 201){
          setSelectedDate(new Date());
          setFerme("");
          setImage("");
          setImageName("");
          setURi('');
          setSerre("");
          setPlaqueId("");
          setmessageSuccess("Succès : Votre calcul a bien été créé.");
            setShowSuccess(true);
            setTimeout(() => {
              setShowSuccess(false);
            }, 2000);
            setTimeout(() => {
              setmessageSuccess("");
            }, 3000);
          setTimeout(()=>{
            navigation.navigate("Historique")
          }, 3000);
        }
        else{
          setmessageError("Oups, Une erreur est survenue lors du calcul, veuillez réessayer!");
          setShowError(true);
          setTimeout(() => {
            setShowError(false);
          }, 3000);
          setTimeout(() => {
            setmessageError("");
          }, 4000);
        }
      } catch (error) {
        setmessageError("Oups, problème interne du serveur!");
          setShowError(true);
          setTimeout(() => {
            setShowError(false);
          }, 3000);
          setTimeout(() => {
            setmessageError("");
          }, 4000);
        console.error('Erreur :',error.message);
      } finally{
        setloading(false);
      }
  };


  
  const [IDCurrent, setIDCurrent] = useState(null);


  useFocusEffect(
    useCallback(() => {
      const x = async ()=>{
        const userId = await AsyncStorage.getItem('userId');
        const userIdNum = parseInt(userId);
        setIDCurrent(userIdNum);
      }
      x(); 
  }, []));
  


  return (
    <>
    <View style={styles.container} >
      <AlertError message={messageError} visible={showError} />
      <AlertSuccess message={messageSuccess} visible={showSuccess} />
        <ScrollView>
          <View style={styles.titleContainer}>
          {
            loading && 
            <View style={{ position: "absolute", left :0 ,zIndex: 10,}} > 
              <Image
                source={LoaderSVG}  
                style={styles.imageJOZNJORSFDOJFSWNVDO} 
              />
            </View>
          }
            <Text style={styles.titleText}>Nouveau Calcul</Text>
            <TouchableOpacity onPress={toggleMenu} style={styles.menu}>
              <Ionicons name="menu" size={24} color="#3E6715" />
            </TouchableOpacity>
          </View>
       
          <Text style={styles.label}>Plaque</Text>
          <TextInput
            style={styles.input}
            placeholder="Veuillez saisir l’ ID de la plaque..."
            value={plaqueId}
            onChangeText={setPlaqueId}
          />
 
          
            <Text style={styles.label}>Ferme</Text>
            <View style={styles.pickerWrapper}>
              <Picker
                enabled={!LoadingX}
                selectedValue={selectedFarm}
                style={styles.picker}
                onValueChange={(itemValue) => handleFarmChange(itemValue)}
              >
                <Picker.Item label="Veuillez saisir la valeur..." value="" />
                {farms && farms.length > 0 ? (
                  farms.map((farm) => (
                    <Picker.Item key={farm} label={farm.name} value={farm.id} />
                  ))
                ) : (
                  <Picker.Item label="Aucune ferme disponible" value="" />  
                )}
              </Picker>
            </View>



            <Text style={styles.label}>Serre</Text>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={selectedGreenhouse}
                style={styles.picker}
                onValueChange={(itemValue) => setSelectedGreenhouse(itemValue)}
                enabled={!!selectedFarm}  
              >
                <Picker.Item label="Veuillez saisir la valeur..." value="" />
                {greenhouses && greenhouses.length > 0 && greenhouses.map((greenhouse) => (
                  <Picker.Item key={greenhouse} label={greenhouse.name} value={greenhouse.id} />
                ))}
              </Picker>
            </View>



          <Text style={styles.label}>Date de création </Text>
          <CustomDatePicker selectedDate={selectedDate} onDateChange={setSelectedDate} />

            
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.buttonOutline} onPress={takePhoto}>
              <Text style={styles.buttonTextB}>Prendre une photo</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonOutline} onPress={pickImage}>
              <Text style={styles.buttonTextB}>Choisir une image</Text>
            </TouchableOpacity>
          </View>

          {image && (
              <View style={styles.imagePreview}>
                <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />
                <Text style={styles.imageName}>{imageName}</Text> 
              </View>
            )}



      </ScrollView>


      <View style={styles.buttonRow1}>
        <TouchableOpacity disabled={loading} onPress={()=>{navigation.goBack()}} style={[
            styles.cancelButton, 
            { opacity: loading ? 0.5 : 1 } 
          ]} >
          <Text style={styles.buttonTextB}   >Annuler</Text>
        </TouchableOpacity>
        <TouchableOpacity disabled={loading} style={[
            styles.saveButton, 
            { opacity: loading ? 0.5 : 1 } 
          ]} onPress={createCalculation} >
          <Text style={styles.buttonTextW}>{ loading ? "Création du calcul..." : "Enregistrer le calcul" }</Text>
        </TouchableOpacity>
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
            <Ionicons name="archive-outline" size={24} color="black" />
            <Text style={styles.menuText}>Historique de calcul</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { navigation.navigate('AjouterUnCalcul'); toggleMenu(); }} style={styles.menuItem}>
              <Ionicons name="add-circle-outline" size={24} color="black" />
              <Text style={styles.menuText}>Ajouter un calcul</Text>
            </TouchableOpacity>
            
            
            {
              (role && (role.toLowerCase() === "superadmin" || role.toLowerCase() === "admin") ) &&
                <>
                  <TouchableOpacity onPress={() => { navigation.navigate('MesFermes'); toggleMenu(); }} style={styles.menuItem}>
                    <Ionicons name="business-outline" size={24} color="black" />
                    <Text style={styles.menuText}>Mes fermes</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => { navigation.navigate('AjouterUneFerme'); toggleMenu(); }} style={styles.menuItem}>
                    <Ionicons name="add-circle-outline" size={24} color="black" />
                    <Text style={styles.menuText}>Ajouter une ferme</Text>
                  </TouchableOpacity>
                  {
                  IDCurrent && 
                  <TouchableOpacity onPress={() => { navigation.navigate('MesPersonels',{id : IDCurrent}); toggleMenu(); }} style={styles.menuItem}>
                  <Ionicons name="people-outline" size={24} color="black" />
                  <Text style={styles.menuText}>Mes personnels</Text>
                </TouchableOpacity>
                 }
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
                    await AsyncStorage.removeItem('userId');
                    await AsyncStorage.removeItem('type');
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
    padding: 23,
  },
  titleContainer: {
    marginTop : 18,
    marginBottom : 23,
    alignItems: 'center',
    position : "relative"
  },
  menu :{
    position : "absolute",
    right : 0,
    zIndex: 10, 
  }, 
  titleText: {
    color: 'black',
    fontSize: 19,
    fontWeight: 'bold',
  },
  imageJOZNJORSFDOJFSWNVDO : {
    height : 23, width : 23
  }, 
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    fontSize : 16,
    paddingLeft: 20,
    paddingRight: 20,
    marginBottom: 16,
    height: 48
  },
  pickerWrapper: {  
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    marginBottom: 16,
    justifyContent : "center"
  },
  picker: {
    borderWidth: 1,
     borderRadius: 10,
    fontSize : 16,
     height: 48, 
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

  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 16,
    fontSize : 16,
  },
  buttonRow1: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttonOutline: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 16,
    width: '48%',    fontSize : 16,

    alignItems: 'center',
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 16,
    width: '32%',
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: '#487C15',
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 16,
    width: '64%',
    alignItems: 'center',
  },
  buttonTextW: {
    color: 'white',
    fontSize: 16,
  },
  buttonTextB: {
    color: 'black',
    fontSize: 16,
  },

  //pop Up Menu 
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


});
export default CreateCalculation;


