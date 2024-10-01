import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './Screens/Home';
import Login from './Screens/Login';
import Register from './Screens/Register';
import Dashboard  from './Screens/DashBoard';
import Historique  from './Screens/History';
import Profile from './Screens/Profile';
import MesPersonels from './Screens/AllStaffs';
import MesFermes from './Screens/AllFarms';
import AjouterUnCalcul from './Screens/CreateCalculation';
import AjouterUneFerme from './Screens/CreateFarm';
import AjouterUnPersonel from './Screens/CreateStaff';

const Stack = createNativeStackNavigator();


export default function App() {

  return (
    <NavigationContainer>
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
        name="Profile" 
        component={Profile} 
        options={{ headerShown: false }}  
      />
      <Stack.Screen 
        name="Dashboard" 
        component={Dashboard} 
        options={{ headerShown: false }}  
      />
      <Stack.Screen 
        name="Historique" 
        component={Historique} 
        options={{ headerShown: false }}  
      />
      <Stack.Screen 
        name="AjouterUnCalcul" 
        component={AjouterUnCalcul} 
        options={{ headerShown: false }}  
      />
      <Stack.Screen 
        name="MesFermes" 
        component={MesFermes} 
        options={{ headerShown: false }}  
      />
      <Stack.Screen 
        name="AjouterUneFerme" 
        component={AjouterUneFerme} 
        options={{ headerShown: false }}  
      />
      <Stack.Screen 
        name="MesPersonels" 
        component={MesPersonels} 
        options={{ headerShown: false }}  
      />
      <Stack.Screen 
        name="AjouterUnPersonel" 
        component={AjouterUnPersonel} 
        options={{ headerShown: false }}  
      />
    </Stack.Navigator>
  </NavigationContainer>
  );
}
