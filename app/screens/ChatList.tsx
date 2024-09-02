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
import { Text } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { supabase } from "../../lib/supabase";

const ChatList: React.FC = () => {
  const [userId, setUserId] = useState("");
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const navigation = useNavigation<CustomStackNavigationProp>();
  const [loading, setLoading] = useState(false);

  const fetchUserId = async () => {
    const { data } = await supabase.auth.getSession();
    setUserId(data.session?.user.id || "");
  };

  const fetchConversations = async () => {
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
      return Alert.alert(
        "Falha no carregamento.",
        "Erro ao carregar histórico de mensagens"
      );
    }

    setConversations(data);
  };

  useEffect(() => {
    fetchUserId();
  }, []);

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
    navigation.navigate("ChatScreen", { chatId, userId, freelancerId }); // Navigate to the chat screen
  };

  const renderConversation = ({ item }: { item: Conversation }) => {
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
        <Image
          source={require("../../assets/images/user.jpg")}
          style={styles.image}
        />
        <View style={styles.textContainer}>
          <Text style={styles.nameText}>
            {userId === item.user_2_id ? item.user_1.name : item.user_2.name}
          </Text>
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
        <Text
          style={{
            textAlign: "center",
            marginTop: 250,
            color: "#aaa",
          }}
        >
          Recuperando histórico de conversas...
        </Text>
      ) : conversations.length != 0 ? (
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
    marginLeft: 10,
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
