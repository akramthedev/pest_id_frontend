import { saveToken, getToken, deleteToken } from '../Helpers/tokenStorage';
import React, { useState, useEffect, useRef } from 'react';
import { Image,TextInput, ScrollView, StyleSheet, TouchableOpacity, Text, View, PanResponder, Animated, Dimensions, SafeAreaView, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import CardPersonal from '../Components/CardPersonel';
import { MaterialIcons } from '@expo/vector-icons';
import CardFarm from '../Components/CardFarm';
import axios from "axios"
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { ENDPOINT_API } from './endpoint';
import { AlertError, AlertSuccess } from "../Components/AlertMessage";
const { width: screenWidth } = Dimensions.get('window');
import LoaderSVG from '../images/Loader.gif'


const personnelData = [
    {
      id: '1',
      name: 'Jack Rosso',
      email: 'jack.rosso@greenhouse.com',
      phone: '+212 673 486 082',
      farm: 'Ferme : Green House',
      image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
    }, 
      {
        id: '6',
        name: 'Said Abdou',
        email: 'said.abdou@greenhouse.com',
        phone: '+212 673 486 084',
        farm: 'Ferme : Green House',
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Outdoors-man-portrait_%28cropped%29.jpg/800px-Outdoors-man-portrait_%28cropped%29.jpg",
      },
  ];
 
  import { useAuth } from '../Helpers/AuthContext';


const AdminProfile = () => {
  const [showError, setShowError] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const { settriggerIt, triggerIt } = useAuth();
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [userData,setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  const slideAnim = useRef(new Animated.Value(screenWidth)).current;
  const navigation = useNavigation();

  const route = useRoute();
  const { id } = route.params;
 
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



  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        if(id !== null && id !== undefined){
          try {
            setLoading(true);
    
            const token = await getToken(); 
            
            const response = await axios.get(`${ENDPOINT_API}user/${id}`, {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });
            
            if (response.status === 200) {
              setUserData(response.data);
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
  
    }, [navigation])
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
                    {
                    loading && 
                    <View style={{ position: "absolute", left :23 ,zIndex: 10,}} > 
                      <Image
                        source={LoaderSVG}  
                        style={styles.imageJOZNJORSFDOJFSWNVDO} 
                      />
                    </View>
                  }
                  <Text style={styles.titleText}>Profil Admin</Text>
                  <TouchableOpacity onPress={toggleMenu} style={styles.menu}>
                    <Ionicons name="menu" size={24} color="#3E6715" />
                  </TouchableOpacity>
                </View>
                

                {
            userData ? 
            <>
              <View style={styles.profileContainer}>
                <Image
                  style={styles.profileImage}
                  source={{ uri: userData && userData.image ? userData.image : "https://cdn-icons-png.flaticon.com/512/149/149071.png"  }}  
                />
              </View>

              <View style={styles.modifierVotreX} >
                  <Text style={styles.modifierVotreXText}>Nom et Prénom</Text>
                  <Text>{userData.fullName ? userData.fullName : "--"}</Text>
              </View>
              <View style={styles.modifierVotreX} >
                  <Text style={styles.modifierVotreXText}>Adresse email</Text>
                  <Text>{userData.email}</Text>
              </View>

              <View style={styles.modifierVotreX} >
                  <Text style={styles.modifierVotreXText}>Société</Text>
                  <Text>--</Text>
              </View>

              <View style={styles.modifierVotreX} >
                  <Text style={styles.modifierVotreXText}>Téléphone</Text>
                  <Text>{userData.mobile ? userData.mobile : "--"}</Text>
              </View>

              <View style={styles.modifierVotreX} >
                  <Text style={styles.modifierVotreXText}>Date de création</Text>
                  <Text>{formatDate(userData.created_at)}</Text>
              </View>
              

           


              <View style={styles.modifierVotreX} >
                  <Text style={styles.modifierVotreXText}>Liste des personels : </Text>
              </View>

              {
                personnelData && personnelData.map((data, index)=>{
                    return(
                    <CardPersonal item={data}  key={index}/>
                    )
                })
              }

              <TouchableOpacity style={styles.modifierVotreXZUOQEFD} >
                <Text style={styles.modifierVotreXTextesfvd}>Modifier ses informations&nbsp;&nbsp;</Text>
                <Ionicons name="arrow-forward" size={20} color="white" />
              </TouchableOpacity>



            </>
            :
            <>
            <View style={{ height : 600, alignItems : "center", justifyContent : "center" }} >           
              <Text style={{ fontSize : 15, textAlign : "center" }}>Chargement...</Text>
            </View>
            </>
          }
          </ScrollView>
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
    marginTop : 18,
    alignItems: 'center',
    position : "relative"
  },
  menu: {
    position: "absolute",
    right: 23,
    zIndex: 10,
  },
  imageJOZNJORSFDOJFSWNVDO : {
    height : 23, width : 23
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
    width: 100,
    height: 100,
    borderRadius: 15,
  },
  roleText: {
    marginTop: 1,
    fontSize: 14,
    color : "#B8B8B8",
    fontWeight: '500',
  },
  input: {
    height: 50,
    paddingLeft : 22,
    borderRadius: 8,
    marginBottom: 16,
    paddingRight: 22,
    marginLeft : 23, 
    marginRight : 23,
    fontSize : 16
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
    marginVertical: 15,
    marginLeft: 20 ,
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
    marginBottom: 10,
    flexDirection: 'row',      
    justifyContent: 'space-between',
    alignItems: 'center', 
    marginLeft : 25, 
    marginRight : 25    
  },
  modifierVotreXZUOQEFD :{
    height: 21,
    marginTop : 4,
    width : "auto",
     marginBottom: 10,
    flexDirection: 'row',      
    marginLeft : 23, 
    marginRight : 23,  
    backgroundColor : '#599123', 
    borderRadius : 7,
    height : 41,
    alignItems : "center", 
    justifyContent: "center"
  },modifierVotreXTextesfvd : {
    color: "white",
    fontSize : 16
  },
  modifierVotreXText : {
    color: "#6D6D6D",
    fontSize : 16
  }
});

export default AdminProfile;
