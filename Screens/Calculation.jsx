import React, { useState, useEffect, useRef } from 'react';
import {Image ,ScrollView, TextInput,StyleSheet,FlatList, TouchableOpacity, Text, View, PanResponder, Animated, Dimensions  } from 'react-native';
 import { Picker } from '@react-native-picker/picker'; 
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons'; 
import { MaterialIcons } from '@expo/vector-icons'; 


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

       <View style={{ flexDirection: 'row', marginTop: 20 }}>
         <TouchableOpacity
          onPress={goPrevious}
          disabled={currentIndex === 0}  
          style={[
            styles.carouselButton,
            currentIndex === 0 && { backgroundColor: '#ccc' } 
          ]}
        >
          <Ionicons name="chevron-back-outline" size={24} color="white" />
        </TouchableOpacity>

         <TouchableOpacity
          onPress={goNext}
          disabled={currentIndex === images.length - 1}  
          style={[
            styles.carouselButton,
            currentIndex === images.length - 1 && { backgroundColor: '#ccc' } 
          ]}
        >
          <Ionicons name="chevron-forward-outline" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const images = [
  { uri: 'https://www.maag-garden.ch/de/produktsuche/nach-schaden/assets/weblication/wThumbnails/maag_Senf_Minierfliege_Blatt_PA229580-b3ebfa05-924f645a@708ll.jpg' },
  { uri: 'https://upload.wikimedia.org/wikipedia/commons/d/d6/Stigmella_aurella_%28Nepticulidae%29_-_%28leaf_mine%29%2C_Elst_%28Gld%29%2C_the_Netherlands_-_2.jpg' },
  { uri: 'https://www.biobestgroup.com/_next/image?url=https%3A%2F%2Fapi.cmz4g8wno1-biobestgr1-p1-public.model-t.cc.commerce.ondemand.com%2Fmedias%2Fleafminer-larva-7-WS.jpg%3Fcontext%3DbWFzdGVyfGltYWdlc3w3MjI4Mjl8aW1hZ2UvanBlZ3xhREk1TDJnNE1TODRPVEl6TVRBd01URTVNRGN3TDJ4bFlXWnRhVzVsY2kxc1lYSjJZUzAzTFZkVExtcHdad3w5MTMyMTgwMDkxMjNjMDFjZWY3YWRlZTA2ZWYyYWM2OThiNmI3MGM1MTQ5OTAyYzkxNzg4Nzc1NTkxNWJmNDhi&w=384&q=75' },
];



const Calculation = () => {

  const [isModifyClicked, setisModifyClicked] = useState(false)
  const navigation = useNavigation();
  const [plaqueId, setPlaqueId] = useState('');
  const [serre, setSerre] = useState('');
  const [ferme, setFerme] = useState('');
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(screenWidth)).current;

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
                <Text style={styles.info}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;•&nbsp;ID de ferme: S73ND</Text>
                <Text style={styles.info}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;•&nbsp;ID de serre: A7924NF2</Text>
                <Text style={styles.info}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;•&nbsp;Date du calcul: 19/09/2024</Text>
              </View>

              <View style={styles.resultsContainer}>
                <Text style={styles.title}>Résultats du Calcul</Text>
                <Text style={styles.info}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;•&nbsp;Pourcentage: 72.9%</Text>
                <Text style={styles.info}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;•&nbsp;Nombre de mouches: 24</Text>
                <Text style={styles.info}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;•&nbsp;Nombre de mineuses: 17</Text>
                <Text style={styles.info}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;•&nbsp;Nombre de Thrips: 5</Text>
              </View>

              <View style={styles.carouselContainer}>
                <Text style={styles.titleXX}>Images du Calcul</Text>
                <Carousel images={images} />
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

          <TouchableOpacity onPress={() =>{ navigation.navigate('Historique') ;toggleMenu()}} style={styles.logo}>
            <Image
              source={require('../images/logo.png')}          
              style={styles.imageLogo}
              resizeMode="cover"
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={() =>{ navigation.navigate('Profile');toggleMenu()}}  style={styles.menuItem}>
            <Ionicons name="person-outline" size={24} color="black" />
            <Text style={styles.menuText}>Mon Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() =>{ navigation.navigate('Dashboard');toggleMenu()}}  style={styles.menuItem}>
            <Ionicons name="bar-chart-outline" size={24} color="black" />
            <Text style={styles.menuText}>Tableau de board</Text>
          </TouchableOpacity>


          <TouchableOpacity onPress={() => {navigation.navigate('Historique');toggleMenu()}}  style={styles.menuItem}>
            <MaterialIcons name="history" size={24} color="black" />
            <Text style={styles.menuText}>Historique de calcul</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() =>{ navigation.navigate('AjouterUnCalcul');toggleMenu()}}  style={styles.menuItem}>
            <Ionicons name="add-circle-outline" size={24} color="black" />
            <Text style={styles.menuText}>Ajouter un calcul</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() =>{ navigation.navigate('MesFermes');toggleMenu()}}  style={styles.menuItem}>
            <Ionicons name="business" size={24} color="black" />
            <Text style={styles.menuText}>Mes fermes</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => {navigation.navigate('AjouterUneFerme');toggleMenu()}}  style={styles.menuItem}>
            <Ionicons name="add-circle-outline" size={24} color="black" />
            <Text style={styles.menuText}>Ajouter une ferme</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() =>{ navigation.navigate('MesPersonels');toggleMenu()}}  style={styles.menuItem}>
            <Ionicons name="people-outline" size={24} color="black" />
            <Text style={styles.menuText}>Mes personnels</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() =>{ navigation.navigate('AjouterUnPersonel');toggleMenu()}}  style={styles.menuItem}>
            <Ionicons name="add-circle-outline" size={24} color="black" />
            <Text style={styles.menuText}>Ajouter un personel</Text>
          </TouchableOpacity>

          

          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="help-circle-outline" size={24} color="black" />
            <Text style={styles.menuText}>Lorem ipsum</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="call-outline" size={24} color="black" />
            <Text style={styles.menuText}>Lorem ipsum</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Login')}  style={styles.menuItem}>
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
    padding: 23,
    backgroundColor: '#fff',
  },
  titleContainer: {
    height: 80,
    justifyContent: 'center',
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
    height: 250,  
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
    backgroundColor: '#487C15',
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: 500,
    marginLeft : 7,
    marginRight : 7,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  }
});
export default Calculation;


