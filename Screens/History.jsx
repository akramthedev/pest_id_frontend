import { saveToken, getToken, deleteToken } from '../Helpers/tokenStorage';
import React, { useState, useEffect, useRef } from 'react';
import {Image ,ScrollView, StyleSheet, TouchableOpacity, Text, View, PanResponder, Animated, Dimensions  } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Card from '../Components/CardCalculation'; 
import { Ionicons } from '@expo/vector-icons'; 
import { MaterialIcons } from '@expo/vector-icons'; 


const { width: screenWidth } = Dimensions.get('window');
import { useAuth } from '../Helpers/AuthContext';


const History = ({route}) => {
 
  const { settriggerIt, triggerIt } = useAuth();

  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [navigation]);


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
    <View style={styles.container}>

      
      <ScrollView>
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>Historique des calculs</Text>
          <TouchableOpacity onPress={toggleMenu} style={styles.menu}>
            <Ionicons name="menu" size={24} color="#3E6715" />
          </TouchableOpacity>
        </View>

        {loading ? (
          <>
            <SkeletonLoader />
            <SkeletonLoader />
          </>
        ) : (
          <>
            <Card
              idFarm="Harvest House"
              idSerre="GreenPod 51"
              mineuse="0"
              mouche="24"
              thrips="8"
              date="09/12/2024"
              percentage="72.6%"
              chrImpact="+5.4%"
            />
            <Card
              idFarm="Harvest House"
              idSerre="GreenPod 51"
              mineuse="0"
              mouche="24"
              thrips="8"
              date="12/04/2024"
              percentage="92.5%"
              chrImpact="+7.2%"
            />
          </>
        )}
      </ScrollView>

      {loading ? (
        <View style={styles.skeletonButtonContainer}>
          <SkeletonButtonLoader />
        </View>
      ) : (
        <TouchableOpacity onPress={() => navigation.navigate('AjouterUnCalcul')}  style={styles.addButton}>
          <Text style={styles.addButtonText}>+ Ajouter un nouveau calcul</Text>
        </TouchableOpacity>
      )}





      
      
      
      
      
      
      
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
            
            <TouchableOpacity onPress={() => { navigation.navigate('Profile'); toggleMenu(); }} style={styles.menuItem}>
              <Ionicons name="person-outline" size={24} color="black" />
              <Text style={styles.menuText}>Mon Profile</Text>
            </TouchableOpacity>
           
            <TouchableOpacity onPress={() => { navigation.navigate('MesClients'); toggleMenu(); }} style={styles.menuItem}>
              <Ionicons name="people-outline" size={24} color="black" />
              <Text style={styles.menuText}>Mes Clients</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => { navigation.navigate('SuperAdminDemande'); toggleMenu(); }} style={styles.menuItem}>
              <Ionicons name="mail-outline" size={24} color="black" />
              <Text style={styles.menuText}>Demandes Clients</Text>
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

      

      



    </View>
  );
};

const SkeletonButtonLoader = () => {
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 555,
          useNativeDriver: false,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 555,
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, [shimmerAnim]);

  const animatedStyle = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#e0e0e0', '#f0f0f0'],
  });

  return (
    <Animated.View
      style={[
        styles.skeletonButtonLoader, 
        { backgroundColor: animatedStyle },
      ]}
    />
  );
};

const SkeletonLoader = () => {
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 555,
          useNativeDriver: false,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 555,
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, [shimmerAnim]);

  const animatedStyle = (inputRange) => ({
    backgroundColor: shimmerAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ['#e0e0e0', '#f0f0f0'],
    }),
  });

  return (
    <View style={styles.skeletonCard}>
      <View style={styles.skeletonRow}>
        <Animated.View style={[styles.skeletonTextSmall, animatedStyle([0, 1])]} />
        <Animated.View style={[styles.skeletonTextMedium, animatedStyle([0, 1])]} />
      </View>
      <View style={styles.skeletonRow}>
        <Animated.View style={[styles.skeletonTextSmall, animatedStyle([0, 1])]} />
        <Animated.View style={[styles.skeletonTextLarge, animatedStyle([0, 1])]} />
      </View>
      <Animated.View style={[styles.skeletonTextLine, animatedStyle([0, 1])]} />
      <Animated.View style={[styles.skeletonTextLine, animatedStyle([0, 1])]} />
      <Animated.View style={[styles.skeletonTextLine, animatedStyle([0, 1])]} />
      <View style={styles.skeletonRow}>
        <Animated.View style={[styles.skeletonButton, animatedStyle([0, 1])]} />
        <Animated.View style={[styles.skeletonButtonWide, animatedStyle([0, 1])]} />
      </View>
    </View>
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
  addButton: {
    backgroundColor: '#487C15',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    marginVertical: 20,
    marginLeft: 23,
    marginRight: 23,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  skeletonButtonContainer: {
    marginHorizontal: 23,
    marginVertical: 20,
  },
  skeletonButtonLoader: {
    width: '100%',
    height: 50,
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
  },


  

  // Skeleton Loader Styles
  skeletonCard: {
    marginLeft: 23,
    marginRight: 23,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  skeletonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  skeletonTextSmall: {
    width: '40%',
    height: 15,
    backgroundColor: '#e0e0e0',
    borderRadius: 6,
  },
  skeletonTextMedium: {
    width: '30%',
    height: 15,
    backgroundColor: '#e0e0e0',
    borderRadius: 6,
  },
  skeletonTextLarge: {
    width: '20%',
    height: 30,
    backgroundColor: '#e0e0e0',
    borderRadius: 6,
  },
  skeletonTextLine: {
    width: '100%',
    height: 15,
    backgroundColor: '#e0e0e0',
    borderRadius: 6,
    marginBottom: 10,
  },
  skeletonButton: {
    width: '40%',
    height: 40,
    backgroundColor: '#e0e0e0',
    borderRadius: 6,
  },
  skeletonButtonWide: {
    width: '50%',
    height: 40,
    backgroundColor: '#e0e0e0',
    borderRadius: 6,
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
});

export default History;
