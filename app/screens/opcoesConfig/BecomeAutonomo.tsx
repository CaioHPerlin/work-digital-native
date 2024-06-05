import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const BecomeAutonomo = ({ setCurrentScreen }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tornar-se Autônomo</Text>
      <TouchableOpacity style={styles.button} onPress={() => setCurrentScreen('ConfigApp')}>
        <Text style={styles.buttonText}>Voltar para Configurações</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  title: {
    fontSize: 24,
    marginBottom: 20
  },
  button: {
    backgroundColor: '#1E90FF',
    padding: 10,
    marginTop: 10,
    borderRadius: 5
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16
  }
});

export default BecomeAutonomo;
