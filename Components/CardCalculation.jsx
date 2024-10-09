import React, {useEffect, useState} from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity , Dimensions} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from "axios"
import AsyncStorage from '@react-native-async-storage/async-storage';
import { saveToken, getToken, deleteToken } from '../Helpers/tokenStorage';
import { ENDPOINT_API } from '../Screens/endpoint';


const CardCalculation = ({id,key, idFarm,idPlaque, idSerre,  date, percentage, chrImpact }) => {

  const { width: screenWidth } = Dimensions.get('window');
  const navigation = useNavigation();
  const [data, setData] = useState(null);
  const [loading,setLoading] = useState(true);
  const [role, setRole] = useState(null);

  useEffect(()=>{
    const x = async ()=>{
      const rolex = JSON.parse(await AsyncStorage.getItem('type'));
      setRole(rolex);
     }
    x();
  },[ ]);

  const fetchData = async () => {
    if(id !== null && id !== undefined){
      try {
        setLoading(true);
        const IdOfPredi = id;
        const token = await getToken(); 
        const response = await axios.get(`${ENDPOINT_API}predictions/${IdOfPredi}/images`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.status === 200) {
          setData(response.data[0]);
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

 

  useEffect(()=>{
    fetchData();
  },[id]);


  return (
    <View style={styles.card} key={key} >
      <View style={styles.row}>
        <Text style={styles.idText}>ID Ferme : {idFarm}</Text>
        <Text style={styles.loremText}>Plaque : {idPlaque}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.idText}>ID Serre : {idSerre}</Text>
        <Text style={styles.percentageText}>{percentage}</Text>
      </View>
      <Text style={styles.detailsText}>
        Mineuse : {!data ? "--" : data.class_A} • Mouche : {!data ? "--" : data.class_B} • Thrips : {!data ? "--" : data.class_C}
      </Text>
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
    alignItems : "center"
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
    fontSize: 25,
    fontWeight: "700",
    color: '#373737', 
  },
  detailsText: {
    fontSize: 14,
    marginTop: 10,
  },
  dateText: {
    fontSize: 14,
    color: '#8c8c8c',
    marginTop: 5,
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
  }
});

export default CardCalculation;
