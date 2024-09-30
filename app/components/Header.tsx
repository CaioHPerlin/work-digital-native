import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { useNavigation, DrawerActions } from "@react-navigation/native";
import { CustomStackNavigationProp } from "../types";
import useChatNotifications from "../../hooks/useChatNotifications";
interface HeaderProps {
  title?: string;
  userId: string;
}

const Header: React.FC<HeaderProps> = ({ title = "Meu Perfil", userId }) => {
  const navigation = useNavigation<CustomStackNavigationProp>();
  const { unreadChats } = useChatNotifications(userId);

  const openDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  console.log(unreadChats);

  const openChatScreen = () => {
    navigation.navigate("ChatList");
  };

  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity onPress={openDrawer} style={styles.btnHamburger}>
        <Icon name="bars" size={24} color="#f27e26" style={styles.icon} />
      </TouchableOpacity>
      <Text style={styles.headerText}>{title}</Text>
      <TouchableOpacity onPress={openChatScreen}>
        {unreadChats.length > 0 && (
          <View
            style={{
              position: "absolute",
              right: -10,
              top: -10,
              backgroundColor: "red",
              borderRadius: 12,
              width: 24,
              height: 24,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text style={{ color: "white", fontSize: 12 }}>
              {unreadChats.length}
            </Text>
          </View>
        )}
        <Icon name="comments" size={24} color="#f27e26" style={styles.icon} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#2d47f0",
    paddingTop: 45,
    paddingBottom: 15,
    paddingHorizontal: 40,
  },
  headerText: {
    color: "#f27e26",
    fontFamily: "TitanOne-Regular",
    fontSize: 16,
  },
  icon: {
    marginRight: 10,
  },
  btnHamburger: {
    padding: 5,
  },
});

export default Header;
