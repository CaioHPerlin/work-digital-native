import React, { useEffect, useState } from "react";
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
import { CustomStackNavigationProp, FlattenedProfile } from "../types";
import { supabase } from "../../lib/supabase";

interface Props {
  freelancer: FlattenedProfile;
}

const BtnPersonal: React.FC<Props> = ({ freelancer }) => {
  const [userId, setUserId] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const { phone_number } = freelancer;
  const navigation = useNavigation<CustomStackNavigationProp>();

  useEffect(() => {
    const fetchUserId = async () => {
      const { data } = await supabase.auth.getSession();
      setUserId(data.session?.user.id || "");
    };

    fetchUserId();
  }, []);

  const handleWhatsAppPress = () => {
    const formattedNumber = phone_number.replace(/\D/g, ""); // Removes non-numeric characters
    const whatsappLink = `https://wa.me/55${formattedNumber}`;
    Linking.openURL(whatsappLink).catch(() => {
      Alert.alert("Erro", "Não foi possível abrir o WhatsApp.");
    });
  };

  const handleStartConversation = async () => {
    if (!userId || !freelancer.id) {
      return Alert.alert("Erro", "Usuário ou freelancer não encontrado.");
    }

    setLoading(true);

    try {
      // Check if a chat already exists between userId and freelancer.id
      const { data: existingChats, error: fetchError } = await supabase
        .from("chats")
        .select("*")
        .or(
          `and(user_1_id.eq.${userId},user_2_id.eq.${freelancer.id}),and(user_1_id.eq.${freelancer.id},user_2_id.eq.${userId})`
        );

      if (fetchError) {
        throw new Error(
          `Erro ao verificar chats existentes: ${fetchError.message}`
        );
      }

      if (existingChats.length > 0) {
        // Chat already exists
        const existingChat = existingChats[0];
        navigation.navigate("ChatScreen", {
          chatId: existingChat.id,
          userId: userId,
          freelancerId: freelancer.id,
        });
        return;
      }

      // Create a new chat
      const { data, error: insertError } = await supabase
        .from("chats")
        .insert([{ user_1_id: userId, user_2_id: freelancer.id }])
        .select();

      if (insertError) {
        throw new Error(`Erro ao iniciar conversa: ${insertError.message}`);
      }

      const chat = data[0];
      navigation.navigate("ChatScreen", {
        chatId: chat.id,
        userId: userId,
        freelancerId: freelancer.id,
      });
    } catch (error) {
      console.error(error);
      Alert.alert("Falha ao iniciar a conversa.", "Tente novamente.");
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
