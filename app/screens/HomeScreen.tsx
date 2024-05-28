import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import ItemChurras from '../components/ItemChurras';

const HomeScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <ItemChurras />
        <ItemChurras />
        <ItemChurras />
        <ItemChurras />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    padding: 10,
    alignItems: 'center',
  },
});

export default HomeScreen;
