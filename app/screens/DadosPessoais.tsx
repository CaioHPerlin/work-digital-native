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

export default function DadosPessoais({ navigation }) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [estado, setEstado] = useState("");
  const [cidade, setCidade] = useState("");
  const [endereco, setEndereco] = useState("");
  const [numero, setNumero] = useState("");
  const [bairro, setBairro] = useState("");
  const [telefone, setTelefone] = useState("");

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
          <Text style={styles.title}>Dados Pessoais</Text>

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

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('ConfigApp')}>
              <Text style={styles.buttonText}>Voltar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => alert('alterado com successo') }>
              <Text style={styles.buttonText}>Alterar</Text>
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
  radioGroup: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  input: {
    backgroundColor: "#fef5eb",
    marginBottom: 10,
    borderColor: "#FFC88d",
    borderWidth: 1,
    color: "#000000",
    borderRadius: 5,
  },
  picker: {
    borderColor: "#FFC88d",
    borderWidth: 1,
    backgroundColor: "#fef5eb",
    height: 50,
    width: "100%",
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
