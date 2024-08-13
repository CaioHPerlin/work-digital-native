import * as React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import RegisterAccount from "../screens/RegisterAccount";
import Login from "../screens/Login";
import HomeScreen from "../screens/HomeScreen";
import PersonalInfo from "../screens/PersonalInfo";
import PageInicial from "../screens/PageInicial";
import Sidebar from "../components/Sidebar";
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

const KbStyles = {
  white: "#FFFFFF",
  fundoHeader: "#EE8424",
  headerItem: "#FFC88d",
};

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();
const Routes = () => {
  return (
    <>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="PageInicial" component={PageInicial} />
        <Stack.Screen name="RegisterAccount" component={RegisterAccount} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen name="PersonalInfo" component={PersonalInfo} />
        <Stack.Screen name="BecomeAutonomo" component={BecomeAutonomo} />
        <Stack.Screen name="FreelancerDetails" component={FreelancerDetails} />
        <Stack.Screen name="Sidebar" component={Sidebar} />
        <Stack.Screen name="ChangePassword" component={ChangePassword} />
        <Stack.Screen name="ChangeCity" component={ChangeCity} />
        <Stack.Screen name="DadosPessoais" component={DadosPessoais} />
        <Stack.Screen name="ConfigApp" component={ConfigApp} />
        <Stack.Screen name="SliderDestaque" component={SliderDestaque} />
        <Stack.Screen name="Slider" component={Slider} />
        <Stack.Screen name="ManageDestak" component={ManageDestak} />
        

        
      </Stack.Navigator>
    </>
  );
};

export default Routes;
