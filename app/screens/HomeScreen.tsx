import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import * as Animatable from "react-native-animatable";

import ListFreelancer from "../components/ListFreelancer";
import Layout from "../components/Layout";
import axios from "axios";
import roles from "@/constants/roles";

interface Freelancer {
  id: number;
  role: string;
  name: string;
  phone: string;
  email: string;
  city: string;
  state: string;
  description: string;
  profile_picture: string;
  picture_folder: string;
}

interface Props {
  navigation: any;
}

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const [selectedValue, setSelectedValue] = useState<string>("");
  const [searchText, setSearchText] = useState<string>("");
  const [freelancers, setFreelancers] = useState<Freelancer[]>([]);
  const [showPickerMessage, setShowPickerMessage] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchFreelancers = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `https://app-api-pied.vercel.app/freelancers?role=${selectedValue}`
        );
        setFreelancers(response.data);
      } catch (error) {
        console.error("Erro ao buscar freelancers:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (selectedValue) {
      fetchFreelancers();
    }
  }, [selectedValue]);

  const sortedServiceTypes = roles.sort();

  const filteredServiceTypes = sortedServiceTypes.filter((service) =>
    service.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleSearch = (text: string) => {
    setSearchText(text);
    setShowPickerMessage(text === "");
  };

  return (
    <Layout>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <Animatable.Text
            animation="bounce"
            iterationCount="infinite"
            style={styles.loadingText}
          >
            12Pulo
          </Animatable.Text>
        </View>
      ) : (
        <View style={styles.container}>
          <View style={styles.headerContainer}>
            <Text style={styles.nomeMarca}>12Pulo</Text>
          </View>
          <View style={styles.pickerContainer}>
            <Text style={styles.label}>TIPOS DE SERVIÇO</Text>
            <TextInput
              style={styles.searchBar}
              placeholder="Pesquisar..."
              value={searchText}
              onChangeText={handleSearch}
            />
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={selectedValue}
                style={styles.picker}
                onValueChange={(itemValue) => setSelectedValue(itemValue)}
              >
                {showPickerMessage && (
                  <Picker.Item label="Selecione um serviço" value="" />
                )}
                {filteredServiceTypes.map((service, index) => (
                  <Picker.Item
                    key={index}
                    label={service}
                    value={service}
                    enabled={service.length > 1}
                    style={
                      service.length > 1
                        ? { color: "#000" }
                        : { color: "#aeaeae" }
                    }
                  />
                ))}
              </Picker>
            </View>
          </View>
          {selectedValue ? (
            <ListFreelancer data={freelancers} navigation={navigation} />
          ) : (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {showPickerMessage && (
                <Text style={{ textAlign: "center" }}>
                  Selecione um serviço acima para buscar por prestadores!
                </Text>
              )}
            </View>
          )}
        </View>
      )}
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  nomeMarca: {
    fontSize: 25,
    fontWeight: "bold",
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: "#000000",
  },
  pickerContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  searchBar: {
    height: 40,
    borderColor: "#CCC",
    borderWidth: 1,
    paddingHorizontal: 8,
    marginBottom: 10,
    width: "100%",
  },
  pickerWrapper: {
    height: 50,
    width: "100%",
  },
  picker: {
    height: 50,
    width: "100%",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 34,
    color: "#feb96f",
  },
});

export default HomeScreen;
