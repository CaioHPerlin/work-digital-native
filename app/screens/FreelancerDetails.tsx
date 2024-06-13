import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const FreelancerDetails = () => {
  const freelancer = {
    name: 'João Silva',
    role: 'Desenvolvedor Web',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS3LNtU9Vm-wzMbyN6YvwfxsmukZhcKlE5YEQ&s',
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: freelancer.image }} style={styles.image} />
      <Text style={styles.nameText}>{freelancer.name}</Text>
      <Text style={styles.roleText}>{freelancer.role}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
  },
  nameText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  roleText: {
    fontSize: 18,
    color: '#666',
  },
});

export default FreelancerDetails;