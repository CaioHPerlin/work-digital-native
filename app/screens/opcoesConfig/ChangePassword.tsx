import * as React from "react";
import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { TextInput } from "react-native-paper";
import Layout from "@/app/components/Layout";

type ChangePasswordProps = {
  navigation: any;
};

export default function ChangePassword({ navigation }: ChangePasswordProps) {
  const [oldPassword, setOldPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const handleCancel = () => {
    navigation.goBack();
  };

  const handleChangePassword = () => {
    if (newPassword !== confirmPassword) {
      alert("As senhas não coincidem");
      return;
    }
    alert('Alterado com sucesso');
  };

  return (
    <>
      <View style={styles.container}>
        <ScrollView>
          <Text style={styles.title}>Alterar Senha</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Senha Atual</Text>
            <TextInput
              label="Senha Atual"
              value={oldPassword}
              onChangeText={(text) => setOldPassword(text)}
              secureTextEntry
              style={styles.input}
              underlineColor="transparent"
              activeUnderlineColor="black"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nova Senha</Text>
            <TextInput
              label="Nova Senha"
              value={newPassword}
              onChangeText={(text) => setNewPassword(text)}
              secureTextEntry
              style={styles.input}
              underlineColor="transparent"
              activeUnderlineColor="black"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Confirmar Nova Senha</Text>
            <TextInput
              label="Confirmar Nova Senha"
              value={confirmPassword}
              onChangeText={(text) => setConfirmPassword(text)}
              secureTextEntry
              style={styles.input}
              underlineColor="transparent"
              activeUnderlineColor="black"
            />
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={handleCancel}>
              <Text style={styles.buttonText}>Voltar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleChangePassword}>
              <Text style={styles.buttonText}>Alterar Senha</Text>
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
    marginTop:"40%",
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
    fontWeight:"bold"
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
