import * as React from 'react';
import { Button, View, Text, } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import HomeScreen from './screens/HomeScreen';
import SettingsScreen from './screens/SettingsScreen';
import AccountScreen from './screens/AccountScreen';
import ExitScreen from './screens/ExitScreen';

const KbStyles = {
  white: '#FFFFFF',
  fundoHeader: '#FCb773',
  headerItem: '#FFC88d'
};

const Drawer = createDrawerNavigator();
export default function App() {
  return (
< >

  <Drawer.Navigator initialRouteName="Home"
    screenOptions={{
      drawerStyle: {
        width: 240
      },
      headerStyle: {
        height: 80,
        backgroundColor: KbStyles.fundoHeader
      },

      headerTitleStyle: {
        color: KbStyles.white
      },
      drawerActiveBackgroundColor : KbStyles.headerItem,
      drawerActiveTintColor: "white"
    }}
  >
        <Drawer.Screen  name="Home" component={HomeScreen} />
        <Drawer.Screen name="Configurações" component={SettingsScreen} />
        <Drawer.Screen name="Conta" component={AccountScreen} />
        <Drawer.Screen name="Sair" component={ExitScreen} />

      
      </Drawer.Navigator>
 


        <Text>teste</Text>

      </>
  );
}
