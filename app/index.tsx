import 'react-native-gesture-handler';
import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Provider } from 'react-native-paper';
import HomeScreen from './screens/HomeScreen';
import SettingsScreen from './screens/SettingsScreen';
import AccountScreen from './screens/AccountScreen';
import ExitScreen from './screens/ExitScreen';
import Header from './components/Header';
import MenuDrawer from './components/MenuDrawer';

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState('Home');
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  const renderScreen = () => {
    switch (currentScreen) {
      case 'Home':
        return <HomeScreen />;
      case 'Configurações':
        return <SettingsScreen />;
      case 'Conta':
        return <AccountScreen />;
      case 'Sair':
        return <ExitScreen />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <Provider>
      <View style={styles.container}>
        <Header toggleMenu={() => setIsMenuVisible(!isMenuVisible)} />
        <MenuDrawer
          isVisible={isMenuVisible}
          setIsVisible={setIsMenuVisible}
          setCurrentScreen={setCurrentScreen}
        />
        {renderScreen()}
      </View>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default App;
