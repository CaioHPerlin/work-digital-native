import React from 'react';
import { View, Text, StyleSheet, FlatList, Image } from 'react-native';

const freelancers = [
  { id: '1', name: 'João Silva', role: 'Desenvolvedor Web', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS3LNtU9Vm-wzMbyN6YvwfxsmukZhcKlE5YEQ&s' },
  { id: '2', name: 'Maria Oliveira', role: 'Designer Gráfico', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS3LNtU9Vm-wzMbyN6YvwfxsmukZhcKlE5YEQ&s' },
  { id: '3', name: 'Carlos Santos', role: 'Redator', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS3LNtU9Vm-wzMbyN6YvwfxsmukZhcKlE5YEQ&s' },
  { id: '4', name: 'Ana Souza', role: 'Tradutora', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS3LNtU9Vm-wzMbyN6YvwfxsmukZhcKlE5YEQ&s' },
  { id: '5', name: 'Paulo Pereira', role: 'Fotógrafo', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS3LNtU9Vm-wzMbyN6YvwfxsmukZhcKlE5YEQ&s' },
  { id: '6', name: 'Mariana Costa', role: 'Consultora de Marketing', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS3LNtU9Vm-wzMbyN6YvwfxsmukZhcKlE5YEQ&s' },
  { id: '7', name: 'Ricardo Lima', role: 'Desenvolvedor de Apps', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS3LNtU9Vm-wzMbyN6YvwfxsmukZhcKlE5YEQ&s' },
  { id: '8', name: 'Fernanda Alves', role: 'Editora de Vídeo', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS3LNtU9Vm-wzMbyN6YvwfxsmukZhcKlE5YEQ&s' },
  { id: '9', name: 'Rafael Rodrigues', role: 'Desenvolvedor de Jogos', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS3LNtU9Vm-wzMbyN6YvwfxsmukZhcKlE5YEQ&s' },
  { id: '10', name: 'Claudia Martins', role: 'Assistente Virtual', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS3LNtU9Vm-wzMbyN6YvwfxsmukZhcKlE5YEQ&s' },
];

export default function ListFreelancer() {
  return (
    <View style={styles.container}>
      <FlatList
        data={freelancers}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <View style={styles.textContainer}>
              <Text style={styles.nameText}>Nome: {item.name}</Text>
              <Text style={styles.roleText}>Cargo: {item.role}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    margin: 5,
    backgroundColor: '#c3e7ff',
    borderBottomColor: 'trasparent',
    borderRadius: 5,
  },
  textContainer: {
    marginLeft: 10,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  idText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  nameText: {
    fontSize: 16,
  },
  roleText: {
    fontSize: 14,
    color: '#666',
  },
});
