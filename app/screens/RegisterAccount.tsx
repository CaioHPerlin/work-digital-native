import * as React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { TextInput } from 'react-native-paper';

export default function RegisterAccount() {
  const [nome, setNome] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [estado, setEstado] = React.useState('');
  const [cidade, setCidade] = React.useState('');
  const [endereco, setEndereco] = React.useState('');
  const [numero, setNumero] = React.useState('');
  const [bairro, setBairro] = React.useState('');
  const [telefone, setTelefone] = React.useState('');
  const [senha, setSenha] = React.useState('');

  const handleCancel = () => {
    // Implementar lógica de cancelamento
  };

  const handleRegister = () => {
    // Implementar lógica de registro
  };

  return (
    <View style={styles.container}>
      <TextInput
        label="Nome"
        value={nome}
        onChangeText={text => setNome(text)}
        style={styles.input}
      />
      <TextInput
        label="Email"
        value={email}
        onChangeText={text => setEmail(text)}
        style={styles.input}
      />
      <TextInput
        label="Estado"
        value={estado}
        onChangeText={text => setEstado(text)}
        style={styles.input}
      />
      <TextInput
        label="Cidade"
        value={cidade}
        onChangeText={text => setCidade(text)}
        style={styles.input}
      />
      <TextInput
        label="Endereço"
        value={endereco}
        onChangeText={text => setEndereco(text)}
        style={styles.input}
      />
      <TextInput
        label="Número"
        value={numero}
        onChangeText={text => setNumero(text)}
        style={styles.input}
      />
      <TextInput
        label="Bairro"
        value={bairro}
        onChangeText={text => setBairro(text)}
        style={styles.input}
      />
      <TextInput
        label="Telefone"
        value={telefone}
        onChangeText={text => setTelefone(text)}
        style={styles.input}
      />
      <TextInput
        label="Senha"
        value={senha}
        onChangeText={text => setSenha(text)}
        secureTextEntry
        style={styles.input}
      />

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleCancel}>
          <Text style={styles.buttonText}>Cancelar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Cadastrar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  input: {
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
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
});
