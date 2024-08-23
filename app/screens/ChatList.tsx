import React, { useEffect, useState } from "react";
import { View } from "react-native-animatable";
import { Conversation, CustomStackNavigationProp } from "../types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Animatable from "react-native-animatable";
import { getConversationsByUser } from "@/api/conversationApi";
import {
  Alert,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Text } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";

const ChatList: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const navigation = useNavigation<CustomStackNavigationProp>();
  const [loading, setLoading] = useState(false);

  const fetchConversations = async () => {
    const id = await AsyncStorage.getItem("id");
    if (!id) {
      return Alert.alert(
        "Falha no carregamento.",
        "Erro ao carregar histórico de mensagens"
      );
    }
    const result = await getConversationsByUser(id);
    setConversations(result);
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  const navigateToChat = (conversationId: string) => {
    navigation.navigate("ChatScreen", { conversationId }); // Navigate to the chat screen
  };

  const renderConversation = ({ item }: { item: Conversation }) => {
    return (
      <TouchableOpacity
        onPress={() => navigateToChat(item.id)}
        style={styles.itemContainer}
      >
        <Image
          source={{
            uri: `https://res.cloudinary.com/dwngturuh/image/upload/profile-pictures/${item.freelancer_profile_id}.jpg`,
          }}
          style={styles.image}
        />
        <View style={styles.textContainer}>
          <Text style={styles.nameText}>{item.freelancer_name}</Text>
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
