import React from 'react';
import { Image, StyleSheet, TouchableOpacity, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const CardFarm = ({ item }) => (
  <View style={styles.card}>
    <View style={styles.row}>
      <Image source={{ uri: item.image }} style={styles.profileImage} />
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{item.Nom}</Text>
        <Text style={styles.details}>Région : {item.Région}</Text>
        <Text style={styles.details}>Localisation : {item.Localisation}</Text>
        <Text style={styles.details}>Nombre de personels : {item.Personels}</Text>
        <Text style={styles.details}>Date de création : {item.DateCreattion}</Text>
      </View>
      <TouchableOpacity style={styles.iconContainer}>
        <Ionicons name="settings-outline" style={styles.icon} size={24} color="#5B5B5B" />
      </TouchableOpacity>
    </View>
  </View>
);

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
    width: 95,
    height: 100,
    borderRadius:7,
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

export default CardFarm;
