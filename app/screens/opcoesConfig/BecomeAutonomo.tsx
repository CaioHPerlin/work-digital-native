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
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import { Textarea, TextareaInput } from "@gluestack-ui/themed";
import Layout from "@/app/components/Layout";

const BecomeAutonomo = ({ navigation }) => {
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [servico, setServico] = useState("");
  const [icone, setIcone] = useState(null);
  const [banner1, setBanner1] = useState(null);
  const [banner2, setBanner2] = useState(null);

  const pickImage = async (setImage) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setImage(result.uri);
      Alert.alert("Imagem carregada", "A imagem foi carregada com sucesso!");
    }
  };

  return (
    <Layout>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Tornar-se Autônomo</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nome Fantasia</Text>
          <TextInput
            value={nome}
            placeholder="Digite o nome fantasia "
            onChangeText={(text) => setNome(text)}
            style={styles.input}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Descrição</Text>
          <Textarea
            isReadOnly={false}
            isInvalid={true}
            isDisabled={false}
            w="$64"
          >
            <TextareaInput
              style={styles.input}
              placeholder="Escreva a descrição dos seus serviços"
              value={descricao}
              onChangeText={(text) => setDescricao(text)}
            />
          </Textarea>
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

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Ícone</Text>
          <TouchableOpacity
            style={styles.imagePicker}
            onPress={() => pickImage(setIcone)}
          >
            <Text style={styles.imagePickerText}>Escolher Ícone</Text>
          </TouchableOpacity>
          {icone && <Image source={{ uri: icone }} style={styles.image} />}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Banner 1</Text>
          <TouchableOpacity
            style={styles.imagePicker}
            onPress={() => pickImage(setBanner1)}
          >
            <Text style={styles.imagePickerText}>Escolher Banner 1</Text>
          </TouchableOpacity>
          {banner1 && <Image source={{ uri: banner1 }} style={styles.image} />}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Banner 2</Text>
          <TouchableOpacity
            style={styles.imagePicker}
            onPress={() => pickImage(setBanner2)}
          >
            <Text style={styles.imagePickerText}>Escolher Banner 2</Text>
          </TouchableOpacity>
          {banner2 && <Image source={{ uri: banner2 }} style={styles.image} />}
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.buttonConfirmar}>
            <Text style={styles.buttonText}>Confirmar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonVisualizar}>
            <Text style={styles.buttonText}>Visualizar</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.buttonVoltar}
          onPress={() => navigation.navigate("ConfigApp")}
        >
          <Text style={styles.buttonText}>Voltar para Configurações</Text>
        </TouchableOpacity>
      </ScrollView>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
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
  buttonText: {
    color: "#000",
    fontWeight: "bold",
  },
});

export default BecomeAutonomo;
