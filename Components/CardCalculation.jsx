import React, {useEffect, useRef, useState} from 'react';
import {Image ,ScrollView, StyleSheet, TouchableOpacity, Text, View, PanResponder, Animated, Dimensions  } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from "axios"
import AsyncStorage from '@react-native-async-storage/async-storage';
import { saveToken, getToken, deleteToken } from '../Helpers/tokenStorage';
import { ENDPOINT_API } from '../Screens/endpoint';
import rateLimit from 'axios-rate-limit';
import { AlertError, AlertSuccess } from "./AlertMessage";


const axiosInstance = rateLimit(axios.create(), {
  maxRequests: 10, // maximum number of requests
  perMilliseconds: 1000, // time window in milliseconds
});


const CardCalculation = ({id, idFarm,idPlaque, idSerre,  date, percentage }) => {

  const { width: screenWidth } = Dimensions.get('window');
  const navigation = useNavigation();
  const [data, setData] = useState(null);
  const [loading,setLoading] = useState(true);
  const [role, setRole] = useState(null);
  const [SerreSingle,setSerreSingle] = useState(null);
  const [FarmSingle,setFarmSingle] = useState(null);
  const [showError, setShowError] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [messageError,setmessageError] = useState("");
  const [messageSuccess,setmessageSuccess] = useState("");

  useEffect(()=>{
    const x = async ()=>{
      const rolex = JSON.parse(await AsyncStorage.getItem('type'));
      setRole(rolex);
     }
    x();
  },[ ]);

  const fetchData = async () => {
    if( idFarm !== null && idFarm !== undefined ){
      try {

        setLoading(true);
        const token = await getToken(); 
        const userId = await AsyncStorage.getItem('userId');
        const userIdNum = parseInt(userId);

        const response = await axiosInstance.get(`${ENDPOINT_API}farmANDserre/${idFarm}/${idSerre}/${userIdNum}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.status === 200) {
          setFarmSingle(response.data.farm)
          setSerreSingle(response.data.serre)
        } else if (response.status === 234) {
          setSerreSingle({
            ...SerreSingle, 
            name : "--",
          });setFarmSingle({
            ...FarmSingle, 
            name : "--",
          })
        }
        else if(response.status === 233){
          setFarmSingle({
            name : "---",
          })
          setSerreSingle({
            name : "---",
          })
        }
      } catch (error) {
        console.error('Erreur :', error.message);
        setmessageError("Oups, problème interne du serveur!");
              setShowError(true);
              setTimeout(() => {
                setShowError(false);
              }, 3000);
              setTimeout(() => {
                setmessageError("");
              }, 4000);
      } 
    }else{
      setFarmSingle({
        name : "---",
      })
      setSerreSingle({
        name : "---",
      })
    }
    setLoading(false);

  };

 

  useEffect(()=>{
    fetchData();
  },[id]);


  return (

    <>
    {
      loading ? 
      <SkeletonLoader />
      : 
      <View style={styles.card} key={id} >
        {
          id  && date && percentage  && 
          <>
          <View style={styles.row}>
            <Text style={styles.idText}>Nom Ferme : {FarmSingle && FarmSingle.name}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.idText}>Nom Serre : {SerreSingle && SerreSingle.name}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.idText}>ID Plaque : {idPlaque ? idPlaque : "---"}</Text>
          </View>

          <View
            style={{
              position : "absolute", 
              right : 20, 
              top : 15, 
            }}
          >
            <Text style={styles.percentageText}>{percentage+"%"}</Text>
            <Text style={styles.dateText}>Chown : +17.00%</Text>
          </View>


          {
            /*
            <Text style={styles.detailsText}>
              Mineuse : {!data ? "--" : data.class_A} • Mouche : {!data ? "--" : data.class_B} • Thrips : {!data ? "--" : data.class_C}
            </Text>
            */
          }
          <Text style={styles.dateText}>{date}</Text>
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.modifyButton} onPress={() => {
                navigation.navigate('Calculation', { id: id });
              }}  
            >
              <Text style={styles.buttonText1}>Modifier</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.detailsButton} onPress={() => {
                navigation.navigate('Calculation', { id: id });
              }}  
            >
              <Text style={styles.buttonText}>Voir détails</Text>
            </TouchableOpacity>
          </View>
          </>
        }
      </View>
    } 
    </>
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
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 555,
          useNativeDriver: true,
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
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginLeft : 23,
    marginRight : 23,
    marginBottom: 20,
    shadowColor: '#fff',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4, 
    elevation: 2,
    borderColor: "#F1F1F1",
    borderStyle : "solid",
    borderWidth : 1,
    shadowColor: "#000", 
    shadowOffset: { width: 0, height: 3 }, 
    shadowOpacity: 0.16, 
    shadowRadius: 4, 
    elevation: 4,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems : "center", 
    marginBottom: 5
  },
  idText: {
    fontSize: 16,
    fontWeight: '500',
  },
  loremText: {
    fontSize: 14,
    color: '#8c8c8c',
  },
  percentageText: {
    fontSize: 35,
    fontWeight: "900",
    color: '#373737', 
    textAlign : "right"
  },
  detailsText: {
    fontSize: 14,
    marginTop: 10,
  },
  dateText: {
    fontSize: 14,
    color: '#8c8c8c',
    marginTop: 0,
  },
  chrImpactText: {
    fontSize: 14,
    color: '#8c8c8c',
    marginTop: 5,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  modifyButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 7,
    height : 39,
    justifyContent : "center",
    alignItems : "center",
    width : "48%"
  },
  detailsButton: {
    backgroundColor: '#487C15',  
    justifyContent : "center",
    alignItems : "center",
    borderRadius: 7,
    height : 39,
    width : "48%"
  },
  buttonText: {
    color: 'white',
    fontSize : 16,
  },
  buttonText1 : {
    fontSize : 16,
    color : "black"
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

  imageJOZNJORSFDOJFSWNVDO : {
    height : 23, width : 23
  },

});

export default CardCalculation;
