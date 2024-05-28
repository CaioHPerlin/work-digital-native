import React from 'react';
import { Card, Title } from 'react-native-paper';
import { Image, StyleSheet } from 'react-native';

const ItemChurras: React.FC = () => (
  <Card style={styles.card}>
    <Card.Content style={styles.cardContent}>
      <Image
        source={{ uri: 'https://via.placeholder.com/150' }} // substitua pelo URL da sua imagem
        style={styles.image}
      />
      <Title>joaozinho</Title>
    </Card.Content>
  </Card>
);

const styles = StyleSheet.create({
  card: {
    width: '90%',
    marginBottom: 10,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
});

export default ItemChurras;
