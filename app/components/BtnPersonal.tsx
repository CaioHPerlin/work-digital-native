import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  GestureResponderEvent,
  Linking,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

import { Icon } from "react-native-paper";

interface Props {
  freelancer: {
    phone: string;
  };
}

const BtnPersonal: React.FC<Props> = ({ freelancer }) => {
  const { phone } = freelancer;
  const navigation = useNavigation();

  const handleWhatsAppPress = () => {
    const whatsappLink = `https://wa.me/+55${phone}`;
    Linking.openURL(whatsappLink);
  };

  const handleBackPress = () => {
    navigation.navigate("Sidebar");
  };

  return (
    <View style={styles.buttonContainer}>
      <TouchableOpacity style={styles.button} onPress={handleBackPress}>
        <Text style={styles.buttonText}>Voltar</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.buttonWhats}
        onPress={handleWhatsAppPress}
      >
        <Icon source="whatsapp" color={"white"} size={30} />
        <Text style={styles.buttonText}>WhatsApp</Text>
      </TouchableOpacity>
    </View>
  );
};

export default BtnPersonal;

const styles = StyleSheet.create({
  buttonContainer: {
    marginTop: "auto",
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
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    margin: 5,
    color: "#ffffff",
    fontSize: 16,
  },
});
