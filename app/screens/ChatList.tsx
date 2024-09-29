import React, { useEffect, useState } from "react";
import { View } from "react-native-animatable";
import { Conversation, CustomStackNavigationProp } from "../types";
import * as Animatable from "react-native-animatable";
import {
  Alert,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Icon, Text } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { supabase } from "../../lib/supabase";
import ImageWithFallback from "../components/ImageWithFallback";
import useChatNotifications from "../../hooks/useChatNotifications";
import { optimizeImageLowQ } from "../../utils/imageOptimizer";

interface Props {
  userId: string;
}

const ChatList: React.FC<Props> = ({ userId }) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const navigation = useNavigation<CustomStackNavigationProp>();
  const { markChatAsRead, unreadChats } = useChatNotifications(userId);
  const [loading, setLoading] = useState(true);

  const fetchConversations = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("chats")
      .select(
        `
          *,
          user_1:profiles!chats_user_1_id_fkey(id, name),
          user_2:profiles!chats_user_2_id_fkey(id, name)
        `
      )
      .or(`user_1_id.eq.${userId},user_2_id.eq.${userId}`)
      .order("updated_at", { ascending: false });

    if (error) {
      console.log(error);
      setLoading(false);
      setConversations([]);
      return Alert.alert(
        "Falha no carregamento.",
        "Erro ao carregar histórico de mensagens"
      );
    }

    setConversations(data);
    setLoading(false);
  };

  useEffect(() => {
    if (userId) {
      fetchConversations();
    }
  }, [userId]);

  const navigateToChat = (
    chatId: string,
    userId: string,
    freelancerId: string
  ) => {
    markChatAsRead(chatId, userId);
    navigation.navigate("ChatScreen", { chatId, userId, freelancerId }); // Navigate to the chat screen
  };

  const renderConversation = ({ item }: { item: Conversation }) => {
    const imageUrl = optimizeImageLowQ(
      `https://res.cloudinary.com/dwngturuh/image/upload/profile_pictures/${
        userId === item.user_2_id ? item.user_1.id : item.user_2.id
      }.jpg`
    );

    return (
      <TouchableOpacity
        onPress={() =>
          navigateToChat(
            item.id,
            userId,
            userId === item.user_2_id ? item.user_1_id : item.user_2_id
          )
        }
        style={styles.itemContainer}
      >
        <ImageWithFallback imageUrl={imageUrl} style={styles.image} />
        <View style={styles.textContainer}>
          <Text style={styles.nameText}>
            {userId === item.user_2_id ? item.user_1.name : item.user_2.name}
          </Text>
          {unreadChats.includes(item.id) && (
            <Icon size={15} color="#f27e26" source={"circle"} />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>
          {conversations ? "Conversas" : "Carregando..."}
        </Text>
      </View>
      {loading ? (
        <Animatable.Text
          animation="bounce"
          iterationCount="infinite"
          style={{
            textAlign: "center",
            marginTop: 250,
            color: "#aaa",
          }}
        >
          Recuperando histórico de conversas...
        </Animatable.Text>
      ) : conversations.length > 0 ? (
        <Animatable.View animation="fadeInUp">
          <FlatList renderItem={renderConversation} data={conversations} />
        </Animatable.View>
      ) : (
        <Text
          style={{
            textAlign: "center",
            marginTop: 250,
            color: "#aaa",
          }}
        >
          Você ainda não possui nenhuma conversa
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    backgroundColor: "#2d47f0",
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 40,
  },
  headerText: {
    color: "#f27e26",
    fontFamily: "TitanOne-Regular",
    fontSize: 20,
  },
  conversation: {
    flex: 1,
    borderBottomColor: "#888",
    borderBottomWidth: 2,
    height: 120,
  },
  flatlist: {
    flex: 1,
  },
  itemContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderColor: "#FFC88d",
    borderBottomWidth: 2,
    backgroundColor: "#ffffff",
    borderRadius: 5,
  },
  textContainer: {
    flex: 1,
    justifyContent: "space-between",
    flexDirection: "row",
    flexWrap: "nowrap",
    alignItems: "center",
    marginLeft: 10,
    marginRight: 20,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  nameText: {
    fontSize: 20,
  },
  roleText: {
    fontSize: 18,
    color: "#666",
  },
});

export default ChatList;
