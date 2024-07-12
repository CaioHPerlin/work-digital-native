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
import Layout from "@/app/components/Layout";

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
  const [servico, setServico] = useState<string>("");
  const [icone, setIcone] = useState<string | null>(null);
  const [banner1, setBanner1] = useState<string | null>(null);
  const [banner2, setBanner2] = useState<string | null>(null);

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

  return (
    <Layout>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Tornar-se Autônomo</Text>


        <View style={styles.inputGroup}>
          <Text style={styles.label}>Descrição</Text>
          <TextInput
            style={[styles.input, { height: 100 }]}
            placeholder="Escreva a descrição dos seus serviços"
            value={descricao}
            onChangeText={setDescricao}
            multiline
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Tipo de Serviço</Text>
          <Picker
            selectedValue={servico}
            style={styles.picker}
            onValueChange={(itemValue) => setServico(itemValue)}
          >
            <Picker.Item label="Selecione um serviço" value="" />
            <Picker.Item label="Serviço 1" value="servico1" />
            <Picker.Item label="Serviço 2" value="servico2" />
            <Picker.Item label="Serviço 3" value="servico3" />
          </Picker>
        </View>

        <ImagePickerGroup
          label="Ícone"
          image={icone}
          onPickImage={() => pickImage(setIcone)}
        />
        <ImagePickerGroup
          label="Banner 1"
          image={banner1}
          onPickImage={() => pickImage(setBanner1)}
        />
        <ImagePickerGroup
          label="Banner 2"
          image={banner2}
          onPickImage={() => pickImage(setBanner2)}
        />

        <View style={styles.buttonContainer}>
          <FormButton
            text="Confirmar"
            style={styles.buttonConfirmar}
            textStyle={styles.buttonText}
          />
          <FormButton
            text="Visualizar"
            style={styles.buttonVisualizar}
            textStyle={styles.buttonText}
          />
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
    marginTop:20,
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
    marginTop: 20,
    width: "100%",
  },
  button: {
    backgroundColor: "#FFC88d",
    padding: 30,
    marginTop: 10,
    borderRadius: 5,
    alignItems: "center",
    flex: 1,
    marginHorizontal: 5,
  },
  buttonVoltar: {
    backgroundColor: "#FFC88d",
    padding: 20,
    marginTop: 10,
    borderRadius: 5,
    alignItems: "center",
    width: 250,
  },
  buttonConfirmar: {
    backgroundColor: "#a3ff7f",
    padding: 15,
    marginTop: 10,
    borderRadius: 5,
    alignItems: "center",
    flex: 1,
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
  buttonDesativar: {
    backgroundColor: "#ff5151",
    width: 250,
    padding: 20,
    marginTop: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#000",
    fontWeight: "bold",
  },
});

export default BecomeAutonomo;
