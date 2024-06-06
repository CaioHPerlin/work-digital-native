import * as React from "react";
import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { TextInput, RadioButton } from "react-native-paper";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";
import Layout from "../components/Layout";
import { red } from "react-native-reanimated/lib/typescript/reanimated2/Colors";

export default function RegisterAccount() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [estado, setEstado] = useState("");
  const [cidade, setCidade] = useState("");
  const [endereco, setEndereco] = useState("");
  const [numero, setNumero] = useState("");
  const [bairro, setBairro] = useState("");
  const [telefone, setTelefone] = useState("");
  const [senha, setSenha] = useState("");
  const [checked, setChecked] = React.useState("yesYears");
  const [estados, setEstados] = useState([]);
  const [cidades, setCidades] = useState([]);
  const [loadingEstados, setLoadingEstados] = useState(true);
  const [loadingCidades, setLoadingCidades] = useState(false);

  useEffect(() => {
    // Fetch estados from IBGE API
    axios
      .get("https://servicodados.ibge.gov.br/api/v1/localidades/estados")
      .then((response) => {
        const sortedStates = response.data.sort((a, b) =>
          a.nome.localeCompare(b.nome)
        );
        setEstados(sortedStates);
        setLoadingEstados(false);
      })
      .catch((error) => {
        console.error(error);
        setLoadingEstados(false);
      });
  }, []);

  useEffect(() => {
    if (estado) {
      setLoadingCidades(true);
      // Fetch cidades from IBGE API based on selected estado
      axios
        .get(
          `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${estado}/municipios`
        )
        .then((response) => {
          const sortedCities = response.data.sort((a, b) =>
            a.nome.localeCompare(b.nome)
          );
          setCidades(sortedCities);
          setLoadingCidades(false);
        })
        .catch((error) => {
          console.error(error);
          setLoadingCidades(false);
        });
    }
  }, [estado]);

  const handleCancel = () => {
    // Implementar lógica de cancelamento
  };

  const handleRegister = () => {
    // Implementar lógica de registro
  };

  return (
    <Layout>
      <View style={styles.container}>
        <ScrollView>
          <Text style={styles.title}>Cadastro</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nome</Text>
            <TextInput
              label="Nome"
              value={nome}
              onChangeText={(text) => setNome(text)}
              style={styles.input}
              underlineColor="transparent"
              activeUnderlineColor="black"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              label="Email"
              value={email}
              onChangeText={(text) => setEmail(text)}
              keyboardType="email-address"
              style={styles.input}
              underlineColor="transparent"
              activeUnderlineColor="black"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Estado</Text>
            {loadingEstados ? (
              <ActivityIndicator size="large" color="#FFC88d" />
            ) : (
              <Picker
                selectedValue={estado}
                style={styles.select}
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

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Endereço</Text>
            <TextInput
              label="Endereço"
              value={endereco}
              onChangeText={(text) => setEndereco(text)}
              style={styles.input}
              underlineColor="transparent"
              activeUnderlineColor="black"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Número</Text>
            <TextInput
              label="Número"
              value={numero}
              onChangeText={(text) => setNumero(text)}
              keyboardType="numeric"
              style={styles.input}
              underlineColor="transparent"
              activeUnderlineColor="black"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Bairro</Text>
            <TextInput
              label="Bairro"
              value={bairro}
              onChangeText={(text) => setBairro(text)}
              style={styles.input}
              underlineColor="transparent"
              activeUnderlineColor="black"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Telefone</Text>
            <TextInput
              label="Telefone"
              value={telefone}
              onChangeText={(text) => setTelefone(text)}
              keyboardType="phone-pad"
              style={styles.input}
              underlineColor="transparent"
              activeUnderlineColor="black"
            />
          </View>
          <Text style={styles.label}>Tem +18 Anos </Text>
          <View style={styles.switch}>
            <View style={styles.radioGroup}>
              <Text>Sim</Text>
              <RadioButton
                value="yesYears"
                status={checked === "yesYears" ? "checked" : "unchecked"}
                onPress={() => setChecked("yesYears")}
                color="#FFC88d"
              />
              <Text>Não</Text>
              <RadioButton
                value="notYears"
                status={checked === "notYears" ? "checked" : "unchecked"}
                onPress={() => setChecked("notYears")}
                color="#FFC88d"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Senha</Text>
            <TextInput
              underlineColor="transparent"
              activeUnderlineColor="black"
              label="Senha"
              value={senha}
              onChangeText={(text) => setSenha(text)}
              secureTextEntry
              style={styles.input}
            />
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={handleCancel}>
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleRegister}>
              <Text style={styles.buttonText}>Cadastrar</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 34,
    marginBottom: 20,
    textAlign: "center",
  },
  inputGroup: {
    marginBottom: 10,
    width: "100%",
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  switch: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  radioGroup: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 10,
  },
  input: {
    backgroundColor: "#fef5eb",
    marginBottom: 10,

    color: "#000000",
    borderRadius: 5,
    borderBottomWidth: 0,
  },
  picker: {
    backgroundColor: "#fef5eb",
    height: 50,
    width: "100%",
  },
  select: {
    backgroundColor: "#FFC88d",
    marginBottom: 5,
    borderWidth: 2,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    width: "100%",
  },
  button: {
    backgroundColor: "#FFC88d",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    flex: 1,
    marginHorizontal: 5,
  },
  buttonText: {
    color: "#000",
    fontWeight: "bold",
  },
});
