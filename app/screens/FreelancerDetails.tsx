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

  const numberOfHighlights = 3; //NUMERO DE DESTAQUE
  const [currentHighlightIndex, setCurrentHighlightIndex] = useState(0);
  const [isPickerVisible, setPickerVisible] = useState<boolean>(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHighlightIndex((prevIndex) => (prevIndex + 1) % numberOfHighlights); // Use a variável aqui
      setPickerVisible(true);
    }, 10000000000); 

    return () => clearInterval(interval);
  }, []);

  const handleLastItemVisible = () => {
    setTimeout(() => {
      setPickerVisible(false);
      setCurrentHighlightIndex((prevIndex) => (prevIndex + 1) % numberOfHighlights); // Use a variável aqui
      setPickerVisible(true); 
    }, 4000); 
  };

  return (
    <>
      <Layout>
        <PersonalCard freelancer={freelancer} />
        <View style={styles.container}>
          {Array.from({ length: numberOfHighlights }, (_, index) => (
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
