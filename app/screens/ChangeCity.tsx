import * as React from "react";
import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";
import Layout from "@/app/components/Layout";

type ChangeCityProps = {
  navigation: any;
};

type Estado = {
  id: number;
  sigla: string;
  nome: string;
};

type Cidade = {
  id: number;
  nome: string;
};

export default function ChangeCity({ navigation }: ChangeCityProps) {
  const [estado, setEstado] = useState<string>("");
  const [cidade, setCidade] = useState<string>("");
  const [loadingEstados, setLoadingEstados] = useState<boolean>(true);
  const [loadingCidades, setLoadingCidades] = useState<boolean>(false);
  const [estados, setEstados] = useState<Estado[]>([]);
  const [cidades, setCidades] = useState<Cidade[]>([]);

  useEffect(() => {
    const fetchEstados = async () => {
      try {
        const response = await axios.get(
          "https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome"
        );
        const sortedStates = response.data.sort((a: Estado, b: Estado) =>
          a.nome.localeCompare(b.nome)
        );
        setEstados(sortedStates);
        setLoadingEstados(false);
      } catch (error) {
        console.error(error);
        setLoadingEstados(false);
      }
    };

    fetchEstados();
  }, []);

  useEffect(() => {
    if (estado) {
      setLoadingCidades(true);
      const fetchCidades = async () => {
        try {
          const response = await axios.get(
            `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${estado}/municipios`
          );
          const sortedCities = response.data.sort((a: Cidade, b: Cidade) =>
            a.nome.localeCompare(b.nome)
          );
          setCidades(sortedCities);
          setLoadingCidades(false);
        } catch (error) {
          console.error(error);
          setLoadingCidades(false);
        }
      };

      fetchCidades();
    }
  }, [estado]);

  const handleCancel = () => {
    navigation.goBack();
  };

  const handleChangeCity = () => {
    // Lógica para alterar a cidade
    alert("Cidade alterada com sucesso");
  };

  return (
    <>
      <View style={styles.container}>
        <ScrollView>
          <Text style={styles.title}>Alterar Cidade</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Estado</Text>
            {loadingEstados ? (
              <ActivityIndicator size="large" color="#FFC88d" />
            ) : (
              <Picker
                selectedValue={estado}
                onValueChange={(itemValue) => {
                  setEstado(itemValue);
                  setCidade("");
                }}
                style={styles.picker}
              >
                <Picker.Item label="Selecione um estado" value="" />
                {estados.map((estado) => (
                  <Picker.Item
                    key={estado.id}
                    label={estado.nome}
                    value={estado.sigla}
                  />
                ))}
              </Picker>
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Cidade</Text>
            {loadingCidades ? (
              <ActivityIndicator size="large" color="#FFC88d" />
            ) : (
              <Picker
                selectedValue={cidade}
                onValueChange={(itemValue) => setCidade(itemValue)}
                style={styles.picker}
                enabled={estado !== ""}
              >
                <Picker.Item label="Selecione uma cidade" value="" />
                {cidades.map((cidade) => (
                  <Picker.Item
                    key={cidade.id}
                    label={cidade.nome}
                    value={cidade.nome}
                  />
                ))}
              </Picker>
            )}
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={handleCancel}>
              <Text style={styles.buttonText}>Voltar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleChangeCity}>
              <Text style={styles.buttonText}>Alterar Cidade</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop:"50%",
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",

  },
  title: {
    color: "#2d47f0",
    fontSize: 28,
    marginBottom: 20,
    textAlign: "center",
    fontFamily: "TitanOne-Regular",
    margin: 2,
  },
  inputGroup: {
    marginBottom: 10,
    width: "100%",
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight:"bold"
  },
  picker: {
    backgroundColor: "#fffefd",
    borderColor: "#FFC88d",
    borderWidth: 1,
    marginBottom: 10,
    height: 50,
    width: "100%",
    justifyContent: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    width: "100%",
  },
  button: {
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
});
