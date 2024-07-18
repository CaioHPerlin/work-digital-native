import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

type ConfigAppProps = {
  navigation: any;
};

const ConfigApp = ({ navigation }: ConfigAppProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Configurações do Aplicativo</Text>
      <TouchableOpacity
        style={styles.buttonDisabled}
        disabled={true}
        onPress={() => navigation.navigate("DadosPessoais")}
      >
      <Text style={styles.buttonText}>Dados Pessoais</Text>
      </TouchableOpacity>
       <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("SliderDestaque")}
      >
        <Text style={styles.buttonText}>Teste</Text>
      </TouchableOpacity> 
      <TouchableOpacity
        style={styles.buttonDisabled}
        disabled={true}
        onPress={() => navigation.navigate("BecomeAutonomo")}
      >
        <Text style={styles.buttonText}>Tornar-se Autônomo</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.buttonDisabled}
        disabled={true}
        onPress={() => navigation.navigate("ChangeCity")}
      >
        <Text style={styles.buttonText}>Alterar Cidade</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.buttonDisabled}
        disabled={true}
        onPress={() => navigation.navigate("ChangePassword")}
      >
        <Text style={styles.buttonText}>Alterar Senha</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.buttonDisabled}
        
        onPress={() => navigation.navigate("ManageDestak")}
      >
        <Text style={styles.buttonText}>Gerenciar Destaque</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Home")}
      >
        <Text style={styles.buttonText}>Voltar</Text>
      </TouchableOpacity>
    </View>
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
  },
  button: {
    backgroundColor: "#FFC88d",
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
    color: "#000",
    fontWeight: "bold",
  },
});

export default ConfigApp;
