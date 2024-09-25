import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { FlattenedProfile } from "../types";
import Description from "./Description";
import ImageWithFallback from "./ImageWithFallback";

interface Props {
  freelancer: FlattenedProfile;
}

const PersonalCard: React.FC<Props> = ({ freelancer }) => {
  return (
    <>
      <View style={styles.container}>
        <Image source={freelancer.profile_picture_url} style={styles.image} />

        <View style={styles.text}>
          <Text style={styles.dados}>{freelancer.name}</Text>
          <Text style={styles.subDados}>{freelancer.roles}</Text>

          <Text style={styles.subDados}>{freelancer.phone_number}</Text>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingRight: 35,
    marginTop: 30,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  image: {
    width: 100,
    height: 100,
    margin: 10,
    borderRadius: 70,
  },
  dados: {
    paddingRight: 120,
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },

  subDados: {
    fontSize: 18,
    marginBottom: 5,
    color: "#fcfcfc",
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

export default PersonalCard;
