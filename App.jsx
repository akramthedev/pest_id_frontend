import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import Home from './Screens/Home';
import Login from './Screens/Login';
import Register from './Screens/Register';
import Dashboard from './Screens/DashBoard';


const Stack = createNativeStackNavigator();



export default function App() {

  return (
    <NavigationContainer >
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen 
          name="Home" 
          component={Home} 
          options={{ headerShown: false }}  
        />
        <Stack.Screen 
          name="Login" 
          component={Login} 
          options={{ headerShown: false }}  
        />
        <Stack.Screen 
          name="Register" 
          component={Register} 
          options={{ headerShown: false }}  
        />
        <Stack.Screen 
          name="Dashboard" 
          component={Dashboard} 
          options={{ headerShown: false }}  
        />
      </Stack.Navigator>
      <StatusBar barStyle="light-content"  />
    </NavigationContainer>
  );
}
