import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';


const ConfigApp = ({navigation}) => {


        return (
          <View style={styles.container}>
            <Text style={styles.title}>Configurações do Aplicativo</Text>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('BecomeAutonomo')}>
              <Text style={styles.buttonText}>Tornar-se Autônomo</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('ChangePassword')}>
              <Text style={styles.buttonText}>Alterar Senha</Text>
            </TouchableOpacity>
          </View>
        );
    }
  


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
    backgroundColor: '#FFC88d',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
    width: '80%',
  },
  buttonText: {
    color: '#000',
    fontWeight: 'bold',
  }
});

export default ConfigApp;
