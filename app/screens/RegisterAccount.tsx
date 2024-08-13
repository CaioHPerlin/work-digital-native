import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  Alert,
  ActivityIndicator,
  KeyboardTypeOptions,
} from "react-native";
import { TextInput } from "react-native-paper";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import Layout from "../components/Layout";

interface Props {
  navigation: any;
}

const RegisterAccount: React.FC<Props> = ({ navigation }) => {
  const [nome, setNome] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [cpf, setCpf] = useState<string>("");
  const [birthdate, setBirthdate] = useState<string>("");
  const [estado, setEstado] = useState<string>("");
  const [cidade, setCidade] = useState<string>("");
  const [endereco, setEndereco] = useState<string>("");
  const [numero, setNumero] = useState<string>("");
  const [bairro, setBairro] = useState<string>("");
  const [telefone, setTelefone] = useState<string>("");
  const [senha, setSenha] = useState<string>("");
  const [estados, setEstados] = useState<[]>([]);
  const [cidades, setCidades] = useState<[]>([]);
  const [loadingEstados, setLoadingEstados] = useState<boolean>(true);
  const [loadingCidades, setLoadingCidades] = useState<boolean>(false);

  const handleRegister = async () => {
    if (
      !nome ||
      !email ||
      !cpf ||
      !estado ||
      !cidade ||
      !endereco ||
      !numero ||
      !bairro ||
      !telefone ||
      !senha ||
      !birthdate
    ) {
      Alert.alert("Erro", "Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    const userData = {
      name: nome,
      email: email,
      password: senha,
      cpf: cpf,
      state: estado,
      city: cidade,
      neighborhood: bairro,
      street: endereco,
      number: numero,
      phone: telefone,
      birthdate: birthdate,
    };

    try {
      const userRes = await axios.post(
        "https://app-api-pied.vercel.app/users",
        userData
      );

      if (userRes.status === 201) {
        Alert.alert("Sucesso", "Registro realizado com sucesso!");
        navigation.navigate("Sidebar");
      } else {
        throw new Error(userRes.data.message);
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Falha ao registrar. Tente novamente.");
    }
  };

  const handleCancel = () => {
    navigation.navigate("PageInicial");
  };

  useEffect(() => {
    const fetchEstados = async () => {
      try {
        const response = await axios.get(
          "https://servicodados.ibge.gov.br/api/v1/localidades/estados"
        );
        setEstados(response.data.sort((a, b) => a.nome.localeCompare(b.nome)));
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
          setCidades(
            response.data.sort((a, b) => a.nome.localeCompare(b.nome))
          );
          setLoadingCidades(false);
        } catch (error) {
          console.error(error);
          setLoadingCidades(false);
        }
      };
      fetchCidades();
    }
  }, [estado]);

  return (
    <View style={styles.container}>
      <ScrollView>
        <Text style={styles.title}>Cadastro</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nome</Text>
          <TextInput
            label="Nome"
            value={nome}
            onChangeText={setNome}
            style={styles.input}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            style={styles.input}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>CPF</Text>

          <TextInput
            label="CPF"
            value={cpf}
            onChangeText={setCpf}
            style={styles.input}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Data de Nascimento</Text>
          <TextInput
            label="Data de Nascimento"
            value={birthdate}
            onChangeText={setBirthdate}
            style={styles.input}
          />
        </View>

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
              onValueChange={setCidade}
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
            label= "Endereço"
            value={endereco}
            onChangeText={setEndereco}
            style={styles.input}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Número</Text>
          <TextInput
          label= "Número"
            value={numero}
            onChangeText={setNumero}
            keyboardType="numeric"
            style={styles.input}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Bairro</Text>
          <TextInput
            label= "Bairro"
            value={bairro}
            onChangeText={setBairro}
            style={styles.input}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Telefone</Text>
          <TextInput
            label= "Telefone"
            value={telefone}
            onChangeText={setTelefone}
            keyboardType="phone-pad"
            style={styles.input}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Senha</Text>
          <TextInput
            label= "Senha"
            value={senha}
            onChangeText={setSenha}
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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  ScrollView: {
    padding: 20,
    justifyContent: "center",
    width: "100%",

    alignItems: "center",
  },
  title: {
    color: "#2d47f0",
    fontSize: 30,
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

  input: {
    borderColor: "black",
    borderWidth: 1,
    marginBottom: 10,
    color: "#000000",
    borderRadius: 5,
  },

  picker: {
    borderColor: "black",
    borderWidth: 1,
    marginBottom: 10,
    color: "#000000",
    borderRadius: 5,
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

export default RegisterAccount;
