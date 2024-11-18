import React, { useEffect, useState, useRef, useCallback } from "react";
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
  ScrollView,
  Keyboard,
  EmitterSubscription,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import * as Animatable from "react-native-animatable";
import { supabase } from "../../lib/supabase";
import { useFocusEffect } from "expo-router";
import { useChatNotifications } from "../../hooks/ChatNotificationsContext";
import ImageWithFallback from "../components/ImageWithFallback";

interface ChatScreenProps {
  route: {
    params: {
      chatId: string;
      userId: string;
      freelancerId: string;
      imageUrl: string;
      initialMessage?: string;
    };
  };
}

interface Message {
  id?: string;
  chat_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  temp?: boolean;
}

const ChatScreen: React.FC<ChatScreenProps> = ({ route }) => {
  const { chatId, userId, freelancerId, imageUrl, initialMessage } =
    route.params;

  const [targetUserName, setTargetUserName] = useState("Carregando...");
  const [targetUserPicture, setTargetUserPicture] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState(
    initialMessage ? initialMessage : ""
  );
  const { markChatAsRead } = useChatNotifications();
  const flatListRef = useRef<FlatList<Message>>(null);

  useFocusEffect(
    useCallback(() => {
      return () => {
        const markChatAsReadAsync = async () => {
          try {
            // Mark chat as read
            await markChatAsRead(chatId);
          } catch (error) {
            console.error(
              "Error marking chat as read or fetching notifications:",
              error
            );
          }
        };

        // Call the async function
        markChatAsReadAsync();
      };
    }, [chatId, userId])
  );
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
          // Check if the message belongs to this chat.
          if (payload.new.chat_id !== chatId) {
            return;
          }
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

  const addMessage = (message: Message) => {
    setMessages((prevMessages) => {
      // Check if the message already exists (optimistically added)
      const messageExists = prevMessages.some((msg) => msg.id === message.id);

      // If it doesn't exist, add it
      if (!messageExists) {
        return [...prevMessages, message];
      }

      return prevMessages;
    });
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const tempMessage = {
      id: Date.now().toString(), // Temporary ID
      chat_id: chatId,
      sender_id: userId,
      content: newMessage,
      created_at: new Date().toISOString(),
      temp: true,
    };

    // Optimistically add the message to the list
    setMessages((prevMessages) => [...prevMessages, tempMessage]);
    setNewMessage("");

    // Insert message into the database
    const { data, error } = await supabase
      .from("messages")
      .insert([
        {
          chat_id: chatId,
          sender_id: userId,
          content: newMessage,
          created_at: new Date().toISOString(),
        },
      ])
      .select();

    if (error) {
      console.error("Error sending message:", error);
    } else if (data) {
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.temp && msg.id === tempMessage.id ? data[0] : msg
        )
      );
    }
  };

  const renderItem = ({ item }: { item: Message }) => {
    const isNewMessage = !item.id || item.temp;
    const isMyMessage = item.sender_id === userId;
    const date = new Date(item.created_at);

    // Formatting to 'DD/MM HH:mm'
    const formattedTimestamp =
      String(date.getDate()).padStart(2, "0") +
      "/" +
      String(date.getMonth() + 1).padStart(2, "0") +
      " " +
      String(date.getHours()).padStart(2, "0") +
      ":" +
      String(date.getMinutes()).padStart(2, "0");

    return (
      <Animatable.View
        animation={isNewMessage ? "fadeInUp" : undefined} // Apply animation only to new messages
        duration={200}
        style={[
          styles.message,
          isMyMessage ? styles.selfMessage : styles.otherMessage,
        ]}
      >
        <Text style={styles.messageText}>{item.content}</Text>
        <Text style={styles.messageTimestampText}>{formattedTimestamp}</Text>
      </Animatable.View>
    );
  };

  const capitalize = (str: string) => {
    return str
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  useEffect(() => {
    let keyboardDidShowListener: EmitterSubscription;
    let keyboardDidHideListener: EmitterSubscription;

    const scrollToEnd = () => {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100); // smooth scrolling
    };

    const keyboardDidShow = () => {
      scrollToEnd();
    };

    const keyboardDidHide = () => {
      scrollToEnd();
    };

    keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      keyboardDidShow
    );
    keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      keyboardDidHide
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ImageWithFallback imageUrl={imageUrl} style={styles.image} />
        <Text numberOfLines={1} ellipsizeMode="tail" style={styles.headerText}>
          {capitalize(targetUserName)}
        </Text>
      </View>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.chatContainer}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderItem}
          keyExtractor={(item) =>
            item.id || `${item.created_at}_${messages.indexOf(item)}`
          }
          contentContainerStyle={styles.messageList}
          onContentSizeChange={() =>
            flatListRef.current?.scrollToEnd({ animated: true })
          }
        />

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            value={newMessage}
            multiline={true}
            onChangeText={setNewMessage}
            placeholder="Digite a mensagem"
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
    paddingHorizontal: 20,
    flexWrap: "nowrap",
    flexDirection: "row", // Aligns items horizontally
    alignItems: "center", // Centers items vertically within the row
  },
  headerText: {
    color: "#f27e26",
    fontFamily: "TitanOne-Regular",
    overflow: "hidden",
    maxWidth: "90%",
    fontSize: 20,
    marginLeft: 10, // Adds space between the image and text
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
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
  messageTimestampText: {
    color: "#fff",
    opacity: 0.6,
    fontSize: 12,
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
