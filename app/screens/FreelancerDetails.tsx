import React from "react";
import { View, StyleSheet } from "react-native";
import Layout from "../components/Layout";
import PersonalCard from "../components/PersonalCard";
import Description from "../components/Description";
import BtnPersonal from "../components/BtnPersonal";
import { Alert } from "react-native";
import SliderDestaque from "../components/SliderDestaque";

interface Freelancer {
  id: number;
  role: string;
  name: string;
  phone: string;
  email: string;
  city: string;
  state: string;
  description: string;
}

interface Props {
  route: any;
}

const FreelancerDetails: React.FC<Props> = ({ route }) => {
  let { freelancer } = route.params;
  console.log(freelancer);

  return (
    <>
      <Layout>
        <PersonalCard freelancer={freelancer} />
        <View style={styles.container}>
          <SliderDestaque />
          <SliderDestaque  />
        </View>
        <Description freelancer={freelancer} />
        <BtnPersonal freelancer={freelancer} />
      </Layout>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 0.5,
    flexWrap:'wrap',
   
    flexDirection:'row',
    
  },

  containerIteins:{
    marginRight:50,
  }
});

export default FreelancerDetails;
