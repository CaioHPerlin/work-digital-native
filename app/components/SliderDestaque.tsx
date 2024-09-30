import React, { useState, useEffect } from "react";
import Slider from "./Slider";
import Icon from "react-native-vector-icons/FontAwesome";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Modal,
  TextInput,
} from "react-native";
import { HighlightImage } from "../types";
import ImageWithFallback from "./ImageWithFallback";
import { optimizeImageLowQ } from "../../utils/imageOptimizer";

interface SliderDestaqueProps {
  setInitialMessage: (str: string) => void;
  startConversation: () => void;
  highlight: HighlightImage;
  isPickerVisible: boolean;
  setPickerVisible: (visible: boolean) => void;
  index: number;
}

const SliderDestaque: React.FC<SliderDestaqueProps> = ({
  setInitialMessage,
  startConversation,
  highlight,
  isPickerVisible,
  setPickerVisible,
  index,
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [sliderPaused, setSliderPaused] = useState(false);
  return (
    <>
      <View style={styles.avatarContainer}>
        <TouchableOpacity
          disabled={!imageLoaded}
          onPress={() => setPickerVisible(true)}
        >
          <View style={styles.avatarContainer}>
            <ImageWithFallback
              style={styles.borderAvatar}
              imageUrl={optimizeImageLowQ(highlight.images[0])}
              cache={"memory-disk"}
              onLoad={() => setImageLoaded(true)}
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
              <Slider imageUrls={highlight.images} paused={sliderPaused} />
              <Icon
                name="close"
                size={30}
                color="#f27e26"
                style={styles.iconClose}
                onPress={() => setPickerVisible(false)}
              />

              <View style={styles.buttonContainer}>
                {/* input type instagram */}

                <TextInput
                  style={styles.inputMensage}
                  placeholder="Enviar Mensagem"
                  onChangeText={(v: string) => setInitialMessage(v)}
                  placeholderTextColor="#f27e26"
                  onFocus={() => setSliderPaused(true)} // Pause slider when input is focused
                  onBlur={() => setSliderPaused(false)} // Resume slider when input loses focus
                />

                <TouchableOpacity
                  onPress={() => {
                    setPickerVisible(false);
                    startConversation();
                  }}
                >
                  <Icon
                    name="send"
                    size={30}
                    color="#f27e26"
                    style={styles.iconSend}
                  />
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
    backgroundColor: "#fff",
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

  inputMensage: {
    width: "85%",
    height: 50,
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: "#f27e26",
    borderRadius: 50,
    color: "#f27e26",
    paddingLeft: 20,
  },
  iconSend: {
    marginTop: 10,
  },
  iconClose: {
    position: "absolute",
    top: 10,
    left: 10,
  },
});

export default SliderDestaque;
