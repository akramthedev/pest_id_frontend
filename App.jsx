import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './Screens/Home';
import LoadingScreen from './Screens/LoadingScreen';
import Login from './Screens/Login';
import Register from './Screens/Register';
import Dashboard from './Screens/DashBoard';
import Profile from './Screens/Profile';
import AdminProfile from './Screens/AdminProfile';
import MesClients from './Screens/MesClients';
import Historique from './Screens/History';
import NouvelleDemande from './Screens/NouvelleDemande';
import MesPersonels from './Screens/AllStaffs';
import MesFermes from './Screens/AllFarms';
import AjouterUnCalcul from './Screens/CreateCalculation';
import AjouterUneFerme from './Screens/CreateFarm';
import AjouterUneSerre from './Screens/CreateSerre';
import ModifierSerre from './Screens/ModifierSerre';
import Calculation from './Screens/Calculation';
import SuperAdminDemande from './Screens/SuperAdminDemande';
import { getToken } from './Helpers/tokenStorage';

const Stack = createNativeStackNavigator();

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [triggerIt, settriggerIt] = useState(false);


  useEffect(() => {
    const checkAuthentication = async () => {
      const token = await getToken();
      setIsAuthenticated(!!token); 
    };
    checkAuthentication();
  }, [triggerIt]);

  if (isAuthenticated === null) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {isAuthenticated ? (
          // Authenticated user screens
          <>
            <Stack.Screen
              name="Dashboard"
              initialParams={{ triggerIt, settriggerIt }}
              component={Dashboard}
              options={{ headerShown: false }}
            />
            <Stack.Group screenOptions={{ headerShown: false }}>
              <Stack.Screen name="Profile" component={Profile} />
              <Stack.Screen name="AdminProfile" component={AdminProfile} />
              <Stack.Screen name="MesClients" component={MesClients} />
              <Stack.Screen name="Historique" component={Historique} />
              <Stack.Screen name="NouvelleDemande" component={NouvelleDemande} />
              <Stack.Screen name="MesPersonels" component={MesPersonels} />
              <Stack.Screen name="MesFermes" component={MesFermes} />
              <Stack.Screen name="AjouterUnCalcul" component={AjouterUnCalcul} />
              <Stack.Screen name="AjouterUneFerme" component={AjouterUneFerme} />
              <Stack.Screen name="AjouterUneSerre" component={AjouterUneSerre} />
              <Stack.Screen name="ModifierSerre" component={ModifierSerre} />
              <Stack.Screen name="Calculation" component={Calculation} />
              <Stack.Screen name="SuperAdminDemande" component={SuperAdminDemande} />
            </Stack.Group>
          </>
        ) : (
          // Unauthenticated user screens
          <Stack.Group screenOptions={{ headerShown: false }}>
            <Stack.Screen           
              initialParams={{ triggerIt, settriggerIt }}
              name="Home" 
              component={Home} 
            />
            <Stack.Screen           
              initialParams={{ triggerIt, settriggerIt }}
              name="Login" 
              component={Login} 
            />
            <Stack.Screen           
              initialParams={{ triggerIt, settriggerIt }}
              name="Register" 
              component={Register} 
            />
          </Stack.Group>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
