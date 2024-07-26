import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import Layout from "../components/Layout";
import PersonalCard from "../components/PersonalCard";
import Description from "../components/Description";
import BtnPersonal from "../components/BtnPersonal";
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

  const [currentHighlightIndex, setCurrentHighlightIndex] = useState(0);
  const [isPickerVisible, setPickerVisible] = useState<boolean>(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHighlightIndex((prevIndex) => (prevIndex + 1) % 2); // nesse momento está assumindo que há 2 destaques LEMBRAR DE MUDAR ESSA VARIAVEL
      setPickerVisible(true);
    }, 10000000000000000000); // Altere o destaque a cada x segundos (GAMBIARRA)

    return () => clearInterval(interval);
  }, []);

  const handleLastItemVisible = () => {
    setTimeout(() => {
      setPickerVisible(false);
      setCurrentHighlightIndex((prevIndex) => (prevIndex + 1) % 2); // nesse momento está assumindo que há 2 destaques LEMBRAR DE MUDAR ESSA VARIAVEL
      setPickerVisible(true);
    }, 4000); //Altere o destaque a cada x segundos (GAMBIARRA)
  };
  return (
    <>
      <Layout>
        <PersonalCard freelancer={freelancer} />
        <View style={styles.container}>
          {freelancer.highlights.map((highlight, index) => (
            <SliderDestaque
              list={freelancer.highlights}
              name={highlight.roleName}
              key={index}
              isPickerVisible={
                currentHighlightIndex === index && isPickerVisible
              }
              setPickerVisible={setPickerVisible}
              index={index}
              onLastItemVisible={handleLastItemVisible}
            />
          ))}
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
    flexWrap: "wrap",
    flexDirection: "row",
  },
  containerIteins: {
    marginRight: 50,
  },
});

export default FreelancerDetails;
