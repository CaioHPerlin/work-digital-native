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
import Formatter from "@/utils/formatter";
import AsyncStorage from "@react-native-async-storage/async-storage";

// API EXPECTED JSON:
// name: "John Doe";
// cpf: "606.917.340-62";
// email: "teste@example.com";
// password: "admin";
// state: "Rio Grande do Sul";
// city: "Porto Alegre";
// neighborhood: "Moinhos de Vento";
// street: "Av. I";
// number: "606";
// phone: "6799780609";
// birthdate: "1991-12-12";

interface FormData {
  email: string;
  password: string;
  name: string;
  cpf: string;
  state: string;
  city: string;
  neighborhood: string;
  street: string;
  number: string;
  phone: string;
  birthdate: string;
}

interface LocationData {
  id: string;
  nome: string;
  sigla?: string;
}

interface Props {
  navigation: any;
}

const RegisterAccount: React.FC<Props> = ({ navigation }) => {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    name: "",
    cpf: "",
    state: "",
    city: "",
    neighborhood: "",
    street: "",
    number: "",
    phone: "",
    birthdate: "",
  });

  const [states, setStates] = useState<LocationData[]>([]);
  const [cities, setCities] = useState<LocationData[]>([]);
  const [loadingStates, setLoadingStates] = useState<boolean>(true);
  const [loadingCities, setLoadingCities] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);

  const setValue = (name: keyof FormData, value: string) => {
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleRegister = async () => {
    if (Object.values(formData).some((field) => !field)) {
      Alert.alert(
        "Falha ao registrar",
        "Por favor, preencha todos os campos obrigatórios."
      );
      return;
    }
    setIsLoading(true);

    // Adicionar validação de input (numero, data de nascimento, etc)

    // Limpar o input
    const birthdate = Formatter.formatDate(formData.birthdate);
    const phone = Formatter.formatPhone(formData.phone);

    const data = {
      ...formData,
      birthdate: birthdate,
      phone: phone,
    };

    try {
      const userRes = await axios.post(
        "https://app-api-pied.vercel.app/users",
        data
      );

      if (userRes.status === 201) {
        Alert.alert("Sucesso", "Registro realizado com sucesso!");
        await AsyncStorage.setItem("cpf", data.cpf);
        navigation.navigate("HomeScreen");
      }
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        "Falha ao registrar. Tente novamente.";
      console.error(errorMessage);
      Alert.alert("Falha ao registrar", errorMessage);
    }
    setIsLoading(false);
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
    if (formData.state) {
      setLoadingCities(true);
      const fetchCities = async () => {
        try {
          const response = await axios.get(
            `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${formData.state}/municipios`
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
  }, [formData.state]);

  return (
    <View style={styles.container}>
      <ScrollView>
        <Text style={styles.title}>Cadastro</Text>

        <InputField
          label="Nome"
          value={formData.name}
          onChangeText={(value: string) => setValue("name", value)}
        />
        <InputField
          label="Email"
          value={formData.email}
          onChangeText={(value: string) => setValue("email", value)}
          keyboardType="email-address"
          textContentType="emailAddress"
          autoCorrect={false}
          autoCapitalize="none"
        />
        <InputField
          maxLength={14}
          label="CPF"
          value={formData.cpf}
          mask="cpf"
          placeholder="XXX.XXX.XXX-XX"
          onChangeText={(value: string) => setValue("cpf", value)}
          keyboardType="numeric"
        />
        <InputField
          maxLength={10}
          label="Data de Nascimento"
          mask="date"
          placeholder="XX/XX/XXXX"
          value={formData.birthdate}
          onChangeText={(value: string) => setValue("birthdate", value)}
          keyboardType="numeric"
        />

        <PickerField
          label="Estado"
          selectedValue={formData.state}
          onValueChange={(value: string) => {
            setValue("state", value);
            setValue("city", "");
          }}
          data={states}
          loading={loadingStates}
        />

        <PickerField
          label="Cidade"
          selectedValue={formData.city}
          onValueChange={(value: string) => setValue("city", value)}
          data={cities}
          loading={loadingCities}
          enabled={!!formData.state}
        />

        <InputField
          autoCapitalize="words"
          label="Rua"
          value={formData.street}
          onChangeText={(value: string) => setValue("street", value)}
        />
        <InputField
          label="Número"
          value={formData.number}
          onChangeText={(value: string) => setValue("number", value)}
          keyboardType="numeric"
        />
        <InputField
          label="Bairro"
          value={formData.neighborhood}
          onChangeText={(value: string) => setValue("neighborhood", value)}
        />
        <InputField
          maxLength={15}
          label="Telefone"
          mask="phone"
          placeholder="(XX) XXXX-XXXX"
          value={formData.phone}
          onChangeText={(value: string) => setValue("phone", value)}
          keyboardType="phone-pad"
          textContentType="telephoneNumber"
        />
        <InputField
          label="Senha"
          value={formData.password}
          onChangeText={(value: string) => setValue("password", value)}
          secureTextEntry
          autoCapitalize="none"
          textContentType="password"
        />

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("Login")}
            disabled={isLoading}
          >
            <Text style={styles.buttonText}>Cancelar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={handleRegister}
            disabled={isLoading}
          >
            <Text style={styles.buttonText}>
              {isLoading ? "Cadastrando..." : "Cadastrar"}
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
