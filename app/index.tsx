import * as React from 'react';
import { Button, View, Text, } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from './screens/HomeScreen';
import SettingsScreen from './screens/SettingsScreen';
import AccountScreen from './screens/AccountScreen';
import ExitScreen from './screens/ExitScreen';



const Drawer = createDrawerNavigator();
export default function App() {
  return (
< >

  <Drawer.Navigator initialRouteName="Home"
  
  >
        <Drawer.Screen name="Home" component={HomeScreen} />
        <Drawer.Screen name="Configurações" component={SettingsScreen} />
        <Drawer.Screen name="Conta" component={AccountScreen} />
        <Drawer.Screen name="Sair" component={ExitScreen} />

      
      </Drawer.Navigator>
 


        <Text>teste</Text>

      </>
  );
}
