import { getConversationById, sendMessage } from "@/api/conversationApi";
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  Platform,
  TouchableOpacity,
  KeyboardAvoidingView,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import * as Animatable from "react-native-animatable";

interface Message {
  id: string;
  sender: string;
  content: string;
}

interface ChatScreenProps {
  route: { params: { conversationId: string } };
}

interface Conversation {
  id: string;
  user_id: string;
  freelancer_id: string;
  freelancer_name?: string;
}

const ChatScreen: React.FC<ChatScreenProps> = ({ route }) => {
  const { conversationId } = route.params;
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [conversation, setConversation] = useState<Conversation>();
  const [loading, setLoading] = useState(false);
  const flatListRef = useRef<FlatList<Message>>(null);

  useEffect(() => {
    const fetchConversation = async () => {
      try {
        setLoading(true);
        const result = await getConversationById(conversationId);
        setMessages(result.messages);
        setConversation(result.conversation);
      } catch (error) {
        console.error("Error fetching conversation:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchConversation();
  }, [conversationId]);

  useEffect(() => {
    // Scroll to the bottom
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) {
      return;
    }

    if (!conversation) {
      return;
    }
    try {
      const message = newMessage;
      setNewMessage("");
      const senderId = await conversation.user_id;

      const response = await sendMessage(conversationId, senderId, newMessage);

      // Use the response to update state
      const { messageId } = response;

      setMessages((prevMessages) => [
        ...prevMessages,
        {
          id: messageId.toString(),
          sender: senderId,
          content: newMessage,
        },
      ]);
      console.log(messages);

      // Scroll to the bottom
      if (flatListRef.current) {
        flatListRef.current.scrollToEnd({ animated: true });
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const renderItem = ({ item }: { item: Message }) => (
    <Animatable.View
      animation={"fadeInUp"}
      duration={200}
      style={[
        styles.message,
        item.sender !== conversation?.freelancer_id
          ? styles.selfMessage
          : styles.otherMessage,
      ]}
    >
      <Text style={styles.messageText}>{item.content}</Text>
    </Animatable.View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>
          {loading ? "Carregando..." : conversation?.freelancer_name}
        </Text>
      </View>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ ...styles.chatContainer, opacity: conversation ? 1 : 0.5 }}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
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
            disabled={loading && conversation != undefined}
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
