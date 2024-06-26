import * as React from 'react'
import { View, Text, StyleSheet, TouchableOpacity, } from 'react-native'
import Layout from '../components/Layout'

export default function PageInicial({navigation}){
    return(
    <Layout>
    <View style={styles.container}>
      <Text style={styles.title}>Bem-vindo ao Aplicativo</Text>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('RegisterAccount')}
        >
          <Text style={styles.buttonText}>Registrar</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Layout>
);
}

const styles = StyleSheet.create({
container: {
  flex: 1,
  padding: 20,
  justifyContent: 'center',
  alignItems: 'center',
},
title: {
  fontSize: 34,
  marginBottom: 40,
  textAlign: 'center',
},
buttonContainer: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginTop: 20,
  width: '100%',
},
button: {
  backgroundColor: '#FFC88d',
  padding: 15,
  borderRadius: 5,
  alignItems: 'center',
  flex: 1,
  marginHorizontal: 10,
},
buttonText: {
  color: '#000',
  fontWeight: 'bold',
},
});