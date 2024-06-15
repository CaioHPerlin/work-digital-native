import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { Icon, MD3Colors } from "react-native-paper";

export default function PersonalCard() {
  return (
    <>
      <View style={styles.container}>
        <Image
          source={{
            uri: "https://e7.pngegg.com/pngimages/674/156/png-clipart-computer-icons-user-blue-people-icon-logo-silhouette.png",
          }}
          style={styles.image}
        />

        <View style={styles.text}>
          <Text style={styles.dados}>Willian Henrique Cardoso Dos Santos </Text>
          <Text style={styles.subDados}>Desenvolvedor Front End </Text>
          <Text style={styles.subDados}>67 99999 9999</Text>
          <View>
            <Text style={styles.subDados}>Minhas Redes </Text>
            <View style={styles.icons}>
            <Icon source="whatsapp" color={"green"} size={40} />
              <Icon source="instagram" color={"#E1306C"} size={40} />
              <Icon source="facebook" color={"blue"} size={40} />
              
            </View>
          </View>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingRight: 15,

    flexDirection: "row",
    alignItems: "center",
  },
  image: {
    width: 100,
    height: 100,
    margin: 10,
    borderRadius: 50,
  },
  dados: {

    fontSize: 16,
    color:'black',
    fontWeight: "bold",

  },

  subDados: {
    fontSize: 14,
    color: "#3f3f3f",
  },
  text: {
    margin: 0,
    padding: 5,
    fontSize: 16,
    color: "black",
  },
  icons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
