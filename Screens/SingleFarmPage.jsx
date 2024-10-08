import { saveToken, getToken, deleteToken } from '../Helpers/tokenStorage';
import React, { useState, useEffect, useRef } from 'react';
import { Image,TextInput, ScrollView, StyleSheet, TouchableOpacity, Text, View, PanResponder, Animated, Dimensions, SafeAreaView, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import CardFarm from '../Components/CardFarm';
import { useAuth } from '../Helpers/AuthContext';
const { width: screenWidth } = Dimensions.get('window');
import axios from "axios"
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { formatDate } from '../Components/fct';
import { formatLocation } from '../Helpers/locationTransf';
 



const SingleFarmPage = () => {


  const [role, setRole] = useState(null);

  useEffect(()=>{
    const x = async ()=>{
      const rolex = JSON.parse(await AsyncStorage.getItem('type'));
      setRole(rolex);
     }
    x();
  },[ ]);

    const [isMenuVisible, setIsMenuVisible] = useState(false);
    const [loading, setLoading] = useState(true);
    const slideAnim = useRef(new Animated.Value(screenWidth)).current;
    const navigation = useNavigation();
    const { settriggerIt, triggerIt } = useAuth();
    const [dataFarm,setdataFarm] = useState(null);
    const [dataSerre,setdataSerre] = useState(null);
    const route = useRoute();
    const { id } = route.params;
    const [isModifyClicked, setIsModifyClick] = useState(false)


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

  

  useFocusEffect(
    useCallback(() => {

      const fetchData = async () => {
        if(id !== null && id !== undefined){
          try {
            setLoading(true);  
            const token = await getToken(); 
            const response = await axios.get(`http://10.0.2.2:8000/api/farms/getSingleFarm/${id}`, {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });
            
            if (response.status === 200) {
              setdataFarm(response.data[0]);
              const response2 = await axios.get(`http://10.0.2.2:8000/api/serres-per-farm/${id}`, {
                headers: {
                  'Authorization': `Bearer ${token}`
                }
              });
              if (response2.status === 200) {
                setdataSerre(response2.data);
                console.log(response2.data);
              }
              else{
                setdataSerre([]);
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
      

      fetchData();

      return () => setLoading(false);  
  
    }, [navigation, id])
  );


  
  


  return (
    <>
      <View style={styles.container}>
          <ScrollView>

                <View style={styles.titleContainer}>
                  <Text style={styles.titleText}>Ma Ferme</Text>
                  <TouchableOpacity onPress={toggleMenu} style={styles.menu}>
                    <Ionicons name="menu" size={24} color="#3E6715" />
                  </TouchableOpacity>
                </View>
                
              {
                loading?
                <View style={{ height : 600, alignItems : "center", justifyContent : "center" }} >           
                  <Text style={{ fontSize : 15, textAlign : "center" }}>Chargement...</Text>
                </View>
                :
                <>
                  {
                      
                      dataFarm && 
                      <>
                        <View style={styles.profileContainer}>
                          <Image
                            style={styles.profileImage}
                            source={{ uri: 'https://i.pinimg.com/736x/3b/e3/97/3be397f7474db66d2b1f0f61fde856b7.jpg' }}  
                          />
                        </View>


                        <Text style={{marginLeft: 23, marginBottom : 20, fontSize : 17, fontWeight : "800"}}>Informations</Text>


                        <View style={styles.rowXXX}>
                          <Text style={styles.label}>Appellation :</Text>
                          <Text style={styles.value}>{dataFarm.name}</Text>
                        </View>

                        <View style={styles.rowXXX}>
                          <Text style={styles.label}>Localisation :</Text>
                          <Text style={styles.value}>{formatLocation(dataFarm.location)}</Text>
                        </View>

                        <View style={styles.rowXXX}>
                          <Text style={styles.label}>Superficie en m² :</Text>
                          <Text style={styles.value}>{dataFarm.size}</Text>
                        </View>

                        <View style={styles.rowXXX}>
                          <Text style={styles.label}>Date de création :</Text>
                          <Text style={styles.value}>{formatDate(dataFarm.created_at)}</Text>
                        </View>

                        <View style={styles.hr} />

                        <Text style={{marginLeft: 23, marginBottom : 20, fontSize : 17, fontWeight : "800"}}>Serres associées</Text>
                        {
                          dataSerre && 
                          <>
                          {
                            dataSerre.length === 0 ? 
                            <View style={{ height : 80, alignItems : "center", justifyContent : "center" }} >           
                              <Text style={{ color : "gray",fontSize : 15, textAlign : "center" }}>Aucune donnée</Text>
                            </View>
                            :
                            dataSerre.map((serre, index)=>{
                              return(
                                <TouchableOpacity
                                    key={index}
                                    style={{
                                      height: 50,
                                      flexDirection: 'row',
                                      justifyContent: 'space-between',
                                      alignItems: 'center',
                                      paddingHorizontal: 10,
                                      backgroundColor: '#f0f0f0', 
                                      marginBottom: 10,
                                      borderRadius: 10,
                                      marginRight : 23, 
                                      marginLeft : 23
                                    }}
                                  >
                                    <Text>{serre.name}</Text>   
                                    
                                    <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }}>
                                      <Ionicons name="settings-outline" style={styles.icon} size={24} color="#5B5B5B" />
                                    </TouchableOpacity>
                                  </TouchableOpacity>
                              )
                            })
                          }
                            <TouchableOpacity onPress={()=>{ navigation.navigate('AjouterUneSerre', { id: id });}}  style={styles.saveButtonUZUQSOEFD}>
                              <Text style={styles.text487C15}>+ Ajouter une Serre</Text>
                            </TouchableOpacity>
                          </>
                        }

                      </>
                    }
                </>
              }
          </ScrollView>


          {
            !isModifyClicked ? 
            <View style={styles.buttonContainer}>
              <TouchableOpacity onPress={()=>{setIsModifyClick(!isModifyClicked)}}  style={styles.saveButton}>
                <Text style={styles.buttonTextWhite}>Modifier la ferme</Text>
              </TouchableOpacity>
            </View>
            :
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.cancelButton}  onPress={()=>{setIsModifyClick(!isModifyClicked)}} >
                <Text style={styles.buttonTextBlack}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton}  onPress={()=>{}} >
                <Text style={styles.buttonTextWhite}>Sauvegarder</Text>
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
    paddingTop: 23,
  },
  titleContainer: {
    marginBottom : 23,
    alignItems: 'center',
    position : "relative"
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
    borderRadius: 15,
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

  roleText: {
    marginTop: 1,
    fontSize: 14,
    color : "#B8B8B8",
    fontWeight: '500',
  },
  input: {
    height: 40,
    paddingRight: 22,
    marginLeft : 23, 
    marginRight : 23,
    fontSize : 17
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft: 23, 
    position: 'absolute',  
    bottom: 20,           
    left: 0,
    right: 0,
    marginRight: 23,
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
    flex: 1,
    marginLeft: 8,
    paddingVertical: 12,
    backgroundColor: '#487C15',
    alignItems: 'center',
    borderRadius: 8,
  },
  saveButtonUZUQSOEFD : {
    flex: 1,
    width : 200,
    margin : "auto",
    paddingVertical:9,
    backgroundColor: '#DAFFB7',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth : 1, 
    borderColor : 'white'
  },
  text487C15 : {
    color : "#487C15",
    fontSize : 16,
    fontWeight : "500"
  },
  buttonTextWhite: {
    color: '#fff',
    fontSize: 16,
  },
  buttonTextBlack: {
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
  modifierVotreX : {
    height: 21,
    marginTop : 6 ,
    width : "auto",
    justifyContent : "space-between",
    marginBottom: 16,
    flexDirection: 'row',      
    justifyContent: 'space-between',
    alignItems: 'center', 
    marginLeft : 50, 
    marginRight : 50
  },
  modifierVotreXText : {
    color: "#6D6D6D",
    fontSize : 16
  }
});

export default SingleFarmPage;
