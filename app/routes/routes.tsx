import * as React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import RegisterAccount from "../screens/RegisterAccount";
import Login from "../screens/Login";
import HomeScreen from "../screens/HomeScreen";
import PersonalInfo from "../screens/PersonalInfo";
import PageInicial from "../screens/PageInicial";
import BecomeAutonomo from "../screens/opcoesConfig/BecomeAutonomo";
import ChangePassword from "../screens/opcoesConfig/ChangePassword";
import DadosPessoais from "../screens/DadosPessoais";
import ConfigApp from "../screens/ConfigApp";
import ChangeCity from "../screens/ChangeCity";
import FreelancerDetails from "../screens/FreelancerDetails";
import SliderDestaque from "../components/SliderDestaque";
import Slider from "../components/Slider";
import ManageDestak from "../screens/ManageDestak";
import Header from "../components/Header";
import Icon from 'react-native-vector-icons/FontAwesome'; // Importa FontAwesome

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

const Routes = () => {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="PageInicial" component={PageInicial} />
      <Stack.Screen name="RegisterAccount" component={RegisterAccount} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="HomeScreen">
        {() => (
          <Drawer.Navigator
            screenOptions={{
              header: () => <Header />, // Usa o Header personalizado aqui
              drawerStyle: {
                backgroundColor: '#2d47f0',
                width: 240,
              },
              headerStyle: {
                height: 80,
                backgroundColor: '#2d47f0',
              },
              headerTitleStyle: {
                color: '#f27e26',
              },
              drawerActiveBackgroundColor: '#FFC88d',
              drawerInactiveTintColor: 'white',
              drawerActiveTintColor: 'white',
              drawerItemStyle: {
                borderWidth: 2,
                borderColor: '#FFC88d',
              },
            }}
          >
            <Drawer.Screen 
              name="Home" 
              component={HomeScreen} 
              options={{
                drawerIcon: ({ color, size }) => (
                  <Icon name="home" color={color} size={size} />
                ),
              }}
            />

            <Drawer.Screen 
              name="Dados Pessoais" 
              component={DadosPessoais} 
              options={{
                drawerIcon: ({ color, size }) => (
                  <Icon name="user" color={color} size={size} />
                ),
              }}
            />
            <Drawer.Screen 
              name="Tornar-se Autônomo" 
              component={BecomeAutonomo} 
              options={{
                drawerIcon: ({ color, size }) => (
                  <Icon name="briefcase" color={color} size={size} />
                ),
              }}
            />
            <Drawer.Screen 
              name="Alterar Cidade" 
              component={ChangeCity} 
              options={{
                drawerIcon: ({ color, size }) => (
                  <Icon name="map-marker" color={color} size={size} />
                ),
              }}
            />
            <Drawer.Screen 
              name="Alterar Senha" 
              component={ChangePassword} 
              options={{
                drawerIcon: ({ color, size }) => (
                  <Icon name="lock" color={color} size={size} />
                ),
              }}
            />

          </Drawer.Navigator>
        )}
      </Stack.Screen>
      <Stack.Screen name="PersonalInfo" component={PersonalInfo} />
      <Stack.Screen name="FreelancerDetails" component={FreelancerDetails} />
      <Stack.Screen name="SliderDestaque" component={SliderDestaque} />
      <Stack.Screen name="Slider" component={Slider} />
    </Stack.Navigator>
  );
};

export default Routes;
