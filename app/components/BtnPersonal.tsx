import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  GestureResponderEvent,
} from "react-native";

import {Icon, MD3Colors} from "react-native-paper";

export default function BtnPersonal() {
  return (
    <View style={styles.buttonContainer}>
      <TouchableOpacity style={styles.button} >
        <Text style={styles.buttonText}>Voltar</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.buttonWhats} >
      <Icon source="whatsapp" color={'white'} size={30} />
        <Text style={styles.buttonText}>WhatsApp</Text>
      
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    marginTop:'auto',
    flexDirection: "row",
    justifyContent: "space-between",
    margin: 10,
  },
  button: {
    backgroundColor: "#FFC88d",
    padding: 10,
    borderRadius: 5,
  }, 
   buttonWhats: {
    backgroundColor: "#25D366",
    flexDirection:'row',
    alignItems:'center',
    padding: 10,
    borderRadius: 5,
  },
  

  buttonText: {
    margin:5,
    color: "#ffffff",
    fontSize: 16,
  },
});
