import { saveToken, getToken, deleteToken } from '../Helpers/tokenStorage';
import React, { useState, useEffect, useRef } from 'react';
import {Image ,ScrollView, TextInput,StyleSheet,FlatList, TouchableOpacity, Text, View, PanResponder, Animated, Dimensions  } from 'react-native';
 import { Picker } from '@react-native-picker/picker'; 
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons'; 
import { MaterialIcons } from '@expo/vector-icons'; 
import { useRoute } from '@react-navigation/native';
import axios from "axios"
import AsyncStorage from '@react-native-async-storage/async-storage';


const { width: screenWidth } = Dimensions.get('window');


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


  const [role, setRole] = useState(null);

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
  const [DataImages, setDataImages] = useState(null);
  const [isModifyClicked, setisModifyClicked] = useState(false)
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






  const fetchData = async () => {
    if(id){
      try {
        setLoading(true);
        /*
        
          const userId = await AsyncStorage.getItem('userId');
          const userIdNum = parseInt(userId);

        */
        const token = await getToken();         
        const response = await axios.get(`http://10.0.2.2:8000/api/singlePrediction/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.status === 200) {
          setpredictionData(response.data[0]);
          const response2 = await axios.get(`http://10.0.2.2:8000/api/predictions/${id}/images`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          if (response2.status === 200) {
            console.log("Fetched images:", response2.data); 
            setDataImages(response2.data[0]);
            if (response2.data.length > 1) {
              const imageArray = response2.data.map((img) => {
                const imageUrl = `http://your-server.com/path/to/images/${img.name}`;  
                return { uri: imageUrl };
              });
              setImages(imageArray);
              console.log("Fetched images:", imageArray); 
            } else {
              setImages([{ uri: 'https://img.freepik.com/photos-gratuite/image-fond-ecran-aquarelle-bleu-acier-clair_53876-94665.jpg' }]);
              console.log("Using default image:", 'https://img.freepik.com/photos-gratuite/image-fond-ecran-aquarelle-bleu-acier-clair_53876-94665.jpg'); 
            }
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

  


  return (
    <>
    <View style={styles.container}>

        <ScrollView>
          <View style={styles.titleContainer}>
            <Text style={styles.titleText}>{isModifyClicked ? "Modifier le Calcul" : "Détails du Calcul"}</Text>
            <TouchableOpacity onPress={toggleMenu} style={styles.menu}>
              <Ionicons name="menu" size={24} color="#3E6715" />
            </TouchableOpacity>
          </View>
       
          {
            isModifyClicked ? 
            <>
              <Text style={styles.label}>Plaque</Text>
              <TextInput
                style={styles.input}
                placeholder="Veuillez saisir l’ ID de la plaque..."
                value={plaqueId}
                onChangeText={setPlaqueId}
              />

              <Text style={styles.label}>Serre</Text>
              <View style={styles.pickerWrapper}>
                <Picker
                  selectedValue={serre}
                  style={styles.picker}
                  onValueChange={(itemValue) => setSerre(itemValue)}
                >
                  <Picker.Item label="Veuillez saisir la valeur..." value="" />
                  <Picker.Item label="Option 1" value="option1" />
                  <Picker.Item label="Option 2" value="option2" />
                </Picker>
              </View>

              <Text style={styles.label}>Ferme</Text>
              <View style={styles.pickerWrapper}>
                <Picker
                  selectedValue={ferme}
                  style={styles.picker}
                  onValueChange={(itemValue) => setFerme(itemValue)}
                >
                  <Picker.Item label="Veuillez saisir la valeur..." value="" />
                  <Picker.Item label="Option 1" value="option1" />
                  <Picker.Item label="Option 2" value="option2" />
                </Picker>
              </View>


              <View style={styles.buttonRow}>
                <TouchableOpacity style={styles.buttonOutline}>
                  <Text style={styles.buttonTextB}>Prendre une photo</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttonOutline}>
                  <Text style={styles.buttonTextB}>Choisir une image</Text>
                </TouchableOpacity>
              </View>
            </>
            :
            <>
              <View style={styles.infoContainer}>
                <Text style={styles.title}>Informations du Calcul</Text>
                <Text style={styles.info}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;•&nbsp;ID de ferme: {loading ? "--" : predictionData.farm_id} </Text>
                <Text style={styles.info}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;•&nbsp;ID de serre: {loading ? "--" : predictionData.serre_id}</Text>
                <Text style={styles.info}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;•&nbsp;ID de plaque: {loading ? "--" : predictionData.plaque_id}</Text>
                <Text style={styles.info}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;•&nbsp;Date de création: {loading ? "--" : formatDate(predictionData.created_at)}</Text>
                <Text style={styles.info}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;•&nbsp;Date de mise à jour: {loading ? "--" : formatDate(predictionData.updated_at)}</Text>
              </View>

              <View style={styles.resultsContainer}>
                <Text style={styles.title}>Résultats du Calcul</Text>
                <Text style={styles.info}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;•&nbsp;Pourcentage: {loading ? "--" : <>{predictionData.result}%</>}</Text>
                <Text style={styles.info}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;•&nbsp;Nombre de mouches:  {loading ? "--" : <>{DataImages && DataImages.class_A}</>} </Text>
                <Text style={styles.info}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;•&nbsp;Nombre de mineuses:  {loading ? "--" : <>{DataImages && DataImages.class_B}</>} </Text>
                <Text style={styles.info}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;•&nbsp;Nombre de Thrips:  {loading ? "--" : <>{DataImages && DataImages.class_C}</>} </Text>
              </View>

              <View style={styles.carouselContainer}>
                <Text style={styles.titleXX}>Images du Calcul</Text>
                {
                  <Carousel images={images} />
                }
              </View> 
            </>
          }

      </ScrollView>


      {
        isModifyClicked ? 
        <View style={styles.buttonRow1} >
          <TouchableOpacity onPress={()=>{ setisModifyClicked(!isModifyClicked) }} style={styles.cancelButton}>
            <Text style={styles.buttonTextB}>Annuler</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.saveButton} onPress={()=>{ setisModifyClicked(!isModifyClicked) }} >
            <Text style={styles.buttonTextW}>Enregistrer</Text>
          </TouchableOpacity>
        </View>
        :
        <View style={styles.buttonRow1} >
          <TouchableOpacity onPress={()=>{ setisModifyClicked(!isModifyClicked) }} style={styles.saveButton1}>
            <Text style={styles.buttonTextW}>Modifier le calcul</Text>
          </TouchableOpacity>
        </View>
      }

      
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
                <Text style={styles.menuText}>Mes Clients</Text>
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
    padding: 23,
  },
  titleContainer: {
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
  },
  closeButton: {
    position: 'absolute',
    top: 20,
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
    width: screenWidth * 0.8,   
    height: 233,  
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


