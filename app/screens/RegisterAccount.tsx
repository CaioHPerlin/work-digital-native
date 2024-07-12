import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Image,
  ScrollView,
  Alert,
  ActivityIndicator,
  KeyboardTypeOptions,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import { RadioButton } from "react-native-paper";
import axios from "axios";
import Layout from "../components/Layout";

type Estado = {
  id: number;
  sigla: string;
  nome: string;
};

type Cidade = {
  id: number;
  nome: string;
};

type ImagePickerGroupProps = {
  label: string;
  image: string | null;
  onPickImage: () => void;
};

type PickerOption = { label: string; value: string };

type PickerGroupProps = {
  label: string;
  selectedValue: string | undefined;
  onValueChange: (itemValue: string, itemIndex: number) => void;
  options: PickerOption[];
  loading: boolean;
  prompt?: string;
  enabled?: boolean;
};

type InputGroupProps = {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  keyboardType?: string;
  secureTextEntry?: boolean;
  multiline?: boolean;
};

type ButtonProps = {
  text: string;
  onPress: () => void;
};

const RegisterAccount = ({ navigation }: { navigation: any }) => {
  const [nome, setNome] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [cpf, setCpf] = useState<string>("");
  const [birthdate, setBirthdate] = useState<string>("");
  const [estado, setEstado] = useState<string>("");
  const [cidade, setCidade] = useState<string>("");
  const [endereco, setEndereco] = useState<string>("");
  const [numero, setNumero] = useState<string>("");
  const [bairro, setBairro] = useState<string>("");
  const [telefone, setTelefone] = useState<string>("");
  const [senha, setSenha] = useState<string>("");
  const [checked, setChecked] = useState<string>("yesYears");
  const [estados, setEstados] = useState<Estado[]>([]);
  const [cidades, setCidades] = useState<Cidade[]>([]);
  const [loadingEstados, setLoadingEstados] = useState<boolean>(true);
  const [loadingCidades, setLoadingCidades] = useState<boolean>(false);
  const [isPrestadorVisible, setPrestadorVisible] = useState<boolean>(false);
  const [descricao, setDescricao] = useState<string>("");
  const [servicos, setServicos] = useState<string[]>([]);
  const [servicoAtual, setServicoAtual] = useState<string>("");
  const [icone, setIcone] = useState<string | null>(null);
  const [banner1, setBanner1] = useState<string | null>(null);
  const [banner2, setBanner2] = useState<string | null>(null);

  const Register = async () => {
    try {
      const userData = {
        name: nome,
        email: email,
        cpf: cpf,
        state: estado,
        city: cidade,
        street: endereco,
        number: numero,
        neighborhood: bairro,
        phone: telefone,
        password: senha,
        birthdate: birthdate,
      };

      console.log("Registering user with data:", userData);

      // Registra usuário normal
      const userRes = await axios.post(
        "https://work-digital-api.up.railway.app/users",
        userData
      );

      if (userRes.status === 201) {
        if (isPrestadorVisible) {
          // Registra como freelancer
          const freelancerData = {
            userId: cpf,
            role: servicos,
            description: descricao,
            icon: icone,
            banner1: banner1,
            banner2: banner2,
          };

          console.log("Registering freelancer with data:", freelancerData);

          const freelancerRes = await axios.post(
            "https://work-digital-api.up.railway.app/freelancers",
            freelancerData
          );

          if (freelancerRes.status === 201) {
            Alert.alert("Sucesso", "Registro realizado com sucesso!");
          } else {
            Alert.alert("Erro", "Falha ao registrar freelancer. Tente novamente.");
          }
        } else {
          Alert.alert("Sucesso", "Registro realizado com sucesso!");
        }
      } else {
        Alert.alert("Erro", "Falha ao registrar. Tente novamente.");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Falha ao registrar. Tente novamente.");
    }
  };

  const handleRegister = () => {
    if (!nome || !email || !cpf || !estado || !cidade || !endereco || !numero || !bairro || !telefone || !senha || !birthdate) {
      Alert.alert("Erro", "Por favor, preencha todos os campos obrigatórios.");
      return;
    }
    Register();
  };

  const pickImage = async (setImage: (uri: string) => void) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      Alert.alert("Imagem carregada", "A imagem foi carregada com sucesso!");
    }
  };

  useEffect(() => {
    const fetchEstados = async () => {
      try {
        const response = await axios.get(
          "https://servicodados.ibge.gov.br/api/v1/localidades/estados"
        );
        const sortedStates = response.data.sort((a: Estado, b: Estado) =>
          a.nome.localeCompare(b.nome)
        );
        setEstados(sortedStates);
        setLoadingEstados(false);
      } catch (error) {
        console.error(error);
        setLoadingEstados(false);
      }
    };
    fetchEstados();
  }, []);

  useEffect(() => {
    if (estado) {
      setLoadingCidades(true);
      const fetchCidades = async () => {
        try {
          const response = await axios.get(
            `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${estado}/municipios`
          );
          const sortedCities = response.data.sort((a: Cidade, b: Cidade) =>
            a.nome.localeCompare(b.nome)
          );
          setCidades(sortedCities);
          setLoadingCidades(false);
        } catch (error) {
          console.error(error);
          setLoadingCidades(false);
        }
      };
      fetchCidades();
    }
  }, [estado]);

  const handleCancel = () => {
    // Implementar lógica de cancelamento
  };


  const addServico = () => {
    if (servicoAtual) {
      setServicos([...servicos, servicoAtual]);
      setServicoAtual("");
    }
  };

  return (
    <Layout>
      <View style={styles.container}>
        <ScrollView>
          <Text style={styles.title}>Cadastro</Text>
          <InputGroup label="Nome" value={nome} onChangeText={setNome} />
          <InputGroup
            label="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />

          <InputGroup label="CPF" value={cpf} onChangeText={setCpf} />
          <InputGroup label="Data de Nascimento" value={birthdate} onChangeText={setBirthdate} />

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Estado</Text>
            {loadingEstados ? (
              <ActivityIndicator size="large" color="#FFC88d" />
            ) : (
              <Picker
                selectedValue={estado}
                onValueChange={(itemValue) => {
                  setEstado(itemValue);
                  setCidade("");
                }}
                style={styles.picker}
              >
                <Picker.Item label="Selecione um estado" value="" />
                {estados.map((estado) => (
                  <Picker.Item
                    key={estado.id}
                    label={estado.nome}
                    value={estado.sigla}
                  />
                ))}
              </Picker>
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Cidade</Text>
            {loadingCidades ? (
              <ActivityIndicator size="large" color="#FFC88d" />
            ) : (
              <Picker
                selectedValue={cidade}
                onValueChange={(itemValue) => setCidade(itemValue)}
                style={styles.picker}
                enabled={estado !== ""}
              >
                <Picker.Item label="Selecione uma cidade" value="" />
                {cidades.map((cidade) => (
                  <Picker.Item
                    key={cidade.id}
                    label={cidade.nome}
                    value={cidade.nome}
                  />
                ))}
              </Picker>
            )}
          </View>

          <InputGroup
            label="Endereço"
            value={endereco}
            onChangeText={setEndereco}
          />
          <InputGroup
            label="Número"
            value={numero}
            onChangeText={setNumero}
            keyboardType="numeric"
          />
          <InputGroup label="Bairro" value={bairro} onChangeText={setBairro} />
          <InputGroup
            label="Telefone"
            value={telefone}
            onChangeText={setTelefone}
            keyboardType="phone-pad"
          />

          <InputGroup
            label="Senha"
            value={senha}
            onChangeText={setSenha}
            secureTextEntry
          />

          
          <View style={styles.buttonContainer}>
            <FormButton text="Cancelar" onPress={handleCancel} />
            <FormButton text="Cadastrar" onPress={handleRegister} />
          </View>

        </ScrollView>
      </View>
    </Layout>
  );
};

const InputGroup = ({
  label,
  value,
  onChangeText,
  keyboardType = "default",
  secureTextEntry = false,
  multiline = false,
}: InputGroupProps) => (
  <View style={styles.inputGroup}>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      value={value}
      onChangeText={onChangeText}
      keyboardType={keyboardType as KeyboardTypeOptions}
      secureTextEntry={secureTextEntry}
      style={[styles.input, multiline && { height: 100 }]}
      multiline={multiline}
      underlineColorAndroid="transparent"
      autoCapitalize="none"
      autoCorrect={false}
    />
  </View>
);

const PickerGroup = ({
  label,
  selectedValue,
  onValueChange,
  options,
  loading,
  prompt,
  enabled = true,
}: PickerGroupProps) => (
  <View style={styles.inputGroup}>
    <Text style={styles.label}>{label}</Text>
    {loading ? (
      <ActivityIndicator size="large" color="#FFC88d" />
    ) : (
      <Picker
        selectedValue={selectedValue}
        onValueChange={onValueChange}
        style={styles.picker}
        enabled={enabled}
      >
        {options.map((option, index) => (
          <Picker.Item key={index} label={option.label} value={option.value} />
        ))}
      </Picker>
    )}
  </View>
);

const ImagePickerGroup = ({
  label,
  image,
  onPickImage,
}: ImagePickerGroupProps) => (
  <View style={styles.inputGroup}>
    <Text style={styles.label}>{label}</Text>
    <TouchableOpacity style={styles.imagePicker} onPress={onPickImage}>
      <Text style={styles.imagePickerText}>Escolher {label}</Text>
    </TouchableOpacity>
    {image && <Image source={{ uri: image }} style={styles.image} />}
  </View>
);

const FormButton = ({ text, onPress }: ButtonProps) => (
  <TouchableOpacity style={styles.button} onPress={onPress}>
    <Text style={styles.buttonText}>{text}</Text>
  </TouchableOpacity>
);

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
  switch: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  radioGroup: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 10,
  },
  input: {
    backgroundColor: "#fef5eb",
    borderColor: "#FFC88d",
    borderWidth: 1,
    color: "#000000",
    borderRadius: 5,
    marginBottom: 10,
    height: 50,
    paddingHorizontal: 10,
  },
  picker: {
    backgroundColor: "#fef5eb",
    borderColor: "#FFC88d",
    borderWidth: 1,
    marginBottom: 10,
    height: 50,
    justifyContent: "center",
  },
  imagePicker: {
    backgroundColor: "#FFC88d",
    padding: 20,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 10,
  },
  imagePickerText: {
    color: "#000000",
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
  image: {
    width: 100,
    height: 100,
    marginTop: 10,
    borderRadius: 5,
  },
  addButton: {
    backgroundColor: "#fef5eb",
    borderColor: "#FFC88d",
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  addButtonText: {
    color: "#000",
    fontWeight: "bold",
  },
  servicoItem: {
    padding: 5,
    borderWidth: 1,
    borderColor: "#FFC88d",
    borderRadius: 5,
    marginBottom: 5,
    backgroundColor: "#fef5eb",
  },
});

export default RegisterAccount;
