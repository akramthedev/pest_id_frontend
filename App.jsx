import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './Screens/Home';
import LoadingScreen from './Screens/LoadingScreen';
import Login from './Screens/Login';
import Register from './Screens/Register';
import ForgotPassword from "./Screens/ForgotPassword"
import Dashboard from './Screens/DashBoard';
import Profile from './Screens/Profile';
import AdminProfile from './Screens/AdminProfile';
import MesClients from './Screens/MesClients';
import Historique from './Screens/History';
import NewPassword from './Screens/NewPassword'
import NouvelleDemande from './Screens/NouvelleDemande';
import MesPersonels from './Screens/AllStaffs';
import MesFermes from './Screens/AllFarms';
import AjouterUnCalcul from './Screens/CreateCalculation';
import AjouterUneFerme from './Screens/CreateFarm';
import AjouterUneSerre from './Screens/CreateSerre';
import AjouterUnPersonel from './Screens/CreateStaff'
import ModifierSerre from './Screens/ModifierSerre';
import SingleFarmPage from './Screens/SingleFarmPage'
import Calculation from './Screens/Calculation';
import SuperAdminDemande from './Screens/SuperAdminDemande';
import { getToken } from './Helpers/tokenStorage';
import { AuthProvider, useAuth } from './Helpers/AuthContext';
const Stack = createNativeStackNavigator();



export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  return (
    <AuthProvider>
      <MainNavigator isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
    </AuthProvider>
  );
}

const MainNavigator = ({ isAuthenticated, setIsAuthenticated }) => {
  const { triggerIt } = useAuth();

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
          <>
            <Stack.Screen name="Historique" component={Historique} options={{ headerShown: false }} />            
            <Stack.Group screenOptions={{ headerShown: false }}>
              <Stack.Screen name="Profile" component={Profile} />
              <Stack.Screen name="AdminProfile" component={AdminProfile} />
              <Stack.Screen name="MesClients" component={MesClients} />
              <Stack.Screen name="Dashboard" component={Dashboard}  />
              <Stack.Screen name="NouvelleDemande" component={NouvelleDemande} />
              <Stack.Screen name="MesPersonels" component={MesPersonels} />
              <Stack.Screen name="MesFermes" component={MesFermes} />
              <Stack.Screen name="AjouterUnCalcul" component={AjouterUnCalcul} />
              <Stack.Screen name="AjouterUneFerme" component={AjouterUneFerme} />
              <Stack.Screen name="AjouterUnPersonel" component={AjouterUnPersonel} />
              <Stack.Screen name="AjouterUneSerre" component={AjouterUneSerre} />
              <Stack.Screen name="ModifierSerre" component={ModifierSerre} />
              <Stack.Screen name="Calculation" component={Calculation} /> 
              <Stack.Screen name="SingleFarmPage" component={SingleFarmPage} /> 
              <Stack.Screen name="SuperAdminDemande" component={SuperAdminDemande} />
            </Stack.Group>
          </>
        ) : (
          <Stack.Group screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Register" component={Register} />
            <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
            <Stack.Screen name="NewPassword" component={NewPassword} />
          </Stack.Group>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
