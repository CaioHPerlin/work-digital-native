import * as React from "react";
import { Button, View, Text } from "react-native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import HomeScreen from "./screens/HomeScreen";
import SettingsScreen from "./screens/SettingsScreen";
import RegisterAccount from "./screens/RegisterAccount";
import {useState} from "react"
//import ExitScreen from './screens/ExitScreen';
import Login from "./screens/Login";
import ConfigApp from "./screens/ConfigApp";
import Slider from "./components/Slider";
import ExitScreen from "./screens/PersonalInfo";
import Routes from "./routes/routes";

const KbStyles = {
  white: "#FFFFFF",
  fundoHeader: "#EE8424",
  headerItem: "#FFC88d",
};

const Drawer = createDrawerNavigator();
export default function App() {

 //const [config, setConfig] = useState('')
  return (
    <>
    <Routes/>
    </>
  );
}
