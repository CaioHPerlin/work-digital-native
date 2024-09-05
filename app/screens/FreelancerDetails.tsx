import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import PersonalCard from "../components/PersonalCard";
import Description from "../components/Description";
import BtnPersonal from "../components/BtnPersonal";
import SliderDestaque from "../components/SliderDestaque";

interface Props {
  route: any;
}

const FreelancerDetails: React.FC<Props> = ({ route }) => {
  let { freelancer } = route.params;
  console.log(freelancer);


  return (
    <>
    <View style={styles.geral}>
    <View style={styles.dadosFreelancer}>
      <PersonalCard freelancer={freelancer} />
      <Description freelancer={freelancer} />
      </View>

        <BtnPersonal freelancer={freelancer} />
  
        </View>
        <View></View>
      
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 0.5,
    flexWrap: "wrap",
    flexDirection: "row",
  },
  dadosFreelancer:{
    margin:0,
    borderWidth:5,
    borderColor: "#2d47f0"
    },
    geral:{
      backgroundColor:"#2d47f0",
  
    }

});

export default FreelancerDetails;
