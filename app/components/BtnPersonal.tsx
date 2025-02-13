import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Alert,
  BackHandler,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

import { Icon } from "react-native-paper";
import {
  CustomStackNavigationProp,
  FlattenedProfile,
  HighlightImage,
} from "../types";
import { supabase } from "../../lib/supabase";
import SliderDestaque from "./SliderDestaque";
import { optimizeImageLowQ } from "../../utils/imageOptimizer";
import FixedText from "./FixedText";

interface Props {
  freelancer: FlattenedProfile;
  highlight: HighlightImage | null;
}

const BtnPersonal: React.FC<Props> = ({ freelancer, highlight }) => {
  const [userId, setUserId] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [initialMessage, setInitialMessage] = useState("");
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
      const imageUrl = freelancer.profile_picture_url
        ? optimizeImageLowQ(
            `https://res.cloudinary.com/dwngturuh/image/upload/profile_pictures/${freelancer.id}.jpg`
          )
        : require("../../assets/images/user.jpg");

      if (existingChats.length > 0) {
        // Chat already exists
        const existingChat = existingChats[0];
        navigation.navigate("ChatScreen", {
          chatId: existingChat.id,
          userId: userId,
          freelancerId: freelancer.id,
          imageUrl: imageUrl,
          initialMessage: initialMessage,
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
        imageUrl: imageUrl,
        initialMessage: initialMessage,
      });
    } catch (error) {
      console.error(error);
      Alert.alert("Falha ao iniciar a conversa.", "Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const [isPickerVisible, setPickerVisible] = useState<boolean>(false);

  return (
    <View style={styles.buttonContainer}>
      <TouchableOpacity
        style={styles.buttonWhats}
        onPress={handleWhatsAppPress}
      >
        <Icon source="whatsapp" color={"white"} size={57} />
      </TouchableOpacity>
      {highlight && highlight.images.length > 0 && (
        <View>
          <SliderDestaque
            setInitialMessage={setInitialMessage}
            startConversation={handleStartConversation}
            highlight={{ ...highlight }}
            key={0}
            isPickerVisible={isPickerVisible}
            setPickerVisible={setPickerVisible}
            index={0}
            //onLastItemVisible={handleLastItemVisible}
          />
        </View>
      )}
      <TouchableOpacity
        style={styles.button}
        // disabled={loading}
        onPress={handleStartConversation}
      >
        <Text>
          {loading ? (
            <Icon source="dots-horizontal" color={"white"} size={48} />
          ) : (
            <Icon source="chat" color={"white"} size={48} />
          )}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default BtnPersonal;

const styles = StyleSheet.create({
  buttonContainer: {
    backgroundColor: "#2d47f0",
    borderWidth: 1,
    borderColor: "#f27e26",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 5,
    paddingVertical: 5,
  },
  button: {
    backgroundColor: "#2d47f0",
    borderRadius: 50,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#f27e26",
  },
  buttonWhats: {
    backgroundColor: "#25D366",
    flexDirection: "row",
    borderRadius: 50,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
  },
});
