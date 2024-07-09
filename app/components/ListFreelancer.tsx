import React from "react";
import { View, Text, StyleSheet, FlatList, Image } from "react-native";

// const freelancers = [
//   { id: '1', name: 'João Silva', role: 'Desenvolvedor Web', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS3LNtU9Vm-wzMbyN6YvwfxsmukZhcKlE5YEQ&s' },
//   { id: '2', name: 'Maria Oliveira', role: 'Designer Gráfico', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS3LNtU9Vm-wzMbyN6YvwfxsmukZhcKlE5YEQ&s' },
//   { id: '3', name: 'Carlos Santos', role: 'Redator', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS3LNtU9Vm-wzMbyN6YvwfxsmukZhcKlE5YEQ&s' },
//   { id: '4', name: 'Ana Souza', role: 'Tradutora', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS3LNtU9Vm-wzMbyN6YvwfxsmukZhcKlE5YEQ&s' },
//   { id: '5', name: 'Paulo Pereira', role: 'Fotógrafo', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS3LNtU9Vm-wzMbyN6YvwfxsmukZhcKlE5YEQ&s' },
//   { id: '6', name: 'Mariana Costa', role: 'Consultora de Marketing', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS3LNtU9Vm-wzMbyN6YvwfxsmukZhcKlE5YEQ&s' },
//   { id: '7', name: 'Ricardo Lima', role: 'Desenvolvedor de Apps', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS3LNtU9Vm-wzMbyN6YvwfxsmukZhcKlE5YEQ&s' },
//   { id: '8', name: 'Fernanda Alves', role: 'Editora de Vídeo', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS3LNtU9Vm-wzMbyN6YvwfxsmukZhcKlE5YEQ&s' },
//   { id: '9', name: 'Rafael Rodrigues', role: 'Desenvolvedor de Jogos', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS3LNtU9Vm-wzMbyN6YvwfxsmukZhcKlE5YEQ&s' },
//   { id: '10', name: 'Claudia Martins', role: 'Assistente Virtual', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS3LNtU9Vm-wzMbyN6YvwfxsmukZhcKlE5YEQ&s' },
// ];

interface Freelancer {
  id: number;
  role: string;
  name: string;
  phone: string;
  email: string;
  city: string;
  state: string;
  description: string;
  profile_picture: string;
  picture_folder: string;
}

interface ListFreelancerProps {
  data: Freelancer[];
}

const ListFreelancer: React.FC<ListFreelancerProps> = ({ data }) => {
  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Image
              source={{ uri: item.profile_picture }}
              style={styles.image}
            />
            <View style={styles.textContainer}>
              <Text style={styles.nameText}>{item.name}</Text>
              <Text style={styles.roleText}>{item.role}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
};

export default ListFreelancer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    margin: 5,

    borderColor: "#FFC88d",
    borderWidth: 1,
    backgroundColor: "#ffffff",
    borderBottomColor: "trasparent",
    borderRadius: 5,
  },
  textContainer: {
    fontSize: 26,
    marginLeft: 10,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  idText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  nameText: {
    fontSize: 20,
  },
  roleText: {
    fontSize: 18,
    color: "#666",
  },
});
