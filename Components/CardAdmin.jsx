import React from 'react';
import { Image, StyleSheet, TouchableOpacity, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';


export  const CardAdmin = ({ item,index, isXClicked }) => {
  
  
  const nav = useNavigation();




  const formatDate = (dateString) => {
    const date = new Date(dateString);  
    const day = String(date.getDate()).padStart(2, '0');  
    const month = String(date.getMonth() + 1).padStart(2, '0');  
    const year = date.getFullYear();  
    return `${day}/${month}/${year}`; 
  };


  return(

    <TouchableOpacity  key={index}    style={styles.card}>
      <TouchableOpacity onPress={()=>{
      if(isXClicked){
        nav.navigate('AdminProfile', { id: item.id });
      } 
      else{
        nav.navigate('NouvelleDemande', { id: item.id });
      }
    }}  style={styles.row}>
        <Image source={{ uri: item.image ? item.image : "https://cdn-icons-png.flaticon.com/512/149/149071.png" }} style={styles.profileImage} />
        <View style={styles.infoContainer}>
          <Text style={styles.name}>{item.fullName}</Text>
          <Text style={styles.details}>{item.email}</Text>
          <Text style={styles.details}>{formatDate(item.created_at)}</Text>
         </View>
        <TouchableOpacity onPress={()=>{
          if(isXClicked){
            nav.navigate('AdminProfile', { id: item.id });
          }
          else{
            nav.navigate('NouvelleDemande', { id: item.id });
          }
        }} style={styles.iconContainer}>
          <Ionicons name="settings-outline" style={styles.icon} size={24} color="#5B5B5B" />
        </TouchableOpacity>
      </TouchableOpacity>
    </TouchableOpacity>


  )
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
    width: 85,
    height: 85,
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

export default CardAdmin;
