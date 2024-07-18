import React, { useState } from "react";
import Slider from "./Slider";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Button,
} from "react-native";
import { Avatar } from "react-native-paper";

const SliderDestaque: React.FC = () => {
  const [isPickerVisible, setPickerVisible] = useState<boolean>(false);

  return (
    <>
      <View style={styles.avatarContainer}>
        <TouchableOpacity onPress={() => setPickerVisible(true)}>
          <Avatar.Image
            size={80}
            source={require("../../assets/images/favicon.png")}
          />
        </TouchableOpacity>
      </View>

      {isPickerVisible && (
        <>
          <Slider />
          <Button title="Minimizar" onPress={() => setPickerVisible(false)} />
        </>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  avatarContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
});

export default SliderDestaque;
