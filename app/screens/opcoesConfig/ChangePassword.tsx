import * as React from "react";
import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { TextInput } from "react-native-paper";
import Icon from "react-native-vector-icons/FontAwesome";
import { supabase } from "../../../lib/supabase";

type ChangePasswordProps = {
  navigation: any;
};

export default function ChangePassword({ navigation }: ChangePasswordProps) {
  const [oldPassword, setOldPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [oldPasswordVisible, setOldPasswordVisible] = useState<boolean>(false);
  const [newPasswordVisible, setNewPasswordVisible] = useState<boolean>(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] =
    useState<boolean>(false);

  const handleCancel = () => {
    navigation.goBack();
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      Alert.alert("Erro", "As senhas não coincidem.");
      return;
    }

    try {
      // Update the user's password
      const { user, error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        throw new Error(error.message);
      }

      Alert.alert("Sucesso", "Atualização de senha bem-sucedida.");
      navigation.goBack();
    } catch (error) {
      if (newPassword == oldPassword) {
        return Alert.alert("Erro", "Estas são a mesma senha.");
      }
      Alert.alert("Erro", "Verifique as credenciais digitadas.");
    }
  };

  return (
    <>
      <View style={styles.container}>
        <ScrollView>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Senha Atual</Text>
            <View style={styles.inputContainer}>
              <TextInput
                label="Senha Atual"
                value={oldPassword}
                onChangeText={(text) => setOldPassword(text)}
                secureTextEntry={!oldPasswordVisible}
                style={styles.input}
                underlineColor="transparent"
                activeUnderlineColor="black"
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setOldPasswordVisible(!oldPasswordVisible)}
              >
                <Icon
                  name={oldPasswordVisible ? "eye" : "eye-slash"}
                  size={30}
                  color="#000"
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Senha Nova</Text>
            <View style={styles.inputContainer}>
              <TextInput
                label="Senha Nova"
                value={newPassword}
                onChangeText={(text) => setNewPassword(text)}
                secureTextEntry={!newPasswordVisible}
                style={styles.input}
                underlineColor="transparent"
                activeUnderlineColor="black"
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setNewPasswordVisible(!newPasswordVisible)}
              >
                <Icon
                  name={newPasswordVisible ? "eye" : "eye-slash"}
                  size={30}
                  color="#000"
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Confirme a Senha Nova</Text>
            <View style={styles.inputContainer}>
              <TextInput
                label="Confirme a Senha Nova"
                value={confirmPassword}
                onChangeText={(text) => setConfirmPassword(text)}
                secureTextEntry={!confirmPasswordVisible}
                style={styles.input}
                underlineColor="transparent"
                activeUnderlineColor="black"
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() =>
                  setConfirmPasswordVisible(!confirmPasswordVisible)
                }
              >
                <Icon
                  name={confirmPasswordVisible ? "eye" : "eye-slash"}
                  size={30}
                  color="#000"
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={handleCancel}>
              <Text style={styles.buttonText}>Voltar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={handleChangePassword}
            >
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
    marginTop: 40,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
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
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
    borderColor: "black",
    borderWidth: 1,
    marginBottom: 10,
    color: "#000000",
    borderRadius: 5,
  },
  eyeIcon: {
    position: "absolute",
    right: 10,
    top: 10,
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
