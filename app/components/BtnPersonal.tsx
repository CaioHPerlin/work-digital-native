import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

import { Icon } from "react-native-paper";
import { CustomStackNavigationProp, Freelancer } from "../types";
import { startConversation } from "@/api/conversationApi";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface Props {
  freelancer: Freelancer;
}

const BtnPersonal: React.FC<Props> = ({ freelancer }) => {
  const [loading, setLoading] = useState(false);
  const { phone_number } = freelancer;
  const navigation = useNavigation<CustomStackNavigationProp>();

  const handleWhatsAppPress = () => {
    const whatsappLink = `https://wa.me/+55${phone_number}`;
    Linking.openURL(whatsappLink);
  };

  const handleBackPress = () => {
    navigation.navigate("HomeScreen");
  };

  const handleStartConversation = async () => {
    setLoading(true);
    try {
      const userId = await AsyncStorage.getItem("id");
      if (!userId) {
        return Alert.alert(
          "Falha na funcionalidade.",
          "Tente repetir o processo de login"
        );
      }
      const result = await startConversation(userId, freelancer.user_id);
      const conversationId = result.conversationId;
      navigation.navigate("ChatScreen", { conversationId }); // Navigate to the chat screen
    } catch (error) {
      Alert.alert("Error", "Could not start conversation. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.buttonContainer}>
      {/* <TouchableOpacity style={styles.button} onPress={handleBackPress}>
        <Text style={styles.buttonText}>Voltar</Text>
      </TouchableOpacity> */}
      <TouchableOpacity
        style={styles.buttonWhats}
        onPress={handleWhatsAppPress}
      >
        <Icon source="whatsapp" color={"white"} size={30} />
        <Text style={styles.buttonText}>WhatsApp</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        disabled={loading}
        onPress={handleStartConversation}
      >
        <Text style={styles.buttonText}>
          {loading ? "Aguarde..." : "Conversar"}
        </Text>
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
    backgroundColor: "#2d47f0",
    padding: 18,
    borderRadius: 5,
    alignItems: "center",
    flex: 1,
    marginHorizontal: 5,
    borderWidth: 2,
    borderColor: "#f27e26",
  },
  buttonWhats: {
    backgroundColor: "#25D366",
    flexDirection: "row",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 18,
    borderRadius: 5,
  },

  buttonText: {
    margin: 5,
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
