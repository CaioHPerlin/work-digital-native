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
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FunctionsHttpError } from "@supabase/supabase-js";

type ChangePasswordProps = {
  navigation: any;
  userId: string;
};

const passwordSchema = z
  .object({
    oldPassword: z.string().min(1, "A senha antiga é obrigatória"),
    newPassword: z
      .string()
      .min(6, "A nova senha deve ter pelo menos 6 caracteres"),
    confirmPassword: z
      .string()
      .min(6, "A senha deve ter pelo menos 6 caracteres"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "As senhas não coincidem.",
    path: ["confirmPassword"],
  });

export default function ChangePassword({
  navigation,
  userId,
}: ChangePasswordProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(passwordSchema),
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [oldPasswordVisible, setOldPasswordVisible] = useState<boolean>(false);
  const [newPasswordVisible, setNewPasswordVisible] = useState<boolean>(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] =
    useState<boolean>(false);

  const handleCancel = () => {
    navigation.goBack();
  };

  const handleChangePassword = async (data: any) => {
    const { newPassword, oldPassword, confirmPassword } = data;

    if (newPassword === oldPassword) {
      return Alert.alert("Erro", "Estas são a mesma senha.");
    }

    if (confirmPassword !== newPassword) {
      return Alert.alert("Erro", "A confirmação de senha não coincide.");
    }

    try {
      setLoading(true);
      const { error } = await supabase.functions.invoke(
        "secure-update-password",
        {
          body: {
            userId: userId,
            oldPassword: oldPassword,
            newPassword: newPassword,
          },
        }
      );

      if (error) {
        throw new Error(error);
      }

      Alert.alert(
        "Sucesso",
        "Atualização de senha bem-sucedida! Faça login com sua nova senha."
      );
      await supabase.auth.signOut({ scope: "local" });
      reset({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      navigation.goBack();
    } catch (error) {
      Alert.alert("Erro", "Verifique as credenciais digitadas.");
      console.error(error as FunctionsHttpError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <View style={styles.container}>
        <ScrollView>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Senha Atual</Text>
            <View style={styles.inputContainer}>
              <Controller
                control={control}
                name="oldPassword"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    label="Senha Atual"
                    value={value}
                    onChangeText={onChange}
                    secureTextEntry={!oldPasswordVisible}
                    style={styles.input}
                    underlineColor="transparent"
                    activeUnderlineColor="black"
                  />
                )}
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
            {errors.oldPassword && (
              <Text style={styles.errorText}>
                {errors.oldPassword.message?.toString()}
              </Text>
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Senha Nova</Text>
            <View style={styles.inputContainer}>
              <Controller
                control={control}
                name="newPassword"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    label="Senha Nova"
                    value={value}
                    onChangeText={onChange}
                    secureTextEntry={!newPasswordVisible}
                    style={styles.input}
                    underlineColor="transparent"
                    activeUnderlineColor="black"
                  />
                )}
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
            {errors.newPassword && (
              <Text style={styles.errorText}>
                {errors.newPassword.message as string}
              </Text>
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Confirme a Senha Nova</Text>
            <View style={styles.inputContainer}>
              <Controller
                control={control}
                name="confirmPassword"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    label="Confirme a Senha Nova"
                    value={value}
                    onChangeText={onChange}
                    secureTextEntry={!confirmPasswordVisible}
                    style={styles.input}
                    underlineColor="transparent"
                    activeUnderlineColor="black"
                  />
                )}
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
            {errors.confirmPassword && (
              <Text style={styles.errorText}>
                {errors.confirmPassword.message as string}
              </Text>
            )}
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={handleCancel}>
              <Text style={styles.buttonText}>Voltar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              disabled={loading}
              style={styles.button}
              onPress={handleSubmit(handleChangePassword)}
            >
              <Text style={styles.buttonText}>
                {loading ? "Alterando..." : "Alterar Senha"}
              </Text>
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
  errorText: {
    color: "red",
    fontSize: 12,
    marginBottom: 5,
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
