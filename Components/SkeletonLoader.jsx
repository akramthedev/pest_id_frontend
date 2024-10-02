import React, { useRef, useEffect } from 'react';
import { StyleSheet, View, Animated } from 'react-native';

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
        {/* Profile Image */}
        <Animated.View style={[styles.profileImage, animatedStyle([0, 1])]} />
        
        {/* Info Column with 3 items */}
        <View style={styles.infoContainer}>
          <Animated.View style={[styles.skeletonTextLine1, animatedStyle([0, 1])]} />
          <Animated.View style={[styles.skeletonTextLine3, animatedStyle([0, 1])]} />
          <Animated.View style={[styles.skeletonTextLine2, animatedStyle([0, 1])]} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
    alignItems: 'center',  
  },
  profileImage: {
    width: 66,
    height: 66,
    borderRadius: 40,  
    backgroundColor: '#e0e0e0',
    marginRight: 12,
  },
  infoContainer: {
    flex: 1,
    justifyContent : "center",
    flexDirection: 'column',
    justifyContent: 'space-between',  
  },
  skeletonTextLine1: {
    width: '100%',
    height: 19,
    backgroundColor: '#e0e0e0',
    borderRadius: 6,
    marginBottom: 9,  
  },

  skeletonTextLine2: {
    width: '80%',
    height: 19,
    backgroundColor: '#e0e0e0',
    borderRadius: 6,
    marginBottom: 9,  
  },

  skeletonTextLine3: {
    width: '50%',
    height: 19,
    backgroundColor: '#e0e0e0',
    borderRadius: 6,
    marginBottom: 9,  
  },
});

export default SkeletonLoader;
