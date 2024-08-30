import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import axios from "axios";
import InputField from "../components/InputField";
import PickerField from "../components/PickerField";
import { SignUpUser } from "@/interfaces/Auth";
import Location from "@/interfaces/Location";
import { supabase } from "@/lib/supabase";
import { z } from "zod";

const signUpSchema = z.object({
  name: z.string().min(3, { message: "Nome deve ter pelo menos 3 caracteres" }),
  email: z.string().email("Formato de e-mail inválido"),
  password: z
    .string()
    .min(6, { message: "Senha deve ter pelo menos 6 caracteres" }),
  state: z.string().min(1, { message: "Estado é obrigatório" }),
  city: z.string().min(1, { message: "Cidade é obrigatória" }),
});

interface Props {
  navigation: any;
}

const RegisterAccount: React.FC<Props> = ({ navigation }) => {
  const [user, setUser] = useState<SignUpUser>({
    name: "",
    email: "",
    password: "",
    state: "",
    city: "",
  });

  const [states, setStates] = useState<Location[]>([]);
  const [cities, setCities] = useState<Location[]>([]);
  const [loadingStates, setLoadingStates] = useState<boolean>(true);
  const [loadingCities, setLoadingCities] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email: user.email,
      password: user.password,
      options: {
        data: {
          name: user.name,
          email: user.email,
          state: user.state,
          city: user.city,
          is_freelancer: false,
        },
      },
    });

    if (error) Alert.alert(error.message);
    Alert.alert(JSON.stringify(data));
    setLoading(false);
  };

  useEffect(() => {
    const fetchStates = async () => {
      try {
        const response = await axios.get(
          "https://servicodados.ibge.gov.br/api/v1/localidades/estados"
        );
        setStates(
          response.data.sort((a: any, b: any) => a.nome.localeCompare(b.nome))
        );
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingStates(false);
      }
    };

    fetchStates();
  }, []);

  useEffect(() => {
    if (user.state) {
      setLoadingCities(true);
      const fetchCities = async () => {
        try {
          const response = await axios.get(
            `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${user.state}/municipios`
          );
          setCities(
            response.data.sort((a: any, b: any) => a.nome.localeCompare(b.nome))
          );
        } catch (error) {
          console.error(error);
        } finally {
          setLoadingCities(false);
        }
      };

      fetchCities();
    }
  }, [user.state]);

  return (
    <View style={styles.container}>
      <ScrollView>
        <Text style={styles.title}>Cadastro</Text>
        <InputField
          label="Nome Completo"
          value={user.name}
          onChangeText={(text) => setUser({ ...user, name: text })}
          autoCapitalize="words"
          keyboardType="default"
        />
        <InputField
          label="E-mail"
          value={user.email}
          onChangeText={(text) => setUser({ ...user, email: text })}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <InputField
          label="Senha"
          value={user.password}
          onChangeText={(text) => setUser({ ...user, password: text })}
          secureTextEntry
          autoCapitalize="none"
        />

        <PickerField
          label="Estado"
          selectedValue={user.state}
          onValueChange={(text: string) => setUser({ ...user, state: text })}
          data={states}
          loading={loadingStates}
        />

        <PickerField
          label="Cidade"
          selectedValue={user.city}
          onValueChange={(text: string) => setUser({ ...user, city: text })}
          data={cities}
          loading={loadingCities}
          enabled={!!user.state}
        />
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("Login")}
            disabled={loading}
          >
            <Text style={styles.buttonText}>Cancelar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={handleSignUp}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? "Cadastrando..." : "Cadastrar"}
            </Text>
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
    marginTop: 25,
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
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    width: "100%",
  },
  button: {
    backgroundColor: "#2d47f0",
    padding: 10,
    borderRadius: 5,
    width: "48%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default RegisterAccount;
