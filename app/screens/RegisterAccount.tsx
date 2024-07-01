import React, { useEffect, useState } from 'react';
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
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import { Textarea, TextareaInput } from '@gluestack-ui/themed';
import { RadioButton } from 'react-native-paper';
import axios from 'axios';
import Layout from '../components/Layout';

const RegisterAccount = ({ navigation }) => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [estado, setEstado] = useState('');
  const [cidade, setCidade] = useState('');
  const [endereco, setEndereco] = useState('');
  const [numero, setNumero] = useState('');
  const [bairro, setBairro] = useState('');
  const [telefone, setTelefone] = useState('');
  const [senha, setSenha] = useState('');
  const [checked, setChecked] = useState('yesYears');
  const [estados, setEstados] = useState([]);
  const [cidades, setCidades] = useState([]);
  const [loadingEstados, setLoadingEstados] = useState(true);
  const [loadingCidades, setLoadingCidades] = useState(false);
  const [isPrestadorVisible, setPrestadorVisible] = useState(false);
  const [descricao, setDescricao] = useState('');
  const [servicos, setServicos] = useState([]);
  const [servicoAtual, setServicoAtual] = useState('');
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
      Alert.alert('Imagem carregada', 'A imagem foi carregada com sucesso!');
    }
  };

  useEffect(() => {
    const fetchEstados = async () => {
      try {
        const response = await axios.get('https://servicodados.ibge.gov.br/api/v1/localidades/estados');
        const sortedStates = response.data.sort((a, b) => a.nome.localeCompare(b.nome));
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
          const response = await axios.get(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${estado}/municipios`);
          const sortedCities = response.data.sort((a, b) => a.nome.localeCompare(b.nome));
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

  const handleRegister = () => {
    // Implementar lógica de registro
  };

  const addServico = () => {
    if (servicoAtual) {
      setServicos([...servicos, servicoAtual]);
      setServicoAtual('');
    }
  };

  return (
    <Layout>
      <View style={styles.container}>
        <ScrollView>
          <Text style={styles.title}>Cadastro</Text>
          <InputGroup label="Nome" value={nome} onChangeText={setNome} />
          <InputGroup label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" />

          <PickerGroup
            label="Estado"
            selectedValue={estado}
            onValueChange={(itemValue) => {
              setEstado(itemValue);
              setCidade('');
            }}
            options={estados}
            loading={loadingEstados}
            prompt="Selecione um estado"
          />

          <PickerGroup
            label="Cidade"
            selectedValue={cidade}
            onValueChange={setCidade}
            options={cidades}
            loading={loadingCidades}
            prompt="Selecione uma cidade"
            enabled={estado !== ''}
          />

          <InputGroup label="Endereço" value={endereco} onChangeText={setEndereco} />
          <InputGroup label="Número" value={numero} onChangeText={setNumero} keyboardType="numeric" />
          <InputGroup label="Bairro" value={bairro} onChangeText={setBairro} />
          <InputGroup label="Telefone" value={telefone} onChangeText={setTelefone} keyboardType="phone-pad" />

          <Text style={styles.label}>Tem +18 Anos</Text>
          <View style={styles.switch}>
            <View style={styles.radioGroup}>
              <Text>Sim</Text>
              <RadioButton
                value="yesYears"
                status={checked === 'yesYears' ? 'checked' : 'unchecked'}
                onPress={() => setChecked('yesYears')}
                color="#FFC88d"
              />
              <Text>Não</Text>
              <RadioButton
                value="notYears"
                status={checked === 'notYears' ? 'checked' : 'unchecked'}
                onPress={() => setChecked('notYears')}
                color="#FFC88d"
              />
            </View>
          </View>

          <InputGroup label="Senha" value={senha} onChangeText={setSenha} secureTextEntry />

          <TouchableOpacity style={styles.button} onPress={() => setPrestadorVisible(!isPrestadorVisible)}>
            <Text style={styles.buttonText}>Seja Autônomo</Text>
          </TouchableOpacity>


          {isPrestadorVisible && (
            <>
              <InputGroup label="Descrição" value={descricao} onChangeText={setDescricao} multiline />

              <View>
                <Text>Serviços selecionados</Text>
                {servicos.map((s, index) => (
                  <Text key={index} style={styles.servicoItem}>{s}</Text>
                ))}
              </View>

              <PickerGroup
                label="Tipo de Serviço"
                selectedValue={servicoAtual}
                onValueChange={setServicoAtual}
                options={[
                  { label: 'Selecione um serviço', value: '' },
                  { label: 'Serviço 1', value: 'servico1' },
                  { label: 'Serviço 2', value: 'servico2' },
                  { label: 'Serviço 3', value: 'servico3' },
                ]}
              />

              <TouchableOpacity style={styles.addButton} onPress={addServico}>
                <Text style={styles.addButtonText}>Adicionar Serviço</Text>
              </TouchableOpacity>

              <ImagePickerGroup label="Ícone" image={icone} onPickImage={() => pickImage(setIcone)} />
              <ImagePickerGroup label="Banner 1" image={banner1} onPickImage={() => pickImage(setBanner1)} />
              <ImagePickerGroup label="Banner 2" image={banner2} onPickImage={() => pickImage(setBanner2)} />
            </>
          )}

          <View style={styles.buttonContainer}>
            <Button text="Cancelar" onPress={handleCancel} />
            <Button text="Cadastrar" onPress={handleRegister} />
          </View>
        </ScrollView>
      </View>
    </Layout>
  );
}

const InputGroup = ({ label, value, onChangeText, keyboardType, secureTextEntry, multiline }) => (
  <View style={styles.inputGroup}>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      value={value}
      onChangeText={onChangeText}
      keyboardType={keyboardType}
      secureTextEntry={secureTextEntry}
      style={[styles.input, multiline && { height: 100 }]}
      multiline={multiline}
      underlineColor="transparent"
      activeUnderlineColor="black"
    />
  </View>
);

const PickerGroup = ({ label, selectedValue, onValueChange, options, loading, prompt, enabled = true }) => (
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

const ImagePickerGroup = ({ label, image, onPickImage }) => (
  <View style={styles.inputGroup}>
    <Text style={styles.label}>{label}</Text>
    <TouchableOpacity style={styles.imagePicker} onPress={onPickImage}>
      <Text style={styles.imagePickerText}>Escolher {label}</Text>
    </TouchableOpacity>
    {image && <Image source={{ uri: image }} style={styles.image} />}
  </View>
);

const Button = ({ text, onPress }) => (
  <TouchableOpacity style={styles.button} onPress={onPress}>
    <Text style={styles.buttonText}>{text}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 34,
    marginBottom: 20,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 10,
    width: '100%',
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  switch: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  radioGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  input: {
    backgroundColor: '#fef5eb',
    borderColor: '#FFC88d',
    borderWidth: 1,
    color: '#000000',
    borderRadius: 5,
    marginBottom: 10,
    height: 50,
    paddingHorizontal: 10,
  },
  picker: {
    backgroundColor: '#fef5eb',
    borderColor: '#FFC88d',
    borderWidth: 1,
    marginBottom: 10,
    height: 50,
    justifyContent: 'center',
  },
  imagePicker: {
    backgroundColor: '#FFC88d',
    padding: 20,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  imagePickerText: {
    color: '#000000',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    width: '100%',
  },
  button: {
    backgroundColor: '#FFC88d',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  buttonText: {
    color: '#000',
    fontWeight: 'bold',
  },
  image: {
    width: 100,
    height: 100,
    marginTop: 10,
    borderRadius: 5,
  },
  addButton: {
    backgroundColor: '#fef5eb',
    borderColor: '#FFC88d',
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  addButtonText: {
    color: '#000',
    fontWeight: 'bold',
  },
  servicoItem: {
    padding: 5,
    borderWidth: 1,
    borderColor: '#FFC88d',
    borderRadius: 5,
    marginBottom: 5,
    backgroundColor: '#fef5eb',
  },
});

export default RegisterAccount;
