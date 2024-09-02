import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { Icon, MD3Colors } from "react-native-paper";
import { FlattenedProfile } from "../types";

interface Props {
  freelancer: FlattenedProfile;
}

const PersonalCard: React.FC<Props> = ({ freelancer }) => {
  return (
    <>
      <View style={styles.container}>
        <Image
          source={
            freelancer.profile_picture_url
              ? {
                  uri: freelancer.profile_picture_url,
                }
              : require("../../assets/images/favicon.png")
          }
          style={styles.image}
        />

        <View style={styles.text}>
          <Text style={styles.dados}>{freelancer.name}</Text>
          {freelancer.roles.map((role) => (
            <Text style={styles.subDados} key={role}>
              {role}
            </Text>
          ))}

          <Text style={styles.subDados}>{freelancer.phone_number}</Text>
        </View>
        <View>
          <Text style={styles.titleRedes}>Minhas Redes </Text>
          <View style={styles.icons}>
            <Icon source="whatsapp" color={"green"} size={40} />
            <Icon source="instagram" color={"#E1306C"} size={40} />
            <Icon source="facebook" color={"blue"} size={40} />
          </View>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingRight: 15,
    marginTop: 30,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    //justifyContent:'space-around'
  },
  image: {
    width: 100,
    height: 100,
    margin: 10,
    borderRadius: 50,
  },
  dados: {
    fontSize: 20,
    color: "black",
    fontWeight: "bold",
  },

  subDados: {
    fontSize: 14,
    marginBottom: 5,
    color: "#3f3f3f",
  },
  titleRedes: {
    fontSize: 14,
    marginBottom: 35,
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

export default PersonalCard;
