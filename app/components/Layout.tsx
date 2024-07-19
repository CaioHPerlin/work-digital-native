// components/Layout.tsx
import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient,  } from 'expo-linear-gradient';

interface LayoutProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

const Layout: React.FC<LayoutProps> = ({ children, style }) => {
  return (
    <LinearGradient
      colors={['#ff84003b', 'rgba(255, 200, 141, 0.227)']} // Defina as cores do gradiente aqui
      style={[styles.container, style]}
      start={{ x: 0.5, y: 0.5 }}
      end={{ x: 1, y: 1 }}
    >
      {children}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop:30,
  },
});

export default Layout;
