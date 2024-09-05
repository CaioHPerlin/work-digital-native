import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface Props {
  freelancer: {
    name: string;
    roles: string[];
    phone: string;
    profilePictureUrl: string;
    description: string;
  };
}

const Description: React.FC<Props> = ({ freelancer }) => {
  const { description } = freelancer;
  return (
    <View>
      <Text style={styles.text}>Sobre </Text>
      <Text style={styles.conteudo}>{description}</Text>
    </View>
  );
};

export default Description;

const styles = StyleSheet.create({
  text: {
    fontSize: 20,
    color: "black",
    margin: 10,
    color:"#f27e26", 
    fontWeight: "bold",
  },

  conteudo: {
    fontSize: 16,
    color: "#fff",
    marginHorizontal: 10,
    marginBottom:10,
    textAlign: "justify",
  },
});
