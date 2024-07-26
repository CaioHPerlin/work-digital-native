import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { Icon, MD3Colors } from "react-native-paper";

interface Props {
  freelancer: {
    name: string;
    roles: string[];
    phone: string;
    profilePictureUrl: string;
  };
}

const PersonalCard: React.FC<Props> = ({ freelancer }) => {
  return (
    <>
      <View style={styles.container}>
        <Image
          source={{
            uri: freelancer.profilePictureUrl,
          }}
          style={styles.image}
        />

        <View style={styles.text}>
          <Text style={styles.dados}>{freelancer.name}</Text>
          {freelancer.roles.map((role) => (
            <Text style={styles.subDados} key={role}>
              {role}
            </Text>
          ))}

          <Text style={styles.subDados}>{freelancer.phone}</Text>
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
};

const styles = StyleSheet.create({
  container: {
    paddingRight: 15,
    marginTop: 30,
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
    color: "black",
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

export default PersonalCard;
