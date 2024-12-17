import React, { useEffect, useState } from "react";
import {
  View,
  Modal,
  StyleSheet,
  TouchableOpacity,
  Alert,
  FlatList,
  TouchableWithoutFeedback,
} from "react-native";
import { Conversation, CustomStackNavigationProp } from "../types";
import { Text } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { supabase } from "../../lib/supabase";
import ImageWithFallback from "../components/ImageWithFallback";
import { optimizeImageLowQ } from "../../utils/imageOptimizer";
import Icon from "react-native-vector-icons/FontAwesome";
import { useChatNotifications } from "../../hooks/ChatNotificationsContext";
import { Image } from "expo-image";
import { SafeAreaView } from "react-native-safe-area-context";
interface Props {
  userId: string;
}

const ChatList: React.FC<Props> = ({ userId }) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedImage, setSelectedImage] = useState<any>(null); // Estado para armazenar a imagem selecionada
  const [modalVisible, setModalVisible] = useState(false); // Estado para controlar o modal
  const navigation = useNavigation<CustomStackNavigationProp>();
  const { messageNotifications, unreadChats } = useChatNotifications();
  const [loading, setLoading] = useState(true);

  const fetchConversations = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("chats")
      .select(
        `          *,
          user_1:profiles!chats_user_1_id_fkey(id, name, is_freelancer),
          user_2:profiles!chats_user_2_id_fkey(id, name, is_freelancer)
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
    freelancerId: string,
    imageUrl: string
  ) => {
    navigation.navigate("ChatScreen", {
      chatId,
      userId,
      freelancerId,
      imageUrl,
    }); // Navigate to the chat screen
  };

  const handleImagePress = async (imageUrl: string) => {
    try {
      const res = await fetch(imageUrl);
      if (res.ok) {
        setSelectedImage({ uri: imageUrl });
      } else {
        setSelectedImage(require("../../assets/images/user.jpg"));
      }
    } catch (error) {
      setSelectedImage(require("../../assets/images/user.jpg"));
    } finally {
      setModalVisible(true); // Mostra o modal
    }
  };

  const closeModal = () => {
    setModalVisible(false); // Fecha o modal
    setSelectedImage(null); // Limpa a imagem selecionada
  };

  const renderConversation = ({ item }: { item: Conversation }) => {
    const isOtherUserFreelancer =
      userId === item.user_2_id
        ? item.user_1.is_freelancer
        : item.user_2.is_freelancer;
    const otherUserId =
      userId === item.user_2_id ? item.user_1_id : item.user_2_id;

    const imageUrl = isOtherUserFreelancer
      ? optimizeImageLowQ(
          `https://res.cloudinary.com/dwngturuh/image/upload/profile_pictures/${otherUserId}.jpg`
        )
      : require("../../assets/images/user.jpg");

    return (
      <TouchableOpacity
        onPress={() =>
          navigateToChat(
            item.id,
            userId,
            userId === item.user_2_id ? item.user_1_id : item.user_2_id,
            imageUrl
          )
        }
        style={styles.itemContainer}
      >
        <TouchableOpacity onPress={() => handleImagePress(imageUrl)}>
          <ImageWithFallback imageUrl={imageUrl} style={styles.image} />
        </TouchableOpacity>
        <View style={styles.textContainer}>
          <Text style={styles.nameText}>
            {userId === item.user_2_id ? item.user_1.name : item.user_2.name}
          </Text>

          {/* If there are unread messages, show the unread messages count */}
          {unreadChats.includes(item.id) && (
            <View style={styles.unreadCountContainer}>
              <Text style={styles.unreadCountText}>
                {messageNotifications[item.id]}
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Icon name="arrow-left" size={25} color={"#f27e26"} />
        </TouchableOpacity>
        <Text style={styles.headerText}>
          {conversations ? "Conversas" : "Carregando..."}
        </Text>
      </View>
      {loading ? (
        <Text style={styles.loadingText}>
          Recuperando histórico de conversas...
        </Text>
      ) : conversations.length > 0 ? (
        <FlatList renderItem={renderConversation} data={conversations} />
      ) : (
        <Text style={styles.noConversationsText}>
          Você ainda não possui nenhuma conversa
        </Text>
      )}

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          {selectedImage && (
            <TouchableWithoutFeedback onPress={closeModal}>
              <View style={styles.modalContent}>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={closeModal}
                >
                  <Icon name="close" size={25} color="#f27e26" />
                </TouchableOpacity>
                <TouchableWithoutFeedback>
                  <Image
                    source={selectedImage}
                    style={styles.fullScreenImage}
                  />
                </TouchableWithoutFeedback>
              </View>
            </TouchableWithoutFeedback>
          )}
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    backgroundColor: "#2d47f0",
    height: 80,
    alignItems: "center",
    paddingHorizontal: 20,
    flexDirection: "row",
    gap: 20,
  },
  headerText: {
    color: "#f27e26",
    fontFamily: "TitanOne-Regular",
    fontSize: 20,
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 2,
    borderColor: "#FFC88d",
    backgroundColor: "#ffffff",
    borderRadius: 5,
  },
  textContainer: {
    flex: 1,
    justifyContent: "space-between",
    flexDirection: "row",
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
  loadingText: {
    textAlign: "center",
    marginTop: 250,
    color: "#aaa",
  },
  noConversationsText: {
    textAlign: "center",
    marginTop: 250,
    color: "#aaa",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
  },
  unreadCountContainer: {
    backgroundColor: "#f27e26", // Orange color for the circle
    width: 24, // Width and height to make it circular
    height: 24,
    borderRadius: 12, // Half of width/height for perfect circle
    justifyContent: "center",
    alignItems: "center", // Center the text
  },
  unreadCountText: {
    color: "#fff", // White text inside the circle
    fontWeight: "bold",
    fontSize: 12, // Adjust font size to fit inside the circle
  },
  modalBackground: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 20,
    zIndex: 1, // Garante que o botão de fechar fique acima da imagem
  },
  fullScreenImage: {
    width: "90%",
    aspectRatio: 1,
    resizeMode: "contain",
  },
});

export default ChatList;
