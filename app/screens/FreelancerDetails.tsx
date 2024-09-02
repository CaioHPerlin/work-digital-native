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

  const [currentHighlightIndex, setCurrentHighlightIndex] = useState(0);
  const [isPickerVisible, setPickerVisible] = useState<boolean>(false);
  return (
    <>
      <PersonalCard freelancer={freelancer} />
      <View style={styles.container}>
        {[0, 1].map((index) => (
          <SliderDestaque
            key={index}
            isPickerVisible={currentHighlightIndex === index && isPickerVisible}
            setPickerVisible={setPickerVisible}
            index={index}
            //onLastItemVisible={handleLastItemVisible}
          />
        ))}
      </View>
      <Description freelancer={freelancer} />
      <BtnPersonal freelancer={freelancer} />
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
