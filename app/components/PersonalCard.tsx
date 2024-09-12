import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { Icon, MD3Colors } from "react-native-paper";
import { FlattenedProfile } from "../types";
import Description from "./Description";

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
              : require("../../assets/images/user.jpg")
          }
          style={styles.image}
        />

        <View style={styles.text}>
          <Text style={styles.dados}>{freelancer.name}</Text>
        {/* Retirei o map para ficar apenas uma role para fazer o design da tela, porem deve ser atualizado para a role selecionada pois ele quer que mostre apenas o cargo selecioado   */}
            <Text style={styles.subDados} >
              {freelancer.roles[0]}
            </Text>
         
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
    paddingRight:120,

    fontSize: 24,
    color: "black",
    fontWeight: "bold",
    color:"#fff"
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
