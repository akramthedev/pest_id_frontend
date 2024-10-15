import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ScrollView,Image, StyleSheet, TouchableOpacity, Text, View, PanResponder, Animated, Dimensions, Alert } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { LineChart } from 'react-native-chart-kit';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';  
import { MaterialIcons } from '@expo/vector-icons'; 
import { saveToken, getToken, deleteToken } from '../Helpers/tokenStorage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ENDPOINT_API } from './endpoint';
import { AlertError, AlertSuccess } from "../Components/AlertMessage";
import { useAuth } from '../Helpers/AuthContext';
const { width: screenWidth } = Dimensions.get('window');
import LoaderSVG from '../images/Loader.gif';
import axios from "axios";
import rateLimit from 'axios-rate-limit';
const axiosInstance = rateLimit(axios.create(), {
  maxRequests: 5, // maximum number of requests
  perMilliseconds: 1000, // time window in milliseconds
});
import { Svg, Path } from 'react-native-svg';


export default function Dashboard({ route }) {

  const [showError, setShowError] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const [role, setRole] = useState(false);

  
  useEffect(()=>{
    const x = async ()=>{
      const rolex = JSON.parse(await AsyncStorage.getItem('type'));
      setRole(rolex);
      }
    x();
  },[ ]);


  const slideAnim = useRef(new Animated.Value(screenWidth)).current;
  const navigation = useNavigation();

  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [viewType, setViewType] = useState('Year');  
  const [selectedMonth, setSelectedMonth] = useState('January');
  const [selectedChart, setSelectedChart] = useState('Mouches');
  const [isFirstTime, setisFirstTime] = useState(false);
  const { settriggerIt, triggerIt } = useAuth();

  const data = {
    labels: viewType === 'Year' 
      ? ["Ja", "Fe", "Ma", "Ap", "May", "Jun", 'Jul', 'Au', "Se", "Oc", "No", "Dec"]
      : ["1", "5", "10", "15", "20", "25", "30"],  
    datasets: [
      {
        data: viewType === 'Year' 
          ? [20, 45, 28, 80, 99, 43, 20, 121, 76, 12, 80, 10]
          : [50, 15, 85, 60,37, 100, 45],  
        color: () => `#487C15`,  
      }
    ]
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




  
  const [IDCurrent, setIDCurrent] = useState(null);


  useFocusEffect(
    useCallback(() => {
      const x = async ()=>{
        try{
          const userId = await AsyncStorage.getItem('userId');
          const userIdNum = parseInt(userId);
          setIDCurrent(userIdNum);
          const token = await getToken(); 
          const response = await axios.get(`${ENDPOINT_API}user/${userIdNum}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          if(response.status === 200){
            if(parseInt(response.data.is_first_time_connected) === 0 ){
              setisFirstTime(true);
            }
            else{
              setisFirstTime(false);
            }
          }
        }
        catch(e){
          console.log(e.message);
        }
      }
      x(); 
  }, []));



  const handleClickFreshStart = async()=>{
    try{
      const userId = await AsyncStorage.getItem('userId');
      const userIdNum = parseInt(userId);
       
      const token = await getToken(); 
      const response = await axios.get(`${ENDPOINT_API}user_is_welcomed_done/${userIdNum}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log(response.data);

      if (response.data.user) {
        console.log(response.data.user);
      }
       
    }
    catch(e){
      console.log(e.message);
      Alert.alert(JSON.stringify(e.message));
    }
  }







  
  return (
    <View style={styles.container}>


      {
        isFirstTime && 
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
              fontSize: 23, 
              fontWeight: 'bold', 
              marginBottom: 25 , 
              alignItems  :"flex-end", 
            }}>

              <Svg xmlns="http://www.w3.org/2000/svg" width="23" height="23" fill="none" viewBox="0 0 57 57">
                <Path 
                  fill="#FFC017" 
                  d="m39.637 40.831-5.771 15.871a1.99 1.99 0 0 1-3.732 0l-5.771-15.87a2.02 2.02 0 0 0-1.194-1.195L7.298 33.866a1.99 1.99 0 0 1 0-3.732l15.87-5.771a2.02 2.02 0 0 0 1.195-1.194l5.771-15.871a1.99 1.99 0 0 1 3.732 0l5.771 15.87a2.02 2.02 0 0 0 1.194 1.195l15.871 5.771a1.99 1.99 0 0 1 0 3.732l-15.87 5.771a2.02 2.02 0 0 0-1.195 1.194"
                />
              </Svg>
              &nbsp;&nbsp;
              Bienvenue !
            </Text>
            <Text style={{ 
              fontSize: 18, 
              fontWeight: '400', 
              marginBottom: 21 
            }}>

              Nous sommes ravis de vous accueillir parmi nous. Vous avez fait un excellent choix en rejoignant notre communauté. 

            </Text>
            <Text style={{ 
              fontSize: 18, 
              fontWeight: '400', 
              marginBottom: 21 
            }}>

              • Explorez toutes les fonctionnalités disponibles pour tirer le meilleur parti de notre service.

            </Text>
            <Text style={{ 
              fontSize: 18, 
              fontWeight: '400', 
              marginBottom: 21 
            }}>

              • N'hésitez pas à consulter notre centre d'aide pour toute question ou assistance.

            </Text>

            <Text style={{ 
              fontSize: 18, 
              fontWeight: 'bold', 
              marginBottom: 21,
            }}>
              Bonne exploration !
            </Text>




            <View style={{ 
              flexDirection: 'row', 
              justifyContent: 'space-between' 
            }}>
           


           <TouchableOpacity style={{
                backgroundColor: 'white', 
                paddingVertical: 13,
                width : "60%",
                borderRadius: 5,
                alignItems : "center", 
                justifyContent : "center",                
                borderRadius: 5
              }}
                disabled={true}
                 
              >
              
              </TouchableOpacity>
              <TouchableOpacity style={{
                backgroundColor: 'black', 
                paddingVertical: 13,
                width : "40%",
                borderRadius: 5,
                alignItems : "center", 
                justifyContent : "center",                
                borderRadius: 5
              }}
                disabled={false}
                onPress={()=>{
                  setisFirstTime(false);
                  handleClickFreshStart();
                }}
              >
                <Text style={{ color: 'white', fontWeight: 'bold' }}>
                  Fermer
                </Text>
              </TouchableOpacity>
              
            </View>
          </View>
        </View>
      }
      
      <ScrollView>

        <View style={styles.titleContainer}>
        {
            
            <View style={{ position: "absolute", left :23 ,zIndex: 10,}} > 
              <Image
                source={LoaderSVG}  
                style={styles.imageJOZNJORSFDOJFSWNVDO} 
              />
            </View>
          }
          <Text style={styles.titleText}>Tableau de Board</Text>
          <TouchableOpacity onPress={toggleMenu} style={styles.menu}>
            <Ionicons name="menu" size={24} color="#3E6715" />
          </TouchableOpacity>
        </View>


        <Text style={styles.joesofwvdc} >Type d'affichage </Text>
         <View style={styles.viewTypeContainer}>
          <TouchableOpacity style={[styles.BtnXXX11, viewType === 'Year' ? styles.activeBtn : null]} onPress={() => setViewType('Year')}>
            <Text style={[styles.BtnXXXText, viewType === 'Year' ? styles.activeBtnText : null]}>Par Année</Text>
          </TouchableOpacity>
          <TouchableOpacity  style={[styles.BtnXXX11, viewType === 'Month' ? styles.activeBtn : null]} onPress={() => setViewType('Month')}>
            <Text style={[styles.BtnXXXText, viewType === 'Month' ? styles.activeBtnText : null]}>Par Mois</Text>
          </TouchableOpacity>
        </View>

         {viewType === 'Month' && (
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedMonth}
              onValueChange={(itemValue) => setSelectedMonth(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="January" value="January" style={styles.zusdquco} />
              <Picker.Item label="February" value="February" style={styles.zusdquco} />
              <Picker.Item label="March" value="March" style={styles.zusdquco}/>
              <Picker.Item label="April" value="April" style={styles.zusdquco}/>
              <Picker.Item label="May" value="May" style={styles.zusdquco}/>
              <Picker.Item label="June" value="June" style={styles.zusdquco}/>
              <Picker.Item label="July" value="July" style={styles.zusdquco}/>
              <Picker.Item label="August" value="August" style={styles.zusdquco}/>
              <Picker.Item label="Spetember" value="Spetember" style={styles.zusdquco}/>
              <Picker.Item label="October" value="October" style={styles.zusdquco}/>
              <Picker.Item label="November" value="November" style={styles.zusdquco}/>
              <Picker.Item label="December" value="December" style={styles.zusdquco}/>
             </Picker>
          </View>
        )}

         

        <Text style={styles.joesofwvdcjoesofwvdc} >Espèces à analyser</Text>

          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={[styles.BtnXXX, selectedChart === 'Mouches' ? styles.activeBtn : null]} 
              onPress={() => setSelectedChart('Mouches')}>
              <Text style={[styles.BtnXXXText, selectedChart === 'Mouches' ? styles.activeBtnText : null]}>Mouches</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.BtnXXX, selectedChart === 'Mineuses' ? styles.activeBtn : null]} 
              onPress={() => setSelectedChart('Mineuses')}>
              <Text style={[styles.BtnXXXText, selectedChart === 'Mineuses' ? styles.activeBtnText : null]}>Mineuses</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.BtnXXX, selectedChart === 'Thrips' ? styles.activeBtn : null]} 
              onPress={() => setSelectedChart('Thrips')}>
              <Text style={[styles.BtnXXXText, selectedChart === 'Thrips' ? styles.activeBtnText : null]}>Thrips</Text>
            </TouchableOpacity>
          </View>


         <View style={styles.graphicContainer}>
          <Text style={styles.graphicContainerText}>Moyenne des {selectedChart} par plaque {viewType === 'Year' ? 'par an' : `pour ${selectedMonth}`}</Text>
          <LineChart
            data={data}
            width={screenWidth - 40}  
            height={300}
            bezier  
            chartConfig={{
              backgroundColor : "#E5FFCC",
              backgroundGradientFrom: '#F3FFE8',
              backgroundGradientTo: '#F3FFE8',
              decimalPlaces: 2,
              color: (opacity = 1) => `rgba(72, 124, 21, ${opacity})`,
              style: {
                borderRadius: 16,
              },
            }}
            style={{
              marginVertical: 8,
              borderRadius: 16,
            }}
          />
        </View>
        
      </ScrollView>
      

      
      
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

      

    </View>
  );
}

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
  viewTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 23,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    marginHorizontal: 23,
  },
  pickerContainer: {
    marginHorizontal: 23,
    marginBottom: 10,borderColor : "#DCDCDC", 
    borderWidth : 1,
    borderRadius : 8,overflow : "hidden"
  },
  picker: {
    backgroundColor: '#F3FFE8',
    borderRadius: 10,
    height: 50,     
    justifyContent: 'center',
  },
  graphicContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 30,
    borderRadius: 0,
  },
  BtnXXX: {
    height: 41,
    backgroundColor: "#F3FFE8",
    borderColor : "#DCDCDC", 
    alignItems: "center",
    borderRadius: 10,
    width : "31.3%",    borderWidth : 1,
    justifyContent: "center",
  },
  BtnXXX11 : {
    height: 41,
    backgroundColor: "#F3FFE8",
    borderColor : "#DCDCDC", 
    alignItems: "center",
    borderWidth : 1,
    borderRadius: 10,
    width : "48.4%",
    justifyContent: "center",
  },
  BtnXXXText: {
    color: "black",
    fontSize : 16,
    fontWeight: "400",
  },
  activeBtn: {
   backgroundColor : "#487C15", 
  },
  activeBtnText :{
    color : "white"
  },
  graphicContainerText: {
    color: "#AEAEAE",
    fontSize: 14,
  },
  //pop Up Menu 
  popup: {
    position: 'absolute',
    top: 0,
    right: 0,
    height: '107%',
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
  zusdquco : {
    color : "black", 
    fontSize : 16
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
  joesofwvdc : {
    color : "black", 
    marginLeft : 24, 
    marginBottom : 10, 
    fontSize : 16, 
    fontWeight : '400', 
   },
   joesofwvdcjoesofwvdc : {
     color : "black", 
     marginLeft : 24, 
     marginBottom : 10, 
     fontSize : 16, 
     fontWeight : '400', 
     marginTop : 10
    }
});
