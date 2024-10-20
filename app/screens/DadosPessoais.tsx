import * as React from "react";
import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  TextInput,
} from "react-native";
import { supabase } from "../../lib/supabase";
import InputField from "../components/InputField";
import LinkedState from "../components/LinkedState";
import LinkedCity from "../components/LinkedCity";
import { z } from "zod";

type DadosPessoaisProps = {
  navigation: any;
  userId: string;
};

// Define the schema for email validation
const schema = z.object({
  email: z.string().email("Por favor, insira um endereço de e-mail válido."),
});

export default function DadosPessoais({
  navigation,
  userId,
}: DadosPessoaisProps) {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [estado, setEstado] = useState<string>("");
  const [cidade, setCidade] = useState<string>("");

  const [emailError, setEmailError] = useState<string>("");

  let initEmail = "";

  const fetchUserProfile = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles") // Adjust table name if needed
        .select("*")
        .eq("id", userId) // Replace with actual user ID
        .single();

      if (error) {
        console.error("Error fetching user profile:", error);
        return;
      }

      setName(data.name);
      setEmail(data.email);
      initEmail = data.email;
      setEstado(data.state);
      setCidade(data.city);
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  useEffect(() => {
    // Fetch user profile on component mount
    fetchUserProfile();
  }, []);

  const updateUserProfile = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("profiles") // Adjust table name if needed
        .update({
          name: name,
          email: email,
          state: estado,
          city: cidade,
        })
        .eq("id", userId); // Replace with actual user ID

      if (error) {
        console.error("Error updating user profile:", error);
        Alert.alert(
          "Erro",
          "Ocorreu um erro ao tentar atualizar o perfil do usuário."
        );
        return;
      }

      Alert.alert("Sucesso", "Dados pessoais atualizados com sucesso.");
      fetchUserProfile();
      navigation.goBack();
    } catch (error) {
      console.error("Error updating user profile:", error);
      Alert.alert(
        "Erro",
        "Ocorreu um erro ao tentar atualizar o perfil do usuário."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  const handleDadosPessoais = async () => {
    try {
      schema.parse({ email });

      if (estado && cidade) {
        await updateUserProfile();
      } else {
        Alert.alert("Erro", "Por favor, selecione uma cidade e um estado.");
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        setEmailError(error.errors[0]?.message);
      }
    }
  };
  return (
    <>
      <View style={styles.container}>
        <ScrollView>
          <View style={styles.inputGroup}>
            {/* Full Name Input */}
            <InputField
              label="Nome Completo"
              value={name}
              onChangeText={(v) => setName(v)}
              autoCapitalize="words"
              keyboardType="default"
            />

            <InputField
              label="E-mail"
              value={email}
              onChangeText={(v) => {
                setEmail(v);
                setEmailError("");
              }}
              autoCapitalize="none"
              keyboardType="email-address"
              errorMessage={emailError}
            />

            <Text style={styles.label}>Estado</Text>
            <LinkedState state={estado} setState={setEstado} />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Cidade</Text>

            <LinkedCity state={estado} city={cidade} setCity={setCidade} />
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={handleCancel}>
              <Text style={styles.buttonText}>Voltar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={handleDadosPessoais}
            >
              <Text style={styles.buttonText}>
                {loading ? "Atualizando..." : "Atualizar Dados"}
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
    marginTop: 40,
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    color: "#2d47f0",
    fontSize: 28,
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
  picker: {
    backgroundColor: "#fffefd",
    borderColor: "#FFC88d",
    borderWidth: 1,
    marginBottom: 10,
    height: 50,
    width: "100%",
    justifyContent: "center",
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
