import * as React from "react";
import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  TextInput,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";
import { supabase } from "../../lib/supabase";
import InputField from "../components/InputField";

type DadosPessoaisProps = {
  navigation: any;
  userId: string;
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

export default function DadosPessoais({
  navigation,
  userId,
}: DadosPessoaisProps) {
  const [name, setName] = useState<string>("");
  const [estado, setEstado] = useState<string>("");
  const [cidade, setCidade] = useState<string>("");
  const [userProfile, setUserProfile] = useState<any>(null);
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

  useEffect(() => {
    // Fetch user profile on component mount
    const fetchUserProfile = async () => {
      try {
        const { data, error } = await supabase
          .from("profiles") // Adjust table name if needed
          .select("*")
          .eq("id", userId) // Replace with actual user ID
          .single();

        if (error) {
          console.error("Error fetching user profile:", error);
          return;
        }

        setUserProfile(data);
        setName(data.name);
        setEstado(data.state);
        setCidade(data.city);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
  }, []);

  const updateUserProfile = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles") // Adjust table name if needed
        .update({
          name: name,
          state: estado,
          city: cidade,
        })
        .eq("id", userId); // Replace with actual user ID

      if (error) {
        console.error("Error updating user profile:", error);
        Alert.alert(
          "Erro",
          "Ocorreu um erro ao tentar atualizar o perfil do usuário."
        );
        return;
      }

      Alert.alert("Sucesso", "Dados pessoais atualizados com sucesso.");
      setUserProfile((prev: any) => ({
        ...prev,
        state: estado,
        city: cidade,
      }));
      navigation.goBack();
    } catch (error) {
      console.error("Error updating user profile:", error);
      Alert.alert(
        "Erro",
        "Ocorreu um erro ao tentar atualizar o perfil do usuário."
      );
    }
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  const handleDadosPessoais = () => {
    if (estado && cidade) {
      updateUserProfile();
    } else {
      Alert.alert("Error", "Please select both state and city.");
    }
  };
  return (
    <>
      <View style={styles.container}>
        <ScrollView>
          <View style={styles.inputGroup}>
            {/* Full Name Input */}
            <InputField
              label="Nome Completo"
              value={name}
              onChangeText={(v) => setName(v)}
              autoCapitalize="words"
              keyboardType="default"
            />
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
            <TouchableOpacity
              style={styles.button}
              onPress={handleDadosPessoais}
            >
              <Text style={styles.buttonText}>Atualizar Dados</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
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
    fontWeight: "bold",
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
