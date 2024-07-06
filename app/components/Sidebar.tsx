import * as React from "react";
import { Button, View, Text, TouchableOpacity } from "react-native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { useNavigation } from "@react-navigation/native";
import HomeScreen from "../screens/HomeScreen";
import ConfigApp from "../screens/ConfigApp";
import { Ionicons } from '@expo/vector-icons';

interface KbStyles {
  white: string;
  fundoHeader: string;
  headerItem: string;
}

const KbStyles: KbStyles = {
  white: "#FFFFFF",
  fundoHeader: "#EE8424",
  headerItem: "#FFC88d",
};

const Drawer = createDrawerNavigator();
const Sidebar: React.FC = () => {
  const navigation = useNavigation();

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
};

export default Sidebar;
