import { saveToken, getToken, deleteToken } from '../Helpers/tokenStorage';
import React, { useState, useEffect, useRef } from 'react';
import { useCallback } from 'react';
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


const { width: screenWidth } = Dimensions.get('window');


const Profile = () => {

  const route = useRoute();
  const { id } = route.params; 
  
  // id === 666 : Mon Profile     
  //otherwise : profil d une autre personne

  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [isModify, setisModify] = useState(false);
  const [isCurrent, setisCurrent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dataProfile, setdataProfile] = useState(null);
  const slideAnim = useRef(new Animated.Value(screenWidth)).current;
  const navigation = useNavigation();
  const { settriggerIt, triggerIt } = useAuth();
  const [role, setRole] = useState(null);

  
  useFocusEffect(
    useCallback(() => {

    const x = async ()=>{
      const rolex = JSON.parse(await AsyncStorage.getItem('type'));
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
    x(); 
  
  }, [navigation, id])
);


 
  useFocusEffect(
    useCallback(() => {
    const fetchProfileData = async ()=>{
      setLoading(true);
      if(id!== null && id !== undefined){
        console.log("----------------------------");
        console.log("ID : "+id);
        try{
          const userId = await AsyncStorage.getItem('userId');
          const token = await getToken(); 
          const userIdNum = parseInt(userId);

          if(id === 666 || id === "666" || userIdNum === id){
            //fetch my infos
            const response = await axios.get(`http://10.0.2.2:8000/api/user/${userIdNum}`, {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });

            if(response.status === 200){
              setdataProfile(response.data)
            }
            else{
              console.log("Not Fetched...")
            }
          }
          else{
            //fetch other infos
            setdataProfile(null);
            const response = await axios.get(`http://10.0.2.2:8000/api/user/${id}`, {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });

            if(response.status === 200){
              console.log("----------------------------");
              setdataProfile(response.data)
            }
            else{
              console.log("Not Fetched...")
            }
          }
        } 
        catch(e){
          console.log(e.message);
          if(e.message === "Request failed with status code 404"){
            Alert.alert("Utilisateur non trouvé");            
          }
        } finally{
          setLoading(false);
        }
      } 
    }
    fetchProfileData();
    return () => setLoading(false);  
  
  }, [id])
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


  return (
    <>
     
     <View style={styles.container}>
        <View>
          
          {
            loading === false &&

            <>
              <View style={styles.titleContainer}>
                <Text style={styles.titleText}>
                  {isCurrent !== null && <>{isCurrent ? "Mon " : ""}</>} Profil
                </Text>
                <TouchableOpacity onPress={toggleMenu} style={styles.menu}>
                  <Ionicons name="menu" size={24} color="#3E6715" />
                </TouchableOpacity>
              </View>

              <View style={styles.profileContainer}>
                <Image
                  style={styles.profileImage}
                  source={{
                    uri: dataProfile && dataProfile.image
                      ? dataProfile.image
                      : "https://cdn-icons-png.flaticon.com/256/149/149071.png"
                  }}
                />
                <Text style={styles.roleText}>
                  Role: {dataProfile && (
                    <>
                      {dataProfile.type.toLowerCase() === "admin"
                        ? "Administrateur"
                        : dataProfile.type.toLowerCase() === "superadmin"
                          ? "Super-Administrateur"
                          : "Staff"}
                    </>
                  )}
                </Text>
              </View>
            </>
          }

          {loading ? (
            <ProfileSkeleton />   
          ) : 
            dataProfile && (  
              <>
                <View style={styles.rowXXX}>
                  <Text style={styles.label}>Nom et prénom :</Text>
                  <Text style={styles.value}>{dataProfile.fullName}</Text>
                </View>
                <View style={styles.rowXXX}>
                  <Text style={styles.label}>Adresse email :</Text>
                  <Text style={styles.value}>{dataProfile.email}</Text>
                </View>
                <View style={styles.rowXXX}>
                  <Text style={styles.label}>Téléphone :</Text>
                  <Text style={styles.value}>{dataProfile.mobile ? dataProfile.mobile : "--"}</Text>
                </View>
                <View style={styles.rowXXX}>
                  <Text style={styles.label}>Date de création</Text>
                  <Text style={styles.value}>{formatDate(dataProfile.created_at)}</Text>
                </View>

                {isCurrent !== null && (
                  <>
                    {(isCurrent === true || (role && role === "superadmin")) && (
                      <>
                        <View style={styles.hr} />
                        <View style={styles.modifierVotreX}>
                          <Text style={styles.modifierVotreXText}>Modifier le mot de passe</Text>
                          <Ionicons name="arrow-forward" size={24} color="gray" />
                        </View>
                        <View style={styles.modifierVotreX}>
                          <Text style={styles.modifierVotreXText}>Réglages de paiements</Text>
                          <Ionicons name="arrow-forward" size={24} color="gray" />
                        </View>
                      </>
                    )}
                  </>
                )}
              </>
            )
          }
        </View>

        <View style={styles.buttonContainer}>
          {role && isCurrent !== null && (
            <>
              {role === "superadmin" || isCurrent === true ? (
                <>
                  {!isModify ? (
                    <>
                      <TouchableOpacity
                        disabled={loading || !dataProfile}
                        style={styles.saveButton}
                        onPress={() => { setisModify(!isModify); }}
                      >
                        <Text style={styles.buttonTextWhite}>Modifier le profile</Text>
                      </TouchableOpacity>
                    </>
                  ) : (
                    <>
                      <TouchableOpacity
                        disabled={loading || !dataProfile}
                        style={styles.cancelButton}
                        onPress={() => { setisModify(!isModify); }}
                      >
                        <Text style={styles.buttonTextBlack}>Annuler</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        disabled={loading || !dataProfile}
                        style={styles.saveButton}
                      >
                        <Text style={styles.buttonTextWhite}>Sauvegarder</Text>
                      </TouchableOpacity>
                    </>
                  )}
                </>
              ) : (
                <>
                  <TouchableOpacity
                    disabled={loading || !dataProfile}
                    style={styles.supprimerLepersonel}
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
    borderRadius: 15,
  },
  roleText: {
    marginTop: 10,
    fontSize: 14,
    color : "#B8B8B8",
    fontWeight: '500',
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
  supprimerLepersonel : {
    flex: 1,
    marginLeft: 8,
    paddingVertical: 12,
    backgroundColor: '#B40000',
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

export default Profile;