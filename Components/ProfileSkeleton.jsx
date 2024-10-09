import React, { useRef, useEffect } from 'react';
import { StyleSheet, View, Animated } from 'react-native';

const ProfileSkeleton = () => {
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
         <Animated.View style={[styles.profileImage, animatedStyle([0, 1])]} />
      </View>
       <View style={styles.infoContainer}>
        <Animated.View style={[styles.skeletonTextLine1, animatedStyle([0, 1])]} />
        <Animated.View style={[styles.skeletonTextLine2, animatedStyle([0, 1])]} />
        <Animated.View style={[styles.skeletonTextLine3, animatedStyle([0, 1])]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  skeletonCard: {
    width: '100%',   
    height: '100%', 
    marginLeft: 23,
    marginRight: 23,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
     
   },
  skeletonRow: {
    flexDirection: 'row',
    alignItems: 'center',  
    justifyContent : "center"
  },
  profileImage: {
    width: 111,
    height: 111,
    borderRadius: 1000,  // For a perfect circle
    backgroundColor: '#e0e0e0',
    marginRight: 12,
  },
  infoContainer: {
    flex: 1,
    paddingTop: 10,
    justifyContent: 'flex-start',   
    marginLeft: 23,  // Space between image and text
    marginRight : 23
},
  skeletonTextLine1: {
    width: '100%',  // Long width
    height: 40,  // Adjusted height
    backgroundColor: '#e0e0e0',
    borderRadius: 6,
    marginBottom: 20,  // Margin bottom between items
  },
  skeletonTextLine2: {
    width: '90%',  // Long width
    height: 40,  // Adjusted height
    backgroundColor: '#e0e0e0',
    borderRadius: 6,
    marginBottom: 20,  // Margin bottom between items
  },
  skeletonTextLine3: {
    width: '80%',  // Long width
    height: 40,  // Adjusted height
    backgroundColor: '#e0e0e0',
    borderRadius: 6,
    marginBottom: 20,  // Margin bottom between items
  },
});

export default ProfileSkeleton;
