import React, { useState, useEffect } from "react";
import Slider from "./Slider";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Modal,
  Image,
} from "react-native";
import ImageWithFallback from "./ImageWithFallback";
import { HighlightImage } from "../types";

interface SliderDestaqueProps {
  startConversation: () => void;
  highlight: HighlightImage;
  isPickerVisible: boolean;
  setPickerVisible: (visible: boolean) => void;
  index: number;
}

const SliderDestaque: React.FC<SliderDestaqueProps> = ({
  startConversation,
  highlight,
  isPickerVisible,
  setPickerVisible,
  index,
}) => {
  return (
    <>
      <View style={styles.avatarContainer}>
        <TouchableOpacity onPress={() => setPickerVisible(true)}>
          <View style={styles.avatarContainer}>
            <ImageWithFallback
              style={styles.borderAvatar}
              imageUrl={highlight.images[0]}
            />
          </View>
          <Text style={styles.txtDestak}>Meus Serviços</Text>
        </TouchableOpacity>
      </View>

      {isPickerVisible && (
        <Modal
          transparent={true}
          style={styles.modalContainer}
          animationType="slide"
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Slider imageUrls={highlight.images} />

              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  onPress={() => setPickerVisible(false)}
                  style={styles.modalButton}
                >
                  <Text style={styles.buttonText}>Fechar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    setPickerVisible(false);
                    startConversation();
                  }}
                  style={styles.modalButtonChat}
                >
                  <Text style={styles.buttonText}>Chat</Text>
                </TouchableOpacity>
              </View>
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
    margin: 20,
  },
  modalContainer: {
    flex: 1,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 221, 31, 0.5)",
  },
  modalContent: {
    height: "100%",
    width: "100%",
    backgroundColor: "transparent",
    borderRadius: 10,
    alignItems: "center",
  },

  buttonContainer: {
    padding: 10,
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  modalButton: {
    backgroundColor: "#2d47f0",
    padding: 18,
    borderRadius: 5,
    alignItems: "center",
    flex: 1,
    marginHorizontal: 5,
    borderWidth: 2,
    borderColor: "#f27e26",
  },
  modalButtonChat: {
    backgroundColor: "#2d47f0",
    padding: 18,
    borderRadius: 5,
    alignItems: "center",
    flex: 1,
    marginHorizontal: 5,
    borderWidth: 2,
    borderColor: "#f27e26",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  borderAvatar: {
    borderWidth: 2,
    padding: 5,
    width: 80,
    height: 80,
    borderColor: "#f27e26",
    alignItems: "center",
    borderRadius: 50,
  },
  txtDestak: {
    position: "absolute",
    color: "#fff",
    bottom: -10,
    right: 10,
    textAlign: "center",
  },
});

export default SliderDestaque;
