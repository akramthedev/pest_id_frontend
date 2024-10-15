import { saveToken, getToken, deleteToken } from '../Helpers/tokenStorage';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import {Image ,ScrollView, TextInput,Alert,StyleSheet,FlatList, TouchableOpacity, Text, View, PanResponder, Animated, Dimensions  } from 'react-native';
import CustomDatePicker from "../Components/CustomDatePicker";
import { Picker } from '@react-native-picker/picker'; 
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons'; 
import { MaterialIcons } from '@expo/vector-icons'; 
import { useRoute } from '@react-navigation/native';
import axios from "axios"
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ENDPOINT_API } from './endpoint';
import { AlertError, AlertSuccess } from "../Components/AlertMessage";
const { width: screenWidth } = Dimensions.get('window');
import LoaderSVG from '../images/Loader.gif'
import rateLimit from 'axios-rate-limit';
import { FontAwesome5 } from '@expo/vector-icons'; // 
const axiosInstance = rateLimit(axios.create(), {
  maxRequests: 5, 
  perMilliseconds: 1000, 
});


import { useAuth } from '../Helpers/AuthContext';

const Calculation = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [loaderMM, setloaderMM] = useState(false);
  const [showError, setShowError] = useState(false);
  const [messageError,setmessageError] = useState("");
  const [messageSuccess,setmessageSuccess] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [farms, setFarms] = useState([]);
  const [selectedFarm, setSelectedFarm] = useState('');
  const [greenhouses, setGreenhouses] = useState([]);
  const [selectedGreenhouse, setSelectedGreenhouse] = useState('');
  const [loadingX, setLoadingX] = useState(true);
  const [role, setRole] = useState(null);
  const [selectedFarmObj, setSelectedFarmObj] = useState(null);  
  const [selectedGreenhouseObj, setSelectedGreenhouseObj] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [IDCurrent, setIDCurrent] = useState(null);
  const [imageData, setimageData] = useState(null);
  const fadeAnim = useRef(new Animated.Value(0)).current; 


  const togglePopup = () => {
    if (showPopup) {

      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,  
        useNativeDriver: true,
      }).start(() => setShowPopup(false));  
    } else {
      setShowPopup(true);

      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }
  };


  useFocusEffect(
    useCallback(() => {
      const x = async ()=>{
        const userId = await AsyncStorage.getItem('userId');
        const userIdNum = parseInt(userId);
        setIDCurrent(userIdNum);
      }
      x(); 
  }, []));

  
  useEffect(()=>{
    const x = async ()=>{
      const rolex = JSON.parse(await AsyncStorage.getItem('type'));
      setRole(rolex);
     }
    x();
  },[ ]);


  const [loading, setLoading] = useState(true);
  const route = useRoute();
  const { id } = route.params;
  const [predictionData,setpredictionData] = useState(null);
  const [predictionDataModifying,setpredictionDataModifying] = useState(null);
  const [dataImages, setDataImages] = useState(null);
  const [isModifyClicked, setisModifiedClicked] = useState(false)
  const navigation = useNavigation();
  const [plaqueId, setPlaqueId] = useState('');
  const [serre, setSerre] = useState('');
  const [ferme, setFerme] = useState('');
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(screenWidth)).current;
  const { settriggerIt, triggerIt } = useAuth();
  const [images, setImages] = useState([]);



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
          setFarms([]);
        }
      }
      catch(e){
        console.log(e.message);
        setmessageError("Oups, problème interne du serveur!");
        setShowError(true);
        setTimeout(() => {
          setShowError(false);
        }, 3000);
        setTimeout(() => {
          setmessageError("");
        }, 4000);

      } finally{
        setLoadingX(false);

      }
    }
    x();
  }, []);



  const [NameFarmX, setNameFarmX] = useState(null);
  const [NameSerreX, setNameSerreX] = useState(null);


  const fetchData = async () => {
    if (id) {
      try {
        setLoading(true);
        const token = await getToken();         
        const response = await axiosInstance.get(`${ENDPOINT_API}singlePrediction/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.status === 200) {
          const prediction = response.data[0];
          setpredictionData(prediction);
          setpredictionDataModifying(prediction);




          const fetchedDate = new Date(prediction.created_at); // Convert the fetched date string to a Date object

          // Check if the date is valid
          if (!isNaN(fetchedDate.getTime())) {
            setpredictionDataModifying(prediction);
            setSelectedDate(fetchedDate); // Set the date for the picker
          } else {
            console.error('Invalid date format:', prediction.created_at);
          }

        

          const userId = await AsyncStorage.getItem('userId');
          const userIdNum = parseInt(userId);

          const responseFarmsFetching = await axiosInstance.get(`${ENDPOINT_API}getFarmsWithGreenhouses/${userIdNum}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
  
          if(responseFarmsFetching.status  === 200){
             setFarms(responseFarmsFetching.data);
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

             setSelectedFarm(prediction.farm_id);
            const selectedFarm = responseFarmsFetching.data.find(farm => farm.id === prediction.farm_id);
            setNameFarmX(selectedFarm.name);
            console.warn(selectedFarm)
            if(selectedFarm){
              setNameFarmX(selectedFarm.name); 
            }
            else{
              setNameFarmX(null); 
            }
           
          

          //console.log("Prediction : ");
          //console.log(prediction);

          //console.log("All Farms With Serres :");
          //console.log(responseFarmsFetching.data)
          
          //console.log('Previous Farm :', selectedFarm); // Log the selected farm

          if (selectedFarm) {
            setGreenhouses(selectedFarm.serres); // Set greenhouses based on selected farm
            
            // Log the greenhouses to check if they are being set correctly
            //console.log('Available Greenhouses:', selectedFarm.serres);

            // Set the associated greenhouse if it exists
            if (selectedFarm.serres && selectedFarm.serres.length > 0) {
              const greenhouseId = prediction.serre_id; // This is the greenhouse id from the prediction
              //console.log('Predicted Greenhouse ID:', greenhouseId); // Log the predicted greenhouse ID

              // Check if the greenhouse ID exists in the available greenhouses
              const greenhouseExists = selectedFarm.serres.some(greenhouse => greenhouse.id === greenhouseId);
              
              if (greenhouseExists) {
                setSelectedGreenhouse(greenhouseId); // Set the greenhouse based on prediction data
                //console.log('Selected Greenhouse:', greenhouseId); // Confirm selection
                const selectedGreenhouseData = selectedFarm.serres.find(greenhouse => greenhouse.id === greenhouseId);
                setNameSerreX(selectedGreenhouseData.name);
              } else {
                setSelectedGreenhouse(null); // Reset if needed
              }
            } else {
              console.warn('No greenhouses available for the selected farm.');
              // Optionally reset the selected greenhouse
              setSelectedGreenhouse(null); // Reset if needed
            }
          } else {
            console.warn('Selected farm not found in the farms array for farm_id:', prediction.farm_id);
          }
  
          const response2 = await axiosInstance.get(`${ENDPOINT_API}predictions/${id}/images`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          if (response2.status === 200) {
            setimageData(response2.data[0]);
           }
           else{
            setimageData(null)
           }
        } else {
          setmessageError("Erreur 682: un problème lors de la récupération des données.");
          setShowError(true);
          setTimeout(() => {
            setShowError(false);
          }, 3000);
          setTimeout(() => {
            setmessageError("");
          }, 4000);
         }
      } catch (error) {
          console.error('Erreur :', error.message);
          setmessageError("Oups, Une erreur est survenue!");
          setShowError(true);
          setTimeout(() => {
            setShowError(false);
          }, 3000);
          setTimeout(() => {
            setmessageError("");
          }, 4000);
      } finally {
        setLoading(false);
      }
    }
  };
  

 





  useEffect(()=>{
    fetchData();
  },[id]);


  


  const formatDate = (dateString) => {
    const date = new Date(dateString);  
    const day = String(date.getDate()).padStart(2, '0');  
    const month = String(date.getMonth() + 1).padStart(2, '0');  
    const year = date.getFullYear();  
    return `${day}/${month}/${year}`; 
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




  const handleSaveData = async (id)=>{

    setloaderMM(true);

    let dataJOJO = {
      ...predictionDataModifying,
      farm_id : selectedFarm, 
      serre_id : selectedGreenhouse, 
      created_at : formatDateForCreatedAt(selectedDate)
    }


   try{
      const token = await getToken();         
      const response = await axiosInstance.patch(`${ENDPOINT_API}predictions/${id}`, dataJOJO , {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if(response.status === 200){
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
        setmessageError("Oups, Une erreur est survenue lors de la modification des informations!");
        setShowError(true);
              setTimeout(() => {
                setShowError(false);
              }, 3000);
              setTimeout(() => {
                setmessageError("");
              }, 4000);
      }
      setisModifiedClicked(false);
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
      setisModifiedClicked(false);
   } finally{
    setloaderMM(false);
   }

  }
  




  const handleFarmChange = (farmId) => {
    setSelectedFarm(farmId);
    setSelectedGreenhouse(null);
    setSelectedGreenhouseObj(null);
    const selectedFarm = farms.find(farm => farm.id === farmId);
    setSelectedFarmObj(selectedFarm); // Set selected farm object

    if (selectedFarm && selectedFarm.serres && Array.isArray(selectedFarm.serres)) {
      setGreenhouses(selectedFarm.serres);
      setSelectedGreenhouse(''); // Reset greenhouse when changing farm
    } else {
      setGreenhouses([]);
    }
  };



  
  const handleGreenhouseChange = (serreId) => {
    setSelectedGreenhouse(serreId);
    
    const selectedSerre = greenhouses.find(serre => serre.id === serreId);
    setSelectedGreenhouseObj(selectedSerre); // Set selected greenhouse object
  };


  const [loaderD, setLoaderD] = useState(false);
  const [isSupprimerClicked, setIsSupprimerClicked] = useState(false);
  
  const handleLickDelete = async()=>{
    try{
      if(predictionData){
        setLoaderD(true);
        const token = await getToken();

        const response = await axios.delete(`${ENDPOINT_API}predictions/${predictionData.id}`,{
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if(response.status === 200){
          setIsSupprimerClicked(false);
          navigation.goBack();
         }
        else{
          setIsSupprimerClicked(false);
          setmessageError("Oups, un incident est survenu lors de la suppression.");
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
      setmessageError("Oups, problème interne du serveur!");
      setShowError(true);
      setTimeout(() => {
        setShowError(false);
      }, 3000);
      setTimeout(() => {
        setmessageError("");
      }, 4000);    } finally{
      setLoaderD(false);
    }
  }




  return (
    <>

    <AlertError message={messageError} visible={showError} />
    <AlertSuccess message={messageSuccess} visible={showSuccess} />

      {showPopup && (
        <Animated.View style={[showPopup ? styles.popupContainer : styles.popupContainerNot, { opacity: fadeAnim }]}>
          <TouchableOpacity activeOpacity={1} style={styles.popupTouchable} onPress={togglePopup}>
            <Image
              style={styles.popupBackground}
              source={{ uri: imageData && imageData.name }}  
            />
            <Text style={styles.popupText}>Cliquez n'importe où pour fermer</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
      
      {
        isSupprimerClicked && 
        <View style={{
          position: 'absolute', 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0, 
          zIndex : 999999999,
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

              Confirmer la suppression
            
            </Text>
            <Text style={{ 
              fontSize: 17, 
              fontWeight: '400', 
              marginBottom: 25 
            }}>

              Voulez-vous vraiment supprimer cet élément ? Cette action est irréversible.

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
                disabled={loaderD}
                >
                <Text style={{ color: 'black', fontWeight: 'bold' }}>
                Annuler
                </Text>
              </TouchableOpacity>


              <TouchableOpacity style={{
                backgroundColor: '#AF0000', 
                paddingVertical: 13,
                width : "67%",
                borderRadius: 5,
                alignItems : "center", 
                justifyContent : "center",                
                borderRadius: 5
              }}
                disabled={loaderD}
                onPress={()=>{
                  handleLickDelete();
                }}
              >
                <Text style={{ color: 'white', fontWeight: 'bold' }}>
                {
                  loaderD ? 
                  "Suppression en cours..."
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
    !loading && predictionData && predictionDataModifying  ?   

    <View style={styles.container}>

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


          <Text style={styles.titleText}>{isModifyClicked ? "Modifier le Calcul" : "Détails du Calcul"}</Text>
          <TouchableOpacity onPress={toggleMenu} style={styles.menu}>
            <Ionicons name="menu" size={24} color="#3E6715" />
          </TouchableOpacity>
        </View>

        {isModifyClicked  ? 
          <> 
          {
            predictionDataModifying && 
            <>
              <Text style={styles.label}>Plaque</Text>
              <TextInput
                style={styles.input}
                placeholder="Veuillez saisir l’ID de la plaque..."
                value={predictionDataModifying.plaque_id}
                onChangeText={(text) =>
                  setpredictionDataModifying((prevData) => ({
                    ...prevData,
                    plaque_id: text,  
                  }))
                }
              />
 


              <Text style={styles.label}>Ferme</Text>
              <View style={styles.pickerWrapper}>
                <Picker
                  selectedValue={selectedFarm}
                  style={styles.picker}
                  onValueChange={handleFarmChange}
                  enabled={!loadingX}
                >
                  {/* Render the default option only if there's no selected farm */}
                  {!selectedFarm && (
                    <Picker.Item label="Sélectionnez une ferme" value="" />
                  )}
                  {farms && farms.map(farm => (
                    <Picker.Item key={farm.id} label={farm.name} value={farm.id} />
                  ))}
                </Picker>
              </View>

              <Text style={styles.label}>Serre</Text>
              <View style={styles.pickerWrapper}>
                <Picker
                  selectedValue={selectedGreenhouse}
                  style={styles.picker}
                  onValueChange={handleGreenhouseChange}
                  enabled={!!selectedFarm}
                >
                  {/* Render the default option only if there's no selected greenhouse */}
                  {!selectedGreenhouse && (
                    <Picker.Item label="Sélectionnez une serre" value="" />
                  )}
                  {greenhouses && greenhouses.map(serre => (
                    <Picker.Item key={serre.id} label={serre.name} value={serre.id} />
                  ))}
                </Picker>
              </View>



                    
              <Text style={styles.label}>Date de création</Text>
              <CustomDatePicker selectedDate={selectedDate} onDateChange={setSelectedDate} />
               
            </>
          }
          </>
         : (
          <>

            <View style={styles.cardKLKLKL}>
              <View style={styles.cardHeaderKLKLKL}>
                <FontAwesome5 name="info-circle" size={24} color="#4A90E2" />
                <Text style={styles.cardTitleKLKLKL}>Informations du Calcul</Text>
              </View>
              <View style={styles.cardContentKLKLKL}>
                <Text style={styles.infoKLKLKL}>
                  <Text style={styles.labelKLKLKL}>Nom de ferme: </Text>
                  {loading ? "--" : NameFarmX ? NameFarmX : "---"}
                </Text>
                <Text style={styles.infoKLKLKL}>
                  <Text style={styles.labelKLKLKL}>Nom de serre: </Text>
                  {loading ? "--" : NameSerreX && NameSerreX  }
                </Text>
                <Text style={styles.infoKLKLKL}>
                  <Text style={styles.labelKLKLKL}>ID de plaque: </Text>
                  {loading ? "--" : predictionData.plaque_id ? predictionData.plaque_id : "---"  }
                </Text>
                <Text style={styles.infoKLKLKL}>
                  <Text style={styles.labelKLKLKL}>Date de création: </Text>
                  {loading ? "--" : formatDate(predictionData.created_at)}
                </Text>
                <TouchableOpacity onPress={togglePopup} style={styles.saveButton2}>
                  <Text style={styles.buttonTextB} >
                    Voir l'image
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.cardKLKLKL}>
              <View style={styles.cardHeaderKLKLKL}>
                <FontAwesome5 name="chart-bar" size={24} color="#4CAF50" />
                <Text style={styles.cardTitleKLKLKL}>Résultats du Calcul</Text>
              </View>
              <View style={styles.cardContentKLKLKL}>
                <Text style={styles.infoKLKLKL}>
                  <Text style={styles.label}>Pourcentage: </Text>
                  {loading ? "--" : `${predictionData.result}%`}
                </Text>
                <Text style={styles.infoKLKLKL}>
                  <Text style={styles.label}>Nombre de mouches: </Text>
                  {loading ? "--" : imageData?.class_A}
                </Text>
                <Text style={styles.infoKLKLKL}>
                  <Text style={styles.label}>Nombre de mineuses: </Text>
                  {loading ? "--" : imageData?.class_B}
                </Text>
                <Text style={styles.infoKLKLKL}>
                  <Text style={styles.label}>Nombre de Thrips: </Text>
                  {loading ? "--" : imageData?.class_C}
                </Text>
              </View>
            </View>

 


          </>
        )}

      </ScrollView>


      {
        isModifyClicked ? 
        <View style={styles.buttonRow1} >
          <TouchableOpacity disabled={loaderMM} onPress={()=>{ setisModifiedClicked(!isModifyClicked);setpredictionDataModifying(predictionData); }} style={styles.cancelButton}>
            <Text style={styles.buttonTextB}>Annuler</Text>
          </TouchableOpacity>
          <TouchableOpacity  disabled={loaderMM} style={styles.saveButton} onPress={()=>{ handleSaveData(predictionData.id); }} >
            <Text style={styles.buttonTextW}>{loaderMM ? "Modification en cours..." : "Sauvegarder"}</Text>
          </TouchableOpacity>
        </View>
        :
        <View style={styles.buttonRow1} >
       
          <TouchableOpacity disabled={loaderD} onPress={()=>{setIsSupprimerClicked(true); }} style={styles.saveButton11}>
            <Text style={styles.buttonTextW}>Supprimer le Calcul</Text>
          </TouchableOpacity>

          <TouchableOpacity  disabled={loaderD}  onPress={()=>{ setisModifiedClicked(!isModifyClicked) }} style={styles.saveButton1}>
            <Text style={styles.buttonTextW}>Modifier le Calcul</Text>
          </TouchableOpacity>
       
        </View>
      }

      
    </View>
    :
      <View style={{ height : "100%" , width : "100%", backgroundColor  :"white", alignItems : "center", justifyContent : "center" }} > 
        <Image
          source={LoaderSVG}  
          style={styles.imageJOZNJORSFDOJFSWNVDO2} 
        />
      </View>

  }
   
   
      
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
  saveButton2: {
    backgroundColor: '#EAFFD6',
    borderRadius: 10,
    borderColor : "#487C15",
    paddingVertical: 12,
    marginTop: 7,
    paddingHorizontal: 16,
    width: '96%',
    alignItems: 'center',
  },
  saveButton1 : {
    backgroundColor: '#487C15',
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 16,
    width: '48%',
    alignItems: 'center',
  },
  saveButton11 : {
    backgroundColor: '#AF0000',
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 16,
    width: '48%',
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
    marginLeft: 20 ,
    marginVertical: 16,
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
  }, imageJOZNJORSFDOJFSWNVDO : {
    height : 23, width : 23
  },
  imageJOZNJORSFDOJFSWNVDO2 : {
    height : 39, width : 39

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
  
  infoContainer: {
    marginBottom: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom : 11
  },
  titleXX: {
    fontSize: 16,
    fontWeight: "bold",
    color: '#000000',
    color : "black",
    marginBottom : 11
  },
  info: {
    fontSize: 16,
    color: '#000000',
    marginBottom: 6
  },
  resultsContainer: {
    marginBottom: 20,
  },
  carouselContainer: {
    position: 'relative',
    alignItems : "center"
  },

  carouselImage: {
    width: screenWidth * 0.3,   
    height: 170,  
    marginHorizontal: 10,
    resizeMode: 'cover',
    borderRadius: 10,
  },
  leftButton: {
    position: 'absolute',
    top: '40%',
    left: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 10,
    borderRadius: 50,
  },
  rightButton: {
    position: 'absolute',
    top: '40%',
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 10,
    borderRadius: 50,
  },
  carouselButton: {
    backgroundColor: '#8DC94B',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 500,
    marginLeft : 7,
    marginRight : 7,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  dot: {
    height: 8.5,
    width: 8.5,
    borderRadius: 5,
    marginTop : 10,
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: '#8DC94B',
  },
  inactiveDot: {
    backgroundColor: '#D5D5D5',
  },
  popupContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    height : '100%',
    width : "100%",
    zIndex: 99999999999,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  popupContainerNot : {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    height : '0%',
    width : "0%",
    zIndex: 0,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  popupBackground: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  popupText: {
    color: '#fff',
    fontSize: 24,
    backgroundColor : "black",
    textAlign: 'center',
  },
  PopUpTitii : {
    backgroundColor : "black", 
    width : "100%"
  },
  popupTouchable: {
    width: '100%',
    height: '100%',
  },
  popupBackground: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },


  containerKLKLKL: {
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  cardKLKLKL: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    width : "98.1%",
    margin : "auto", 
    borderWidth : 1, 
    borderColor : "#eee"
  },
  cardKLKLKL2: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    width : "98.1%",
    margin : "auto", 
    backgroundColor : "black",
    alignItems : "center", 
    justifyContent : "center"
  },
  cardHeaderKLKLKL: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardTitleKLKLKL: {
    marginLeft: 10,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  cardContentKLKLKL: {
    paddingLeft: 10,
  },
  infoKLKLKL: {
    fontSize: 16,
    marginBottom: 8,
    color: '#666',
  },
  labelKLKLKL: {
    fontWeight: 'bold',
    color: '#333',
  },


});
export default Calculation;


