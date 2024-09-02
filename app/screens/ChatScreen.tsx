import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import * as Animatable from "react-native-animatable";
import { supabase } from "../../lib/supabase";

interface ChatScreenProps {
  route: { params: { chatId: string; userId: string; freelancerId: string } };
}

interface Message {
  id: string;
  chat_id: string;
  sender_id: string;
  content: string;
  created_at: string;
}

const ChatScreen: React.FC<ChatScreenProps> = ({ route }) => {
  const { chatId, userId, freelancerId } = route.params;

  const [targetUserName, setTargetUserName] = useState("Carregando...");
  const [targetUserPicture, setTargetUserPicture] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const flatListRef = useRef<FlatList<Message>>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("chat_id", chatId)
        .order("created_at", { ascending: true });

      if (error) {
        return Alert.alert(
          "Erro ao buscar mensagens.",
          "Tente novamente mais tarde."
        );
      }

      setMessages(data as Message[]);

      setTimeout(
        () => flatListRef.current?.scrollToEnd({ animated: true }),
        50
      );
    };

    const fetchTargetUser = async () => {
      const { data, error } = await supabase
        .from("profiles") // Adjust table name as necessary
        .select("*")
        .eq("id", freelancerId)
        .single();

      if (error) {
        console.error("Error fetching target user:", error);
      } else {
        setTargetUserName(data?.name || "Unknown User");
        setTargetUserPicture(data?.profile_picture_url || "");
      }
    };
    fetchTargetUser();
    fetchMessages();
  }, [chatId, freelancerId]);

  useEffect(() => {
    const channel = supabase
      .channel(chatId)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
        },
        (payload) => {
          addMessage({
            id: payload.new.id,
            chat_id: payload.new.chat_id,
            sender_id: payload.new.sender_id,
            content: payload.new.content,
            created_at: payload.new.created_at,
          });
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [chatId]);

  useEffect(() => {
    flatListRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const addMessage = async (message: Message) => {
    setMessages((prevMessages) => [...prevMessages, message]);
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const { data, error } = await supabase.from("messages").insert([
      {
        chat_id: chatId,
        sender_id: userId,
        content: newMessage,
        created_at: new Date().toISOString(), // Use ISO string for datetime
      },
    ]);

    if (error) {
      console.error("Error sending message:", error);
    } else {
      setNewMessage("");
      flatListRef.current?.scrollToEnd({ animated: true });
    }
  };

  const renderItem = ({ item }: { item: Message }) => (
    <Animatable.View
      animation={"fadeInUp"}
      duration={200}
      style={[
        styles.message,
        item.sender_id === userId ? styles.selfMessage : styles.otherMessage,
      ]}
    >
      <Text style={styles.messageText}>{item.content}</Text>
    </Animatable.View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>{targetUserName}</Text>
      </View>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.chatContainer}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.messageList}
        />
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            value={newMessage}
            onChangeText={setNewMessage}
            placeholder="Type a message..."
            placeholderTextColor="#888"
          />
          <TouchableOpacity
            onPress={handleSendMessage}
            style={styles.sendButton}
          >
            <Icon name="send" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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
  chatContainer: {
    flex: 1,
    padding: 10,
    justifyContent: "space-between",
  },
  messageList: {
    flexGrow: 1,
  },
  message: {
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
    maxWidth: "80%",
  },
  selfMessage: {
    backgroundColor: "#f27e26",
    alignSelf: "flex-end",
  },
  otherMessage: {
    backgroundColor: "#2d47f0",
    alignSelf: "flex-start",
  },
  messageText: {
    color: "#fff",
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    paddingVertical: 10,
  },
  textInput: {
    flex: 1,
    borderRadius: 20,
    padding: 10,
    backgroundColor: "#f0f0f0",
    fontSize: 16,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: "#2d47f0",
    padding: 10,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ChatScreen;
