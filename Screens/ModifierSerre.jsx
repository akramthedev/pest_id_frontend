import { saveToken, getToken, deleteToken } from '../Helpers/tokenStorage';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import {Image ,ScrollView,Alert, TextInput,StyleSheet, TouchableOpacity, Text, View, PanResponder, Animated, Dimensions  } from 'react-native';
import { Picker } from '@react-native-picker/picker'; 
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons'; 
import { MaterialIcons } from '@expo/vector-icons'; 
const { width: screenWidth } = Dimensions.get('window');
import { useAuth } from '../Helpers/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ENDPOINT_API } from './endpoint';
import { AlertError, AlertSuccess } from "../Components/AlertMessage";
import LoaderSVG from '../images/Loader.gif'
import axios from 'axios';
import rateLimit from 'axios-rate-limit';

const axiosInstance = rateLimit(axios.create(), {
  maxRequests: 5, // maximum number of requests
  perMilliseconds: 1000, // time window in milliseconds
});
const ModifierSerre = () => {

  const [isSupprimerClicked,setIsSupprimerClicked] = useState(false);
  const [showError, setShowError] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const [messageError,setmessageError] = useState("");
  const [messageSuccess,setmessageSuccess] = useState("");


  const [isModify, setisModify] = useState(false);
  const navigation = useNavigation();
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(screenWidth)).current;
  const { settriggerIt, triggerIt } = useAuth();
  const [loading, setLoading] = useState(true);
  const route = useRoute();
  const [role, setRole] = useState(null);
  const [TriggerIt, setTriggerIt] = useState(null);
  const [nameS, setNameS] = useState(null);
  const [sizeS, setSizeS] = useState(null);
  const [typeS, setTypeS] = useState(null);
  const [IdSerre, setIdSerre] = useState(null);
  const [IdFarm, setIdFarm] = useState(null);
  const [loaderDelete, setloaderDelete] = useState(false);
  const [loaderUpdate, setloaderUpdate] = useState(false);


  const { serreId, farmId,name, size, type } = route.params; 



  useEffect(()=>{
    const x = async ()=>{
      if(name && size && type && farmId && serreId){
        const rolex = JSON.parse(await AsyncStorage.getItem('type'));
        setRole(rolex);
        setIdFarm(farmId);setIdSerre(serreId);setTypeS(type);setSizeS(parseFloat(size));setNameS(name)
        setLoading(false);
      }
    }
    x();
  },[ ]);




  



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



  const handleLickDelete = async ()=>{
    if(IdSerre !== null && IdSerre !== undefined){
      try{
        setloaderDelete(true);
        const token = await getToken();
        const resp = await axiosInstance.delete(`${ENDPOINT_API}serres/${IdSerre}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if(resp.status === 200){
          setIsSupprimerClicked(false);
          setmessageSuccess("Succès : la serre a bien été supprimée.");
          setShowSuccess(true);
            setTimeout(() => {
              setShowSuccess(false);
            }, 2000);
            setTimeout(() => {
              setmessageSuccess("");
            }, 3000);
            setTimeout(()=>{
              navigation.navigate('SingleFarmPage', { id: IdFarm });
            }, 3000);


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
        setloaderDelete(false);
      }
    }
  }



  const handleUpdate = async ()=>{
    if(IdSerre !== null && IdSerre !== undefined){
      try{
        setloaderUpdate(true);
        const token = await getToken();

        let datak = {
          name : nameS, 
          size : sizeS, 
          type : typeS
        }

        const resp = await axiosInstance.patch(`${ENDPOINT_API}serres/${IdSerre}`, datak , {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if(resp.status === 200){
          setisModify(!isModify);          
          setmessageSuccess("Succès : la serre a bien été modifiée.");
          setShowSuccess(true);
            setTimeout(() => {
              setShowSuccess(false);
            }, 2000);
            setTimeout(() => {
              setmessageSuccess("");
            }, 3000);
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
        setloaderUpdate(false);
      }
    }
  }



  return (
    <>
    <View style={styles.container}>


           <AlertError message={messageError} visible={showError} />
          <AlertSuccess message={messageSuccess} visible={showSuccess} />




        <ScrollView>
          <View style={styles.titleContainer}>
          {
            loading && 
            <View style={{ position: "absolute", left :23 ,zIndex: 10}} > 
              <Image
                source={LoaderSVG}  
                style={styles.imageJOZNJORSFDOJFSWNVDO} 
              />
            </View>
          }
            <Text style={styles.titleText}>Ma Serre</Text>
            <TouchableOpacity onPress={toggleMenu} style={styles.menu}>
              <Ionicons name="menu" size={24} color="#3E6715" />
            </TouchableOpacity>
          </View>
       
          <Text style={styles.label}>Appelation</Text>
          <TextInput
            style={[
              styles.input,
              { color: isModify ? 'black' : 'gray' } 
            ]}
            placeholder="Veuillez saisir le nom de la serre..."
            value={loading ? "" : nameS}
            editable={isModify} 
            onChangeText={(text) => setNameS(text)}
            />

          <Text style={styles.label}>Mesure (en Mètre)</Text>
          <TextInput
            style={[
              styles.input,
              { color: isModify ? 'black' : 'gray' } 
            ]}
            placeholder="Veuillez saisir la mesure..."
            value={loading ? "" : sizeS.toString()} 
            onChangeText={(num) => setSizeS(parseFloat(num) || 0)}  
            keyboardType="numeric"
            editable={isModify} 
          />

         <Text style={styles.label}>Type de serre</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={typeS}
              enabled={isModify} 
              style={[
                styles.picker,
                { color: isModify ? 'black' : 'gray' } 
              ]}
              onValueChange={(itemValue) => setTypeS(itemValue)}
            >
              <Picker.Item label="Fruit" value="fruit" />
              <Picker.Item label="Légume" value="vegetable" />
              <Picker.Item label="Fleur" value="flower" />
            </Picker>
          </View>

      </ScrollView>
 
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
            width: '80%', 
            shadowColor: '#000', 
            shadowOpacity: 0.2, 
            shadowRadius: 10,
            elevation: 5 // Ombre pour Android
          }}>
            <Text style={{ 
              fontSize: 18, 
              fontWeight: 'bold', 
              marginBottom: 20 
            }}>

              Si vous supprimez cette serre, toutes les prédictions associées seront également supprimées.

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
        !isModify ? 
          <View style={styles.buttonRow1}>
            <TouchableOpacity disabled={loaderDelete}  onPress={()=>{setIsSupprimerClicked(true);}}   style={styles.cancelButton2}>
              <Text style={styles.buttonTextW} >Supprimer</Text>
            </TouchableOpacity>
            <TouchableOpacity disabled={loaderDelete} onPress={()=>{setisModify(!isModify)}}  style={styles.saveButton22}>
              <Text style={styles.buttonTextW}>Modifier</Text>
            </TouchableOpacity>
          </View>    
          :
          <View style={styles.buttonRow1}>
            <TouchableOpacity onPress={()=>{setisModify(!isModify);setNameS(name);setSizeS(size);setTypeS(type);}} disabled={loaderDelete} style={styles.cancelButton}>
              <Text style={styles.buttonTextB} >Annuler</Text>
            </TouchableOpacity>
            <TouchableOpacity disabled={loaderDelete} onPress={handleUpdate}  style={styles.saveButton}>
              <Text style={styles.buttonTextW}>{loaderUpdate ? "Sauvegarde en cours..." : "Sauvegarder"}</Text>
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
    paddingTop: 23,
  },
  titleContainer: {
    marginTop : 18,
    marginBottom : 23,
    alignItems: 'center',
    position : "relative"
  },
  menu :{
    position : "absolute",
    right : 23,
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
    marginLeft : 23, 
    marginRight :23
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    fontSize : 16,
    paddingLeft: 20,
    paddingRight: 20,
    marginBottom: 16,
    height: 48,
    marginLeft : 23, 
    marginRight :23
  },
  pickerWrapper: {  
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    marginBottom: 16,
    marginLeft : 23, 
    marginRight :23,
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
    marginVertical: 20,
    marginLeft: 23,
    marginRight: 23,
  },
  buttonRow2: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 0,
    marginLeft: 23,
    marginRight: 23,
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
    width: '34%',
    alignItems: 'center',
  },
  cancelButton2: {
    backgroundColor: '#A30202',
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 16,
    width: '48%',
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: '#487C15',
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 16,
    width: '62%',
    alignItems: 'center',
  },

  saveButton22: {
    backgroundColor: '#487C15',
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
    marginVertical: 15,    marginLeft: 20 ,

  },

  imageJOZNJORSFDOJFSWNVDO : {
    height : 23, width : 23
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
export default ModifierSerre;


