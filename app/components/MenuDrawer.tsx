import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';

type MenuDrawerProps = {
  isVisible: boolean;
  setIsVisible: (visible: boolean) => void;
  setCurrentScreen: (screen: string) => void;
};

const MenuDrawer: React.FC<MenuDrawerProps> = ({ isVisible, setIsVisible, setCurrentScreen }) => {
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: withTiming(isVisible ? 0 : -250, { duration: 500 }) }],
    };
  });

  const handleMenuClick = (screen: string) => {
    setCurrentScreen(screen);
    setIsVisible(false);
  };

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <TouchableOpacity onPress={() => handleMenuClick('Home')}>
        <Text style={styles.menuItem}>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleMenuClick('Configurações')}>
        <Text style={styles.menuItem}>Configurações</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleMenuClick('Conta')}>
        <Text style={styles.menuItem}>Conta</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleMenuClick('Sair')}>
        <Text style={styles.menuItem}>Sair</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 250,
    backgroundColor: '#ffcb9d',
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.5,
    shadowOffset: { width: 2, height: 2 },
    shadowRadius: 10,
    zIndex: 1000,
  },
  menuItem: {
    fontSize: 18,
    marginVertical: 10,
  },
});

export default MenuDrawer;
