import React, { useState, useEffect } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';

// Composant générique pour afficher les messages
const AlertMessage = ({ type, message, visible }) => {
  const [position] = useState(new Animated.Value(-100)); // Animation partant du haut

  useEffect(() => {
    if (visible) {
      // L'animation apparaît du haut
      Animated.timing(position, {
        toValue: 0, // Position où l'alerte sera affichée
        duration: 500,
        useNativeDriver: true,
      }).start();

      // L'alerte disparaît après 3 secondes
      setTimeout(() => {
        Animated.timing(position, {
          toValue: -100,
          duration: 500,
          useNativeDriver: true,
        }).start();
      }, 3000);
    }
  }, [visible]);

  return (
    <Animated.View style={[styles.alertBox, { transform: [{ translateY: position }], backgroundColor: type === 'success' ? '#4CAF50' : '#F44336' }]}>
      <Text style={styles.alertText}>{message}</Text>
    </Animated.View>
  );
};

// Composant pour Erreurs
export const AlertError = ({ message, visible }) => {
  return <AlertMessage type="error" message={message} visible={visible} />;
};

// Composant pour Réussite
export const AlertSuccess = ({ message, visible }) => {
  return <AlertMessage type="success" message={message} visible={visible} />;
};

const styles = StyleSheet.create({
  alertBox: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    padding: 20,
    zIndex: 1000,
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertText: {
    color: '#fff',
    fontSize: 16,
    textAlign : "center",
    fontWeight: 'bold',
  },
});

