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

const axiosInstance = rateLimit(axios.create(), {
  maxRequests: 5, // maximum number of requests
  perMilliseconds: 1000, // time window in milliseconds
});


const convertToMySQLDateTime = (dateString) => {
  const [day, month, year] = dateString.split('/');

  // Create a date string in the format "yyyy-mm-dd HH:mm:ss"
  // Assuming you want to set the time to midnight (00:00:00)
  return `${year}-${month}-${day} 00:00:00`;
};




const Carousel = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goNext = () => {
    if (currentIndex < images.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const goPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <View style={{ alignItems: 'center' }}>

      <FlatList
        data={[images[currentIndex]]}
        horizontal
        pagingEnabled
        renderItem={({ item }) => (
          <Image source={item} style={styles.carouselImage} />
        )}
        keyExtractor={(item, index) => index.toString()}
        showsHorizontalScrollIndicator={false}
      />

      <View style={{ flexDirection: 'row', marginTop: 5 }}>
        {images.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              index === currentIndex ? styles.activeDot : styles.inactiveDot,
            ]}
          />
        ))}
      </View>

       <View style={{ flexDirection: 'row', marginTop: 10 }}>
        <TouchableOpacity
          onPress={goPrevious}
          disabled={currentIndex === 0}
          style={[
            styles.carouselButton,
            currentIndex === 0 && { backgroundColor: '#ccc' },
          ]}
        >
          <Ionicons name="chevron-back-outline" size={24} color="white" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={goNext}
          disabled={currentIndex === images.length - 1}
          style={[
            styles.carouselButton,
            currentIndex === images.length - 1 && { backgroundColor: '#ccc' },
          ]}
        >
          <Ionicons name="chevron-forward-outline" size={24} color="white" />
        </TouchableOpacity>
      </View>

 
    </View>
  );
};




import { useAuth } from '../Helpers/AuthContext';

const Calculation = () => {

  const [loaderMM, setloaderMM] = useState(false);
  const [showError, setShowError] = useState(false);
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
            console.log("Not Fetched All Farms With Their Serres");
          }

          setSelectedFarm(prediction.farm_id); // Set selected farm
          const selectedFarm = responseFarmsFetching.data.find(farm => farm.id === prediction.farm_id);

           
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
              } else {
                console.warn('Greenhouse ID does not exist in the selected farm’s greenhouses:', greenhouseId);
                // Optionally reset the selected greenhouse if it doesn't exist
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
            setDataImages(response2.data[0]);
          }
        } else {
          Alert.alert('Erreur lors de la récupération de données.');
        }
      } catch (error) {
        console.error('Erreur :', error.message);
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
    
    // Format: YYYY-MM-DDTHH:MM:SSZ
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}Z`;
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
        Alert.alert('Modified Successfully ! ');
      }
      else{
        Alert.alert('Oops...');
      }
      setisModifiedClicked(false);
    }
   catch(e){
      Alert.alert('Oops...');
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




  return (
    <>

    {

    predictionData && predictionDataModifying &&  

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
                  {farms.map(farm => (
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
                  {greenhouses.map(serre => (
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
            <View style={styles.infoContainer}>
              <Text style={styles.title}>Informations du Calcul</Text>
              <Text style={styles.info}>&nbsp;&nbsp;&nbsp;• ID de ferme: {loading ? "--" : predictionData.farm_id}</Text>
              <Text style={styles.info}>&nbsp;&nbsp;&nbsp;• ID de serre: {loading ? "--" : predictionData.serre_id}</Text>
              <Text style={styles.info}>&nbsp;&nbsp;&nbsp;• ID de plaque: {loading ? "--" : predictionData.plaque_id}</Text>
              <Text style={styles.info}>&nbsp;&nbsp;&nbsp;• Date de création: {loading ? "--" : formatDate(predictionData.created_at)}</Text>
              <Text style={styles.info}>&nbsp;&nbsp;&nbsp;• Date de mise à jour: {loading ? "--" : formatDate(predictionData.updated_at)}</Text>
            </View>

            <View style={styles.resultsContainer}>
              <Text style={styles.title}>Résultats du Calcul</Text>
              <Text style={styles.info}>&nbsp;&nbsp;&nbsp;• Pourcentage: {loading ? "--" : `${predictionData.result}%`}</Text>
              <Text style={styles.info}>&nbsp;&nbsp;&nbsp;• Nombre de mouches: {loading ? "--" : dataImages?.class_A}</Text>
              <Text style={styles.info}>&nbsp;&nbsp;&nbsp;• Nombre de mineuses: {loading ? "--" : dataImages?.class_B}</Text>
              <Text style={styles.info}>&nbsp;&nbsp;&nbsp;• Nombre de Thrips: {loading ? "--" : dataImages?.class_C}</Text>
            </View>

            <View style={styles.carouselContainer}>
              <Carousel images={images} />
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
          <TouchableOpacity onPress={()=>{ setisModifiedClicked(!isModifyClicked) }} style={styles.saveButton1}>
            <Text style={styles.buttonTextW}>Modifier le calcul</Text>
          </TouchableOpacity>
        </View>
      }

      
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
  saveButton1 : {
    backgroundColor: '#487C15',
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 16,
    width: '100%',
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
});
export default Calculation;


