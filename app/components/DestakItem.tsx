import React from 'react';
import { View, Text, Button, Image, FlatList, StyleSheet, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';


interface DestakItemProps {
  nome: string;
  banner: string;
  imagens: string[];
  onAddImage: (image: string) => void;
  onRemoveImage: (index: number) => void;
}

const DestakItem: React.FC<DestakItemProps> = ({ nome, banner, imagens, onAddImage, onRemoveImage }) => {
  const pickImage = async () => {
    if (imagens.length >= 10) {
      Alert.alert("Limite atingido", "Você só pode adicionar até 10 imagens.");
      return;
    }

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão necessária', 'Precisamos da sua permissão para acessar a galeria.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      onAddImage(result.assets[0].uri);
    }
  };

  return (
  
    <View style={styles.destaqueContainer}>
      <Text style={styles.destaqueTitle}>{nome}</Text>
      <Image source={{ uri: banner }} style={styles.banner} />
      <Button title="Adicionar Imagem" onPress={pickImage} />
      <FlatList
        data={imagens}
        renderItem={({ item, index }) => (
          <View style={styles.imageContainer}>
            <Image source={{ uri: item }} style={styles.image} />
            <Button title="Remover" onPress={() => onRemoveImage(index)} />
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
        numColumns={2}
        style={styles.imageList}
      />
    </View>
      );
};

const styles = StyleSheet.create({
  destaqueContainer: {
    marginBottom: 20,
    padding: 10,
   
    borderRadius: 10,
  },
  destaqueTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  banner: {
    width: '100%',
    height: 150,
    marginBottom: 10,
    borderRadius: 10,
  },
  imageContainer: {
    margin: 10,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  imageList: {
    marginTop: 20,
  },
});

export default DestakItem;
