import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function Description() {
  return (
    <View >
      <Text style={styles.text}>Descrição</Text>
      <Text style={styles.conteudo}>
        Lorem Ipsum is simply dummy text of the printing and typesetting
        industry. Lorem Ipsum has been the industry's standard dummy text ever
        since the 1500s, when an unknown printer took a galley of type and
        scrambled it to make a type specimen book. It has survived not only five
        centuries, but also the when an unknown printer took a galley of type and
        scrambled it to make a type specimen book. It has survived not only five
        centuries, but also the
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 20,
    color: "black",
    margin: 10,
  },

  conteudo: {
    fontSize: 16,
    color: "black",
    margin: 10,
    textAlign: "justify",
  },
});
