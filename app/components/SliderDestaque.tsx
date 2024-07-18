import React, { useState } from "react";
import Slider from "./Slider";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
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
            size={60}
            source={require("../../assets/images/favicon.png")}
          />
          <Text>Destaque</Text>
        </TouchableOpacity>
      </View>

      {isPickerVisible && (
        
        <Modal
         transparent={true}
         style= {styles.modalContainer}
         animationType="slide"
         >
            <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
          <Slider />
          <TouchableOpacity  onPress={() => setPickerVisible(false)} style={styles.modalButton}>
            <Text>Fechar</Text>
            </TouchableOpacity>
            </View>
            </View>
            </Modal>
        
      )}
    </>
  );
};

const styles = StyleSheet.create({
  avatarContainer: {
    alignItems: "center",
    marginVertical: 20,
    margin:20,
  },
  modalContainer: {
    flex: 1,
    height:'100%',
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    height:600,
    width: "100%",
    backgroundColor: "white",
    borderRadius: 10,
   
    alignItems: "center",
  },

    modalButton: {
        padding: 15,
        backgroundColor: "#FFC88d"
    },
});

export default SliderDestaque;
