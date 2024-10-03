import React, { useState, useEffect, useRef } from 'react';
import { Image,TextInput, ScrollView, StyleSheet, TouchableOpacity, Text, View, PanResponder, Animated, Dimensions, SafeAreaView, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import SkeletonLoaderFarm from "../Components/SkeletonLoaderFarm"
import CardFarm from '../Components/CardFarm';



const { width: screenWidth } = Dimensions.get('window');


const AdminSingle = () => {


  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [loading, setLoading] = useState(true);
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
    <>
      <View style={styles.container}>


          <View>
            

                <View style={styles.titleContainer}>
                  <Text style={styles.titleText}>Profil Admin</Text>
                  <TouchableOpacity onPress={toggleMenu} style={styles.menu}>
                    <Ionicons name="menu" size={24} color="#3E6715" />
                  </TouchableOpacity>
                </View>
                
              <View style={styles.profileContainer}>
                <Image
                  style={styles.profileImage}
                  source={{ uri: 'https://d4l6e04z43qjx.cloudfront.net/img/agriculture/agriculture-logo-6.png' }}  
                />
                <Text style={styles.roleText}>Administrateur</Text>
              </View>

              <TextInput
                style={styles.input}
                placeholder="Nom et prénom"
                value="Yassine Bouwza" 
              />
              <TextInput
                style={styles.input}
                placeholder="Adresse email"
                value="yassine@greenhouse.com"
              />
              <TextInput
                style={styles.input}
                placeholder="Company"
                value="Green House SARL"
              />
              <TextInput
                style={styles.input}
                placeholder="Phone Number"
                value="+212 645 975 213"
              />
              <TextInput
                style={styles.input}
                placeholder="Phone Number"
                value="+212 645 975 213"
              />
               
          </View>
          <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={()=>{navigation.navigate('Dashboard')}}  style={styles.cancelButton}>
                  <Text style={styles.buttonTextBlack}>Refuser</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.saveButton}>
                  <Text style={styles.buttonTextWhite}>Accepter</Text>
                </TouchableOpacity>
              </View>
      </View>



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
  profileContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  profileImage: {
    width: 180,
    height: 150,
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
    marginVertical: 15,
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

export default AdminSingle;
