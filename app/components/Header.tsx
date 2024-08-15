import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation, DrawerActions } from "@react-navigation/native";

const Header: React.FC = () => {
  const navigation = useNavigation();

  const openDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity onPress={openDrawer}>
        <Icon name="bars" size={24} color="#f27e26" style={styles.icon} />
      </TouchableOpacity>
      <Text style={styles.headerText}>Meu Perfil</Text>
      <TouchableOpacity onPress={() => navigation.navigate("HomeScreen")}>
        <Icon name="home" size={24} color="#f27e26" style={styles.icon} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#2d47f0',
    paddingTop: 60,
    paddingBottom: 10,
    paddingHorizontal: 40,
  },
  headerText: {
    color: '#f27e26',
    fontFamily: "TitanOne-Regular",
    fontSize: 16,
  },
  icon: {
    marginRight: 10,
  },
});

export default Header;
