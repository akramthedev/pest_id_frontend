import React, { useState, useEffect, useRef } from 'react';
import { ScrollView,Image, StyleSheet, TouchableOpacity, Text, View, PanResponder, Animated, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons'; 
import CardAdmin from '../Components/CardAdmin'

const personnelData = [
  {
    id: '1',
    name: 'Jack Rosso',
    email: 'jack.rosso@greenhouse.com',
    phone: '+212 673 486 082',
    farm: 'Ferme : Green House',
    image: 'https://d1csarkz8obe9u.cloudfront.net/posterpreviews/agriculture-farm-logo-design-template-75a195de78a596ef33bb54e52f771c9a_screen.jpg?ts=1669442434',
  },
  {
    id: '2',
    name: 'Mounir Fettah',
    email: 'mounir.fettah@greenhouse.com',
    phone: '+212 673 486 083',
    farm: 'Ferme : Green House',
    image: 'https://previews.123rf.com/images/ikalvi/ikalvi1706/ikalvi170600030/79935275-logo-sant%C3%A9-cr%C3%A9ation-de-logo-de-sant%C3%A9-et-de-remise-en-forme.jpg',
  },
  {
    id: '3',
    name: 'Said Abdou',
    email: 'said.abdou@greenhouse.com',
    phone: '+212 673 486 084',
    farm: 'Ferme : Green House',
    image: "https://d1csarkz8obe9u.cloudfront.net/posterpreviews/agriculture-business-logo-design-template-cc64433eb5c0cf702a62f07fe40b6b04_screen.jpg?ts=1669313113",
  },
];


const personnelData2 = [
    {
      id: '1',
      name: 'Jack Rosso',
      email: 'jack.rosso@greenhouse.com',
      phone: '+212 673 486 082',
      farm: 'Ferme : Green House',
      image: 'https://d1csarkz8obe9u.cloudfront.net/posterpreviews/agriculture-farm-logo-design-template-75a195de78a596ef33bb54e52f771c9a_screen.jpg?ts=1669442434',
    },
    {
      id: '2',
      name: 'Mounir Fettah',
      email: 'mounir.fettah@greenhouse.com',
      phone: '+212 673 486 083',
      farm: 'Ferme : Green House',
      image: 'https://previews.123rf.com/images/ikalvi/ikalvi1706/ikalvi170600030/79935275-logo-sant%C3%A9-cr%C3%A9ation-de-logo-de-sant%C3%A9-et-de-remise-en-forme.jpg',
    }
  ];
 
  
const { width: screenWidth } = Dimensions.get('window');

export default function Dashboard() {
    const [isMenuVisible, setIsMenuVisible] = useState(false);
    const [isXClicked, setisXClicked] = useState(false);
    const slideAnim = useRef(new Animated.Value(screenWidth)).current;
    const navigation = useNavigation();



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
    <View style={styles.container}>
      <ScrollView>

        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>Tableau de Board</Text>
          <TouchableOpacity onPress={toggleMenu} style={styles.menu}>
            <Ionicons name="menu" size={24} color="#3E6715" />
          </TouchableOpacity>
        </View>

        <View style={styles.buttonContainer}>
                <TouchableOpacity  style={isXClicked ? styles.saveButton : styles.activated} onPress={()=>{setisXClicked(false)}} >
                  <Text style={isXClicked ? styles.buttonTextBlack : styles.buttonTextWhite}>Nouvelles Demandes</Text>
                </TouchableOpacity>
                <TouchableOpacity style={isXClicked ? styles.activated : styles.saveButton} onPress={()=>{setisXClicked(true)}} >
                  <Text style={isXClicked ? styles.buttonTextWhite : styles.buttonTextBlack}>Tous les admins</Text>
                </TouchableOpacity>
        </View>
        
        {
          isXClicked ? 
          <>
          {
            personnelData2 && personnelData2.map((data, index)=>{
              return(
                  <CardAdmin item={data} isXClicked={isXClicked}  key={index}/>
              )})
          }
          </>
          :
          <>
          {
            personnelData && personnelData.map((data, index)=>{
              return(
                  <CardAdmin item={data} isXClicked={isXClicked}  key={index}/>
              )})
          }
          </>
        }

      </ScrollView>
      
      {isMenuVisible && (
        <Animated.View
          style={[styles.popup, { transform: [{ translateX: slideAnim }] }]}
          {...panResponder.panHandlers}
        >
          <ScrollView style={styles.popupContent}>
            <TouchableOpacity onPress={() => { navigation.navigate('Historique'); toggleMenu(); }} style={styles.logo}>
              <Image
                source={require('../images/logo.png')}
                style={styles.imageLogo}
                resizeMode="cover"
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { navigation.navigate('Profile'); toggleMenu(); }} style={styles.menuItem}>
              <Ionicons name="person-outline" size={24} color="black" />
              <Text style={styles.menuText}>Mon Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { navigation.navigate('Dashboard'); toggleMenu(); }} style={styles.menuItem}>
              <Ionicons name="bar-chart-outline" size={24} color="black" />
              <Text style={styles.menuText}>Tableau de bord</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { navigation.navigate('Historique'); toggleMenu(); }} style={styles.menuItem}>
              <MaterialIcons name="history" size={24} color="black" />
              <Text style={styles.menuText}>Historique de calcul</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { navigation.navigate('AjouterUnCalcul'); toggleMenu(); }} style={styles.menuItem}>
              <Ionicons name="add-circle-outline" size={24} color="black" />
              <Text style={styles.menuText}>Ajouter un calcul</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { navigation.navigate('MesFermes'); toggleMenu(); }} style={styles.menuItem}>
              <Ionicons name="business" size={24} color="black" />
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
            <TouchableOpacity style={styles.menuItem}>
              <Ionicons name="help-circle-outline" size={24} color="black" />
              <Text style={styles.menuText}>Lorem ipsum</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem}>
              <Ionicons name="call-outline" size={24} color="black" />
              <Text style={styles.menuText}>Lorem ipsum</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.menuItem}>
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
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    position: "relative",
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
    marginBottom: 10,
  },
  picker: {
    backgroundColor: '#DEF3CB',
    borderRadius: 10,
    height: 50,
    justifyContent: 'center',
  },
  graphicContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
  BtnXXX: {
    height: 41,
    backgroundColor: "#DEF3CB",
    alignItems: "center",
    paddingRight: 20,
    paddingLeft: 20,
    borderRadius: 10,
    justifyContent: "center",
  },
  BtnXXX11 : {
    height: 41,
    backgroundColor: "#DEF3CB",
    alignItems: "center",
      borderRadius: 10,
      width : "48.4%",
    justifyContent: "center",
  },
  BtnXXXText: {
    color: "#4F8618",
    fontWeight: "bold",
  },
  activeBtn: {
   backgroundColor : "#487C15", 
  },
  activeBtnText :{
    color : "white"
  },
  graphicContainerText: {
    color: "#487C15",
    fontSize: 14,
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

  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft : 23, 
    marginRight : 23,
    marginBottom:  23
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
    marginRight: 8,
    paddingVertical: 12,
    backgroundColor: 'white',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth : 1, 
    borderColor : "#C8C8C8"
  },
  activated : {
    backgroundColor : "#487C15",
    flex: 1,
    marginRight: 8,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
    borderWidth : 1, 
    borderColor : "#C8C8C8"
  },
  buttonTextWhite: {
    color: '#fff',
    fontSize: 16,
  },
  buttonTextBlack: {
    color: 'black',
    fontSize: 16,
  },


  logo: {
    marginTop : 70,
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
    top: 50,
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
});
