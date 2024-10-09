import { saveToken, getToken, deleteToken } from '../Helpers/tokenStorage';
import React, {useState} from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import axios from "axios";
import { useAuth } from '../Helpers/AuthContextl';
import { ENDPOINT_API } from './endpoint';
import { AlertError, AlertSuccess } from "../Components/AlertMessage";


const Test = ({ navigation, route }) => {

    const [isLoading, setIsLoading] = useState(false);
    const { settriggerIt, triggerIt } = useAuth();

    const [showError, setShowError] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
  
    const handlePress = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get('http://10.0.2.2:8000/api/hallo');
            if (response.status === 201) {
              Alert.alert("Success : Routes are working.");
            } else {
              Alert.alert("Error : Routes are not working.");
            }
          } catch (error) {
            Alert.alert(JSON.stringify(error.response.data));
            console.log(error.response.data);
          } finally{
            setIsLoading(false);
          }
    }

  
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handlePress} >
        <Text>
        {
            !isLoading ? "Test Your Rest API Connection" : "Testing..."
        }
        </Text>
      </TouchableOpacity>
    </View>
  );
};




const styles = StyleSheet.create({
    container: {
      flexGrow: 1,
      paddingTop: 110,
      backgroundColor: '#fff',
    }
})

export default Test;
