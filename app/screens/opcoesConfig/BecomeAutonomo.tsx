import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Image, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';


  const BecomeAutonomo = ({ setCurrentScreen }) => {
    const [descricao, setDescricao] = useState('');
    const [servico, setServico] = useState('');
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
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Tornar-se Autônomo</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Descrição</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite uma descrição"
          value={descricao}
          onChangeText={text => setDescricao(text)}
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

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Ícone</Text>
        <TouchableOpacity style={styles.imagePicker} onPress={() => pickImage(setIcone)}>
          <Text style={styles.imagePickerText}>Escolher Ícone</Text>
        </TouchableOpacity>
        {icone && <Image source={{ uri: icone }} style={styles.image} />}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Banner 1</Text>
        <TouchableOpacity style={styles.imagePicker} onPress={() => pickImage(setBanner1)}>
          <Text style={styles.imagePickerText}>Escolher Banner 1</Text>
        </TouchableOpacity>
        {banner1 && <Image source={{ uri: banner1 }} style={styles.image} />}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Banner 2</Text>
        <TouchableOpacity style={styles.imagePicker} onPress={() => pickImage(setBanner2)}>
          <Text style={styles.imagePickerText}>Escolher Banner 2</Text>
        </TouchableOpacity>
        {banner2 && <Image source={{ uri: banner2 }} style={styles.image} />}
      </View>

      <TouchableOpacity style={styles.button} onPress={() => setCurrentScreen('#  ')}>
        <Text style={styles.buttonText}>Vizualizar</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => setCurrentScreen('#')}>
        <Text style={styles.buttonText}>Confirmar</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => setCurrentScreen('ConfigApp')}>
        <Text style={styles.buttonText}>Voltar para Configurações</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 34,
    marginBottom: 20,
    textAlign: 'center',
    color: '#000000',
  },
  inputGroup: {
    marginBottom: 15,
    width: '100%',
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#000000',
  },
  input: {
    borderColor: '#FFC88d',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    backgroundColor: '#fef5eb',
  },
  picker: {
    borderColor: '#FFC88d',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    backgroundColor: '#fef5eb',
  },
  imagePicker: {
    backgroundColor: '#FFC88d',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  imagePickerText: {
    color: '#000000',
  },
  image: {
    width: 100,
    height: 100,
    marginTop: 10,
    borderRadius: 5,
  },
  button: {
    backgroundColor: '#FFC88d',
    padding: 10,
    marginTop: 20,
    borderRadius: 5,
    alignItems: 'center',
    width: '100%',
  },
  buttonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default BecomeAutonomo;
