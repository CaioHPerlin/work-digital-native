import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { Icon, MD3Colors } from "react-native-paper";
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
        <ImageWithFallback
          cache={false}
          imageUrl={freelancer.profile_picture_url}
          style={styles.image}
        />

        <View style={styles.text}>
          <Text style={styles.dados}>{freelancer.name}</Text>
          <Text style={styles.subDados}>{freelancer.roles}</Text>

          <Text style={styles.subDados}>{freelancer.phone_number}</Text>
        </View>
        {/* <View>
        <Text style={styles.titleRedes}>Minhas Redes </Text>
          <View style={styles.icons}>
            <Icon source="whatsapp" color={"green"} size={40} />
            <Icon source="instagram" color={"#E1306C"} size={40} />
            <Icon source="facebook" color={"blue"} size={40} />
          </View>
        </View> */}
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
    // borderWidth:3,
    // borderColor:"#000"
    //justifyContent:'space-around'
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
