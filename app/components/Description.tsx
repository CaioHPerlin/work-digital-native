import React from "react";
import { View, Text, StyleSheet } from "react-native";
import FixedText from "./FixedText";

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
  if (!description || description === "") {
    return <View style={{ marginBottom: 50 }}></View>;
  }

  return (
    <View>
      <FixedText style={styles.text}>Sobre </FixedText>
      <FixedText style={styles.conteudo}>{description}</FixedText>
    </View>
  );
};

export default Description;

const styles = StyleSheet.create({
  text: {
    fontSize: 20,
    margin: 10,
    color: "#f27e26",
    fontWeight: "bold",
  },

  conteudo: {
    fontSize: 16,
    color: "#fff",
    marginHorizontal: 10,
    marginBottom: 10,
    textAlign: "justify",
  },
});
