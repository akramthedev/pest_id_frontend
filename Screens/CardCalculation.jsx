import React from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';

const CardCalculation = ({ idFarm, idSerre, mineuse, mouche, thrips, date, percentage, chrImpact }) => {
  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <Text style={styles.idText}>ID Ferme : {idFarm}</Text>
        <Text style={styles.loremText}>Lorem ipsum</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.idText}>ID Serre : {idSerre}</Text>
        <Text style={styles.percentageText}>{percentage}</Text>
      </View>
      <Text style={styles.detailsText}>
        Mineuse : {mineuse} • Mouche : {mouche} • Thrips : {thrips}
      </Text>
      <Text style={styles.dateText}>{date}</Text>
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.modifyButton}>
          <Text style={styles.buttonText1}>Modifier</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.detailsButton}>
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
    borderColor: "#E3E3E3",
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
