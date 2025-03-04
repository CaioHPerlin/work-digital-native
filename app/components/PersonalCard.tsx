import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { FlattenedProfile } from "../types";
import ImageWithFallback from "./ImageWithFallback";
import { optimizeImageHighQ } from "../../utils/imageOptimizer";
import FixedText from "./FixedText";

interface Props {
  freelancer: FlattenedProfile;
}

const PersonalCard: React.FC<Props> = ({ freelancer }) => {
  return (
    <>
      <View style={styles.container}>
        <ImageWithFallback
          imageUrl={optimizeImageHighQ(freelancer.profile_picture_url)}
          cache="memory-disk"
          style={styles.image}
        />

        <View style={styles.text}>
          <FixedText style={styles.dados}>{freelancer.name}</FixedText>
          <FixedText style={styles.subDados}>{freelancer.roles}</FixedText>

          <FixedText style={styles.subDados}>
            {freelancer.phone_number}
          </FixedText>
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
