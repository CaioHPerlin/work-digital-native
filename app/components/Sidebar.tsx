import * as React from "react";
import { Button, View, Text, TouchableOpacity } from "react-native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { useNavigation } from '@react-navigation/native'; // Note que adicionamos `useNavigation`
import HomeScreen from "../screens/HomeScreen";
import SettingsScreen from "../screens/SettingsScreen";
import RegisterAccount from "../screens/RegisterAccount";
import { useState } from "react";
//import ExitScreen from './screens/ExitScreen';
import Login from "../screens/Login";
import ConfigApp from "../screens/ConfigApp";
import Slider from "./Slider";
import { Ionicons } from '@expo/vector-icons'; // ícones da Expo para uma seta de volta

const KbStyles = {
  white: "#FFFFFF",
  fundoHeader: "#EE8424",
  headerItem: "#FFC88d",
};

const Drawer = createDrawerNavigator();
export default function Sidebar() {
  const navigation = useNavigation(); // Inicializando useNavigation

  return (
    <>
      <Drawer.Navigator
        initialRouteName="Home"
        screenOptions={{
          drawerStyle: {
            backgroundColor: KbStyles.fundoHeader,
            width: 240,
          },
          headerStyle: {
            height: 80,
            backgroundColor: KbStyles.fundoHeader,
          },
          headerTitleStyle: {
            color: KbStyles.white,
          },
          drawerActiveBackgroundColor: KbStyles.headerItem,
          drawerInactiveTintColor: "white",
          drawerActiveTintColor: "white",
          drawerItemStyle: {
            borderWidth: 2,
            borderColor: KbStyles.headerItem,
          },
          headerRight: () => (
            <TouchableOpacity onPress={() => navigation.navigate("Home")} style={{ marginRight: 10 }}>
              <Ionicons name="arrow-back" size={24} color={KbStyles.white} />
            </TouchableOpacity>
          ),
        }}
      >
        <Drawer.Screen name="Home" component={HomeScreen} />
        <Drawer.Screen name="Configurações" component={ConfigApp} />
      </Drawer.Navigator>
    </>
  );
}
