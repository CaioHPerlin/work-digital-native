import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  StatusBar,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { useNavigation, DrawerActions } from "@react-navigation/native";
import { CustomStackNavigationProp } from "../types";
import { useChatNotifications } from "../../hooks/ChatNotificationsContext";

interface HeaderProps {
  title?: string;
}

const Header: React.FC<HeaderProps> = ({ title = "Meu Perfil" }) => {
  const { unreadChatAmount } = useChatNotifications();
  const navigation = useNavigation<CustomStackNavigationProp>();

  const openDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

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
        {unreadChatAmount > 0 && (
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
              {unreadChatAmount}
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
    backgroundColor: "#2d47f0",
    height: 80,
    alignItems: "center",
    paddingHorizontal: 40,
    paddingTop: Platform.OS === "ios" ? StatusBar.currentHeight || 20 : 0,
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
