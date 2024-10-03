import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './Screens/Home';
import Login from './Screens/Login';
import Register from './Screens/Register';
import Dashboard  from './Screens/DashBoard';
import Historique  from './Screens/History';
import AdminSingle from './Screens/AdminSingle';
import Profile from './Screens/Profile';
import MesPersonels from './Screens/AllStaffs';
import MesFermes from './Screens/AllFarms';
import AjouterUnCalcul from './Screens/CreateCalculation';
import AjouterUneSerre from './Screens/CreateSerre';
import AjouterUneFerme from './Screens/CreateFarm';
import AjouterUnPersonel from './Screens/CreateStaff';
import ModifierSerre from './Screens/ModifierSerre'
import Calculation from './Screens/Calculation';
import DashBoardSuperAdmin from './Screens/DashBoardSuperAdmin'

const Stack = createNativeStackNavigator();


export default function App() {

  const x = true;

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
        component={x === true ? DashBoardSuperAdmin : Dashboard} 
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
        name="AjouterUneSerre" 
        component={AjouterUneSerre} 
        options={{ headerShown: false }}  
      />
      <Stack.Screen 
        name="ModifierSerre" 
        component={ModifierSerre} 
        options={{ headerShown: false }}  
      />
      <Stack.Screen 
        name="MesPersonels" 
        component={MesPersonels} 
        options={{ headerShown: false }}  
      />
      <Stack.Screen 
        name="AdminSingle" 
        component={AdminSingle} 
        options={{ headerShown: false }}  
      />
      <Stack.Screen 
        name="AjouterUnPersonel" 
        component={AjouterUnPersonel} 
        options={{ headerShown: false }}  
      />
       <Stack.Screen 
        name="Calculation" 
        component={Calculation} 
        options={{ headerShown: false }}  
      />
    </Stack.Navigator>
  </NavigationContainer>
  );
}
