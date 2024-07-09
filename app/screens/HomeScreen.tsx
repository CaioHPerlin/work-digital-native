import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { Picker } from "@react-native-picker/picker";

import ListFreelancer from "../components/ListFreelancer";
import Layout from "../components/Layout";
import axios from "axios";

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

export default function HomeScreen() {
  const [selectedValue, setSelectedValue] = useState<string>("A");
  const [isPickerVisible, setPickerVisible] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>("");

  const [serviceTypes, setServiceTypes] = useState<string[]>([]);
  const [freelancers, setFreelancers] = useState<Freelancer[]>([]);

  useEffect(() => {
    const fetchServiceTypes = async () => {
      try {
        const response = await axios.get(
          "https://work-digital-api.up.railway.app/roles"
        );
        setServiceTypes(response.data);
      } catch (error) {
        console.error("Erro ao buscar cargos:", error);
      }
    };

    fetchServiceTypes();
  }, []);

  useEffect(() => {
    const fetchFreelancers = async () => {
      try {
        const response = await axios.get(
          `https://work-digital-api.up.railway.app/freelancers?role=${selectedValue}`
        );
        setFreelancers(response.data);
      } catch (error) {
        console.error("Erro ao buscar freelancers:", error);
      }
    };

    if (selectedValue) {
      fetchFreelancers();
    }
  }, [selectedValue]);

  const sortedServiceTypes = serviceTypes.sort();

  const filteredServiceTypes = sortedServiceTypes.filter((service) =>
    service.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <Layout>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.nomeMarca}>12pulo</Text>
        </View>

        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setPickerVisible(!isPickerVisible)}
        >
          <Text style={styles.filterButtonText}>Filtrar</Text>
        </TouchableOpacity>

        {isPickerVisible && (
          <View style={styles.pickerContainer}>
            <Text>TIPOS DE SERVIÇO</Text>
            <TextInput
              style={styles.searchBar}
              placeholder="Pesquisar..."
              value={searchText}
              onChangeText={setSearchText}
            />
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={selectedValue}
                style={styles.picker}
                onValueChange={(itemValue) => setSelectedValue(itemValue)}
              >
                {filteredServiceTypes.map((service, index) => (
                  <Picker.Item key={index} label={service} value={service} />
                ))}
              </Picker>
            </View>
            <View>
              <ListFreelancer data={freelancers} />
            </View>
          </View>
        )}
      </View>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    //backgroundColor: '#FFF',
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  nomeMarca: {
    fontSize: 25,
    textTransform: "uppercase",
    fontWeight: "bold",
    letterSpacing: 4,
  },
  filterButton: {
    backgroundColor: "#FFC88d",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  filterButtonText: {
    color: "#000",
    fontWeight: "bold",
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
});
