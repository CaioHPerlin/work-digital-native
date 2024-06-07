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
      colors={['#ff84003b', '#ffc88d3a']} // Defina as cores do gradiente aqui
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
  },
});

export default Layout;
