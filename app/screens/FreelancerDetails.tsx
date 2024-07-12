import React from "react";
import Layout from "../components/Layout";
import PersonalCard from "../components/PersonalCard";
import Description from "../components/Description";
import BtnPersonal from "../components/BtnPersonal";
import { Alert } from "react-native";
import Slider from "../components/Slider";

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

        <Slider />
        <Description freelancer={freelancer} />
        <BtnPersonal freelancer={freelancer} />
      </Layout>
    </>
  );
};

export default FreelancerDetails;
