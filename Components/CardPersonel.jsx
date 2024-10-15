import { saveToken, getToken, deleteToken } from '../Helpers/tokenStorage';
import React, {useState, useEffect} from 'react';
import { Image, StyleSheet, TouchableOpacity, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { formatDate } from './fct';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SkeletonLoader from "./SkeletonLoader"
import { ENDPOINT_API } from '../Screens/endpoint';
import rateLimit from 'axios-rate-limit';


const axiosInstance = rateLimit(axios.create(), {
  maxRequests: 10, // maximum number of requests
  perMilliseconds: 1000, // time window in milliseconds
});


export const CardPersonal = ({ item }) => {

  const nav = useNavigation();

  const [role, setRole] = useState(null);

  useEffect(()=>{
    const x = async ()=>{
      const rolex = JSON.parse(await AsyncStorage.getItem('type'));
      setRole(rolex);
     }
    x();
  },[ ]);

  const [data, setData] = useState(null);
  const [loading,setLoading] = useState(true);


  const fetchData = async () => {
    if(item.user_id !== null && item.user_id !== undefined){
      try {
        setLoading(true);
         const token = await getToken(); 
        const response = await axiosInstance.get(`${ENDPOINT_API}user/${item.user_id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.status === 200) {
          setData(response.data);
          console.log(response.data)
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
  },[item.id]);



  return(
    <>
    {
     ( item && !loading && data) ? 
      <TouchableOpacity key={item.id}  onPress={()=>{nav.navigate('Profile', { id: item.user_id });}}  style={styles.card}>
        <View style={styles.row}>
          <Image source={{ uri: data.image ? data.image : "https://cdn-icons-png.flaticon.com/512/149/149071.png" }} style={styles.profileImage} />
          <View style={styles.infoContainer}>
            <Text style={styles.name}>{data.fullName}</Text>
            <Text style={styles.details}>Email : {data.email}</Text>
            <Text style={styles.details}>Téléphone: {data.mobile ? data.mobile : "--"}</Text>
            <Text style={styles.details}>Date de création: {formatDate(item.created_at)}</Text>
          </View>
        </View>
      </TouchableOpacity>
      :
      <SkeletonLoader />
    }
    </>
  );

}

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
    alignItems: "center",
  },
  profileImage: {
    width: 72,
    height: 72,
    borderRadius: 200,
    marginRight: 16,
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  details: {
    color: 'gray',
    marginBottom: 2,
  },
  iconContainer: {},
});

export default CardPersonal;
