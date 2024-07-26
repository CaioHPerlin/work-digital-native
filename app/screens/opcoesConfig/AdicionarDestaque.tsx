import React, { useState } from "react";
import {
  View,
  Text,
  Button,
  TextInput,
  StyleSheet,
  FlatList,
  Alert,
  TouchableOpacity,
} from "react-native";
import DestakItem from "../../components/DestakItem";
import * as ImagePicker from "expo-image-picker";
import Layout from "../../components/Layout";

interface Destaque {
  id: number;
  nome: string;
  banner: string;
  imagens: string[];
}

const ManageDestak: React.FC = () => {
  const [destaques, setDestaques] = useState<Destaque[]>([]);
  const [nome, setNome] = useState<string>("");
  const [banner, setBanner] = useState<string>("");

  const pickBanner = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permissão necessária",
        "Precisamos da sua permissão para acessar a galeria."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setBanner(result.assets[0].uri);
    }
  };

  const addDestaque = () => {
    if (nome && banner) {
      setDestaques([
        ...destaques,
        { id: Date.now(), nome, banner, imagens: [] },
      ]);
      setNome("");
      setBanner("");
    } else {
      Alert.alert("Erro", "Por favor, preencha o nome e selecione um banner.");
    }
  };

  const addImageToDestaque = (id: number, image: string) => {
    setDestaques(
      destaques.map((d) =>
        d.id === id ? { ...d, imagens: [...d.imagens, image] } : d
      )
    );
  };

  const removeImageFromDestaque = (id: number, index: number) => {
    setDestaques(
      destaques.map((d) =>
        d.id === id
          ? { ...d, imagens: d.imagens.filter((_, i) => i !== index) }
          : d
      )
    );
  };

  return (
    <Layout>
      <View style={styles.container}>
        <Text style={styles.title}>Gerenciar Destaques</Text>
        <TextInput
          placeholder="Nome do Destaque"
          value={nome}
          onChangeText={setNome}
          style={styles.input}
        />
        <TouchableOpacity onPress={pickBanner} style={styles.button}>
          <Text>Selecionar Banner</Text>
        </TouchableOpacity>
        {banner ? <Text>Banner Selecionado</Text> : null}
        <TouchableOpacity onPress={addDestaque} style={styles.button}>
          <Text>Adicionar Destaque</Text>
        </TouchableOpacity>
        <FlatList
          data={destaques}
          renderItem={({ item }) => (
            <DestakItem
              nome={item.nome}
              banner={item.banner}
              imagens={item.imagens}
              onAddImage={(image) => addImageToDestaque(item.id, image)}
              onRemoveImage={(index) => removeImageFromDestaque(item.id, index)}
            />
          )}
          keyExtractor={(item) => item.id.toString()}
          style={styles.destaqueList}
        />
      </View>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 20,
    textAlign: "center",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#FFC88d",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 10,
    width: "80%",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    backgroundColor: "#fff",
  },
  destaqueList: {
    marginTop: 20,
  },
});

export default ManageDestak;
