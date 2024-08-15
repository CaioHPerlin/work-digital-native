import * as React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { useNavigation } from "@react-navigation/native";
import HomeScreen from "../screens/HomeScreen";
import ConfigApp from "../screens/ConfigApp";
import DadosPessoais from "../screens/DadosPessoais";
import { Ionicons } from "@expo/vector-icons";

interface KbStyles {
  white: string;
  fundoHeader: string;
  headerItem: string;
}

const KbStyles: KbStyles = {
  white: "#f27e26",
  fundoHeader: "#2d47f0",
  headerItem: "#FFC88d",
};

const Drawer = createDrawerNavigator();

const Sidebar: React.FC = () => {
  const navigation = useNavigation();

  return (
    <Drawer.Navigator
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
      }}
    >
      <Drawer.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="home-outline" color={color} size={size} />
          ),
        }} 
      />
      <Drawer.Screen 
        name="Configurações" 
        component={ConfigApp} 
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="settings-outline" color={color} size={size} />
          ),
        }} 
      />
      <Drawer.Screen 
        name="Dados Pessoais" 
        component={DadosPessoais} 
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="person-outline" color={color} size={size} />
          ),
        }} 
      />
      <Drawer.Screen 
        name="Tornar-se Autônomo" 
        component={ConfigApp} 
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="briefcase-outline" color={color} size={size} />
          ),
        }} 
      />
      <Drawer.Screen 
        name="Alterar Cidade" 
        component={ConfigApp} 
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="location-outline" color={color} size={size} />
          ),
        }} 
      />
      <Drawer.Screen 
        name="Alterar Senha" 
        component={ConfigApp} 
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="lock-closed-outline" color={color} size={size} />
          ),
        }} 
      />
      <Drawer.Screen 
        name="Teste" 
        component={ConfigApp} 
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="flask-outline" color={color} size={size} />
          ),
        }} 
      />
    </Drawer.Navigator>
  );
};

export default Sidebar;
