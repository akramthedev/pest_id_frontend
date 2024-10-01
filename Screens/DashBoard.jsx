import React, { useState, useEffect, useRef } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, Text, View, Animated } from 'react-native';
import Card from './CardCalculation'; // Your card component

const Dashboard = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate a 2-second loading time
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    // Cleanup timer on component unmount
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>Historique des calculs</Text>
        </View>

        {loading ? (
          // Render the skeleton loader when loading
          <>
            <SkeletonLoader />
            <SkeletonLoader />
          </>
        ) : (
          // Render the actual cards after loading
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
        // Render the skeleton loader for the button when loading
        <View style={styles.skeletonButtonContainer}>
          <SkeletonButtonLoader />
        </View>
      ) : (
        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addButtonText}>+ Ajouter un nouveau calcul</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

// Skeleton Loader for the button with Animated Shimmer Effect
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
        styles.skeletonButtonLoader, // apply animated style to button loader
        { backgroundColor: animatedStyle },
      ]}
    />
  );
};

// Skeleton Loader for the main cards
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
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
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
});

export default Dashboard;
