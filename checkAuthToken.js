import AsyncStorage from '@react-native-async-storage/async-storage';

export const checkAuthToken = async () => {
  try {
    const token = await AsyncStorage.getItem('token');
    return token !== null;  
  } catch (error) {
    console.log('Error checking token:', error);
    return false;  
  }
};
