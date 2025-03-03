import React, { useState, useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  FlatList,
  TextInput,
} from "react-native";
import * as Animatable from "react-native-animatable";
import Icon from "react-native-vector-icons/FontAwesome";
import axios from "axios";
import { ActivityIndicator } from "react-native-paper";
import FixedText from "./FixedText";

type Cidade = {
  id: number;
  nome: string;
};

const LinkedCity: React.FC<{
  state: string;
  city: string;
  setCity: any;
  fetchingStates?: boolean;
}> = ({ state, city, setCity, fetchingStates }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchText, setSearchText] = useState<string>("");
  const [cities, setCities] = useState<Cidade[]>([]);
  const [loading, setLoading] = useState(false);

  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (state) {
      setLoading(true);
      const fetchCidades = async () => {
        try {
          const response = await axios.get(
            `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${state}/municipios`
          );
          const sortedCities = response.data.sort((a: Cidade, b: Cidade) =>
            a.nome.localeCompare(b.nome)
          );
          setCities(sortedCities);

          if (city) {
            const cityExists = sortedCities.some(
              (cidade: Cidade) => cidade.nome === city
            );

            if (!cityExists) {
              setCity(null); // Set city to null if it doesn't exist in the fetched cities
            }
          }

          setLoading(false);
        } catch (error) {
          console.error(error);
          setLoading(false);
        }
      };

      fetchCidades();
    }
  }, [state]);

  const handleSearch = (text: string) => {
    setSearchText(text);
  };

  const filteredCities = cities
    .sort()
    .filter((city) =>
      city.nome.toLowerCase().startsWith(searchText.toLowerCase())
    );

  const modal = (
    <Modal
      visible={isOpen}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setIsOpen(false)}
    >
      <TouchableWithoutFeedback onPress={() => setIsOpen(false)}>
        <View style={styles.modalBackground}>
          {/* Inner TouchableWithoutFeedback prevents the modal from closing when interacting  */}
          <TouchableWithoutFeedback>
            <Animatable.View
              animation="slideInUp"
              duration={400}
              style={styles.modalContainer}
            >
              <View style={styles.searchInputContainer}>
                <TextInput
                  ref={inputRef}
                  style={styles.modalSearchBar}
                  placeholder="Buscar Cidade"
                  placeholderTextColor="#FFF"
                  value={searchText}
                  onChangeText={handleSearch}
                />
                <TouchableOpacity
                  onPress={() => {
                    if (inputRef.current) {
                      inputRef.current.focus();
                    }
                  }}
                >
                  <Icon
                    name="search"
                    size={20}
                    color="#FFF"
                    style={styles.searchIcon}
                  />
                </TouchableOpacity>
              </View>
              <FlatList
                style={{ width: "100%" }}
                data={filteredCities}
                keyExtractor={(item) => item.nome}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[
                      styles.modalItem,
                      city == item.nome && {
                        backgroundColor: "#2d47f0",
                      },
                    ]}
                    onPress={() => {
                      setCity(item.nome);
                      setIsOpen(false); // Close modal
                    }}
                  >
                    <Icon
                      name={city == item.nome ? "check-square-o" : "square-o"}
                      style={
                        city == item.nome
                          ? { ...styles.modalItemText, color: "#FFF" }
                          : { ...styles.modalItemText, color: "#000" }
                      }
                    />
                    <FixedText
                      style={
                        city == item.nome
                          ? { ...styles.modalItemText, color: "#FFF" }
                          : { ...styles.modalItemText, color: "#000" }
                      }
                    >
                      {item.nome}
                    </FixedText>
                  </TouchableOpacity>
                )}
              />
            </Animatable.View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );

  return (
    <>
      {loading || fetchingStates ? (
        <ActivityIndicator
          style={{ paddingVertical: 14 }}
          size="large"
          color="#FFC88d"
        />
      ) : (
        <TouchableOpacity
          disabled={!state}
          onPress={() => setIsOpen(true)}
          style={styles.submitButton}
        >
          <FixedText style={{ ...styles.uploadButtonText }}>
            {city ? city : "Selecione a Cidade"}
          </FixedText>
        </TouchableOpacity>
      )}
      {modal}
    </>
  );
};

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  profileImage: {
    margin: 10,
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: "center",
    marginBottom: 20,
  },
  uploadButton: {
    backgroundColor: "#2d47f0",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  uploadButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: "#2d47f0",
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 50,
    padding: 20,
    alignItems: "center",
    elevation: 20,
    height: "80%",
    borderColor: "#f27e26",
    borderWidth: 2,
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2d47f0",
    borderRadius: 25,
    paddingHorizontal: 10,
    height: 50,
    marginBottom: 10,
    width: "100%",
  },
  searchIcon: {
    marginRight: 10,
  },
  modalSearchBar: {
    flex: 1,
    color: "#FFF",
  },
  modalItem: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "nowrap",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 6,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    width: "100%",
  },
  modalItemText: {
    fontSize: 16,
    textAlign: "justify",
  },
  noSelectionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  roleContainer: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "nowrap",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    alignContent: "center",
    backgroundColor: "#fff",
    borderColor: "#2d47f0",
    borderWidth: 1,
    borderTopWidth: 0,
    paddingVertical: 8,
    borderRadius: 10,
    borderTopEndRadius: 0,
    borderTopStartRadius: 0,
    marginTop: 0,
    alignItems: "center",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginBottom: 10,
  },
  roleContainerX: {
    marginBottom: 20,
  },
  roleTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  imageScrollView: {
    flexDirection: "row",
    marginTop: 10,
  },
  image: {
    width: 100,
    height: 100,
    marginRight: 10,
  },
  loadingText: {
    fontSize: 34,
    color: "#feb96f",
  },
});

export default LinkedCity;
