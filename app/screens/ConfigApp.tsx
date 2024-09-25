import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Button } from "react-native";
import ToastManager, { Toast } from "toastify-react-native";

type ConfigAppProps = {
  navigation: any;
};

const Teste = () => {
  Toast.success("funciona");
};

const ConfigApp = ({ navigation }: ConfigAppProps) => {
  return (
    <>
      <View style={styles.container}>
        <ToastManager></ToastManager>

        <Text style={styles.title}>Configurações do Aplicativo</Text>
        <TouchableOpacity
          style={styles.button}
          ////disabled={true}
          onPress={() => navigation.navigate("DadosPessoais")}
        >
          <Text style={styles.buttonText}>Dados Pessoais</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("BecomeAutonomo")}
        >
          <Text style={styles.buttonText}>Tornar-se Autônomo</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          //disabled={true}
          onPress={() => navigation.navigate("ChangeCity")}
        >
          <Text style={styles.buttonText}>Alterar Cidade</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          //disabled={true}
          onPress={() => navigation.navigate("ChangePassword")}
        >
          <Text style={styles.buttonText}>Alterar Senha</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={Teste}>
          <Text style={styles.buttonText}>Teste</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("HomeScreen")}
        >
          <Text style={styles.buttonText}>Voltar</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontFamily: "TitanOne-Regular",
    color: "#f27e26",
  },
  button: {
    backgroundColor: "#2d47f0",
    borderColor: "#f27e26",
    borderWidth: 2,
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 10,
    width: "80%",
  },
  buttonDisabled: {
    backgroundColor: "#dbcebf",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 10,
    width: "80%",
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "bold",
  },
});

export default ConfigApp;
