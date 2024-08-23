import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { useNavigation, DrawerActions } from "@react-navigation/native";
import { CustomStackNavigationProp } from "../types";

interface HeaderProps {
  title?: string;
}

const Header: React.FC<HeaderProps> = ({ title = "Meu Perfil" }) => {
  const navigation = useNavigation<CustomStackNavigationProp>();

  const openDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  const openChatScreen = () => {
    navigation.navigate("ChatList");
  };

  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity onPress={openDrawer}>
        <Icon name="bars" size={24} color="#f27e26" style={styles.icon} />
      </TouchableOpacity>
      <Text style={styles.headerText}>{title}</Text>
      <TouchableOpacity onPress={openChatScreen}>
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
    paddingTop: 50,
    paddingBottom: 20,
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
});

export default Header;
