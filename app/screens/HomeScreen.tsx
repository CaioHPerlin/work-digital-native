import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import ListFreelancer from '../components/ListFreelancer'

export default function HomeScreen() {
  const [selectedValue, setSelectedValue] = useState("item1");
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.nomeMarca}>nome marca</Text>
        <View style={styles.pickerContainer}>
          <Text>TIPOS DE SERVIÇO</Text>
          <Picker
            selectedValue={selectedValue}
            style={styles.picker}
            onValueChange={(itemValue) => setSelectedValue(itemValue)}
          >
            <Picker.Item label="Item 1" value="item1" />
            <Picker.Item label="Item 2" value="item2" />
            <Picker.Item label="Item 3" value="item3" />
            <Picker.Item label="Item 4" value="item4" />
            <Picker.Item label="Item 5" value="item5" />
            <Picker.Item label="Item 6" value="item6" />
          </Picker>
        </View>
      </View>
      <ListFreelancer/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 2,
    padding: 20,
    backgroundColor: '#FFF',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    
    marginBottom: 20,
    justifyContent: 'space-between',
  },
  nomeMarca: {
    fontSize: 25,
    textTransform:'uppercase',
    fontWeight: 'bold',
  },
  pickerContainer: {
    alignItems: 'center',
  },
  picker: {
    height: 50,
    width: 150,
  },
});
