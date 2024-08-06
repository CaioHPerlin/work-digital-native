import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Image,
  ScrollView,
  Alert,
  KeyboardTypeOptions,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import Layout from "@/app/components/Layout";
import defaultRoles from "@/constants/roles";
import AsyncStorage from "@react-native-async-storage/async-storage";

type BecomeAutonomoProps = {
  navigation: any;
};

type ImagePickerGroupProps = {
  label: string;
  image: string | null;
  onPickImage: () => void;
};

type InputGroupProps = {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  keyboardType?: KeyboardTypeOptions;
};

const BecomeAutonomo = ({ navigation }: BecomeAutonomoProps) => {
  const [descricao, setDescricao] = useState<string>("");
  const [roles, setRoles] = useState<string[]>([]);
  const [icone, setIcone] = useState<string | null>(null);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setIcone(result.assets[0].uri);
      Alert.alert("Imagem carregada", "A imagem foi carregada com sucesso!");
    }
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      const cpf = await AsyncStorage.getItem("cpf");
      if (cpf != null) {
        formData.append("cpf", cpf);
      } else {
        throw new Error("CPF não encontrado. Faça login novamente.");
      }
      formData.append("description", descricao);
      formData.append("roles", JSON.stringify(roles));

      if (icone) {
        const uriParts = icone.split(".");
        const fileType = uriParts[uriParts.length - 1];

        const photo = {
          uri: icone,
          name: `profile.${fileType}`,
          type: `image/${fileType}`,
        };

        formData.append("photo", photo);
      }

      // Debugging: Log FormData to ensure it's correct
      console.log("FormData:", formData);

      // Post request with appropriate headers
      const response = await axios.post(
        "https://app-api-pied.vercel.app/freelancers",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Freelancer created:", response.data);
      Alert.alert("Sucesso", "Prestador cadastrado com sucesso!");
      // Optionally navigate to another screen upon successful submission
      // navigation.navigate('AnotherScreen');
    } catch (error) {
      console.error("Erro ao cadastrar prestador:", error);
      Alert.alert(
        "Erro",
        "Ocorreu um erro ao cadastrar o prestador. Verifique sua conexão de internet e tente novamente."
      );
    }
  };

  const handleRemoveRole = (roleToRemove: string) => {
    const updatedRoles = roles.filter((role) => role !== roleToRemove);
    setRoles(updatedRoles);
  };

  return (
    <Layout>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Tornar-se Autônomo</Text>

        <InputGroup
          label="Descrição"
          value={descricao}
          onChangeText={setDescricao}
          placeholder="Escreva a descrição dos seus serviços"
        />

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Tipo de Serviço</Text>
          <Picker
            selectedValue={""}
            style={styles.picker}
            onValueChange={(itemValue) => {
              if (itemValue && roles.length < 5 && !roles.includes(itemValue)) {
                setRoles([...roles, itemValue]);
              }
            }}
          >
            <Picker.Item label="Selecione um serviço" value="" />
            {defaultRoles.map((role: string) => (
              <Picker.Item
                label={role}
                value={role}
                key={role}
                enabled={role.length > 1}
                style={
                  role.length > 1 ? { color: "#000" } : { color: "#aeaeae" }
                }
              />
            ))}
          </Picker>
        </View>

        <View style={styles.rolesContainer}>
          <Text style={styles.label}>Serviços Selecionados:</Text>
          <View style={styles.selectedRoles}>
            {roles.map((role, index) => (
              <View key={index} style={styles.selectedRoleContainer}>
                <Text style={styles.selectedRole}>{role}</Text>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleRemoveRole(role)}
                >
                  <Text style={styles.deleteButtonText}>X</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>

        <ImagePickerGroup label="Ícone" image={icone} onPickImage={pickImage} />
        <FormButton
          text="Gerenciar Destaque"
          style={styles.buttonDestak}
          onPress={() => navigation.navigate("ManageDestak")}
        />
        <View style={styles.buttonContainer}>
          <FormButton
            text="Confirmar"
            onPress={handleSubmit}
            style={styles.buttonConfirmar}
            textStyle={styles.buttonText}
          />
          {/*<FormButton text="Visualizar" style={styles.buttonVisualizar textStyle={styles.buttonText}/>*/}
        </View>

        <FormButton
          text="Voltar para Configurações"
          style={styles.buttonVoltar}
          textStyle={styles.buttonText}
          onPress={() => navigation.navigate("ConfigApp")}
        />
      </ScrollView>
    </Layout>
  );
};

const InputGroup = ({
  label,
  value,
  onChangeText,
  placeholder = "",
  keyboardType = "default",
}: InputGroupProps) => (
  <View style={styles.inputGroup}>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      value={value}
      placeholder={placeholder}
      onChangeText={onChangeText}
      keyboardType={keyboardType}
      style={styles.input}
    />
  </View>
);

const FormButton = ({
  text,
  onPress,
  style,
  textStyle,
}: {
  text: string;
  onPress?: () => void;
  style: object;
  textStyle: object;
}) => (
  <TouchableOpacity style={style} onPress={onPress}>
    <Text style={textStyle}>{text}</Text>
  </TouchableOpacity>
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

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    flexGrow: 1,
    padding: 30,
    alignItems: "center",
  },
  title: {
    fontSize: 34,
    marginBottom: 20,
    textAlign: "center",
    color: "#000000",
  },
  inputGroup: {
    marginBottom: 15,
    width: "100%",
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: "#000000",
  },
  input: {
    borderColor: "#FFC88d",
    borderWidth: 1,
    borderRadius: 5,
    padding: 15,
    backgroundColor: "#fef5eb",
  },
  picker: {
    borderColor: "#FFC88d",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    backgroundColor: "#fef5eb",
  },
  imagePicker: {
    backgroundColor: "#FFC88d",
    padding: 20,
    borderRadius: 5,
    alignItems: "center",
  },
  imagePickerText: {
    color: "#000000",
  },
  image: {
    width: 100,
    height: 100,
    marginTop: 10,
    borderRadius: 5,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: "35%",
    width: "100%",
  },
  buttonVoltar: {
    backgroundColor: "#FFC88d",
    padding: 20,
    marginTop: 10,
    borderRadius: 5,
    alignItems: "center",
    width: "97%",
  },
  buttonDestak: {
    backgroundColor: "#FFC88d",
    padding: 20,
    marginTop: 10,
    borderRadius: 5,
    alignItems: "center",
    width: "97%",
  },
  buttonConfirmar: {
    backgroundColor: "#a3ff7f",
    padding: 20,
    marginTop: 10,
    borderRadius: 5,
    alignItems: "center",
    width: "97%",
    marginHorizontal: 5,
  },
  buttonVisualizar: {
    backgroundColor: "#ffec7f",
    padding: 15,
    marginTop: 10,
    borderRadius: 5,
    alignItems: "center",
    flex: 1,
    marginHorizontal: 5,
  },
  buttonText: {
    color: "#000",
    fontWeight: "bold",
  },
  rolesContainer: {
    marginBottom: 15,
    width: "100%",
  },
  selectedRoles: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 5,
  },
  selectedRoleContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFC88d",
    padding: 5,
    marginRight: 5,
    marginBottom: 5,
    borderRadius: 5,
  },
  selectedRole: {
    marginRight: 5,
  },
  deleteButton: {
    backgroundColor: "#f54242",
    borderRadius: 10,
    padding: 5,
  },
  deleteButtonText: {
    color: "#fff",
    paddingHorizontal: 5,
  },
});

export default BecomeAutonomo;
