import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Title } from "react-native-paper";
import Slider from "../components/Slider";
import PersonalCard from "../components/PersonalCard";
import Description from "../components/Description";
import BtnPersonal from "../components/BtnPersonal";
import Layout from "../components/Layout";

export default function PersonalInfo() {
  return (
    <>
      <View style= {styles.dadosFreelancer}>
      <PersonalCard />
      <Text>teste</Text>
      </View>
      <Slider />
      <Description />
      <BtnPersonal />
    </>
  );
}

const styles = StyleSheet.create({
dadosFreelancer:{
backgroundColor: "#f27e26"
}
})


