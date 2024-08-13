import * as React from "react";
import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { TextInput } from "react-native-paper";
//import Layout from "../components/Layout";

type DadosPessoaisProps = {
  navigation: any;
};

export default function DadosPessoais({ navigation }: DadosPessoaisProps) {
  const [nome, setNome] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [estado, setEstado] = useState<string>("");
  const [cidade, setCidade] = useState<string>("");
  const [endereco, setEndereco] = useState<string>("");
  const [numero, setNumero] = useState<string>("");
  const [bairro, setBairro] = useState<string>("");
  const [telefone, setTelefone] = useState<string>("");

  const handleCancel = () => {
    // Implementar lógica de cancelamento
  };

  const handleRegister = () => {
    // Implementar lógica de registro
  };

  return (
    <>
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
            <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
              <Text style={styles.buttonText}>Voltar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => alert('alterado com sucesso')}>
              <Text style={styles.buttonText}>Alterar</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop:25,
    padding: 20,
    justifyContent: "center",
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
