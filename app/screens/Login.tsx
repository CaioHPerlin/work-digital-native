import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TextInput } from "react-native-paper";
import Layout from "../components/Layout";
import axios from "axios";
import * as Animatable from "react-native-animatable";

interface Props {
  navigation: any;
}

const Login: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState<string>("");
  const [senha, setSenha] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        "https://app-api-pied.vercel.app/users/auth",
        {
          email: email,
          password: senha,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data.token) {
        await AsyncStorage.setItem("cpf", response.data.user.cpf);
        navigation.navigate("Sidebar");
      }
    } catch (error) {
      alert("Verifique suas informações de login.");
      console.error("Error logging in:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Layout>
      <View style={styles.container}>
        <Animatable.Text
          animation="bounce"
          iterationCount="infinite"
          style={styles.loadingText}
        >
          12pulo
        </Animatable.Text>
      </View>
      </Layout>
    );
  }

  return (
    <Layout>
      <View style={styles.container}>
        <Text style={styles.title}>Login</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            label="Email"
            value={email}
            onChangeText={(text) => setEmail(text)}
            keyboardType="email-address"
            style={styles.input}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Senha</Text>
          <TextInput
            label="Senha"
            value={senha}
            onChangeText={(text) => setSenha(text)}
            secureTextEntry
            style={styles.input}
          />
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.esqueciSenha}>Esqueci a Senha</Text>
      </View>
    </Layout>
  );
};

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
  input: {
    backgroundColor: "#fef5eb",
    marginBottom: 10,
    color: "#000000",
    borderRadius: 5,
    borderBottomWidth: 0,
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
  esqueciSenha: {
    color: "#FFC88d",
    fontSize: 16,
    textAlign: "center",
    marginTop: 10,
    textTransform: "capitalize",
    textDecorationLine: "underline",
  },
  loadingText: {
    fontSize: 34,
    color: "#feb96f",
  },
});

export default Login;
