import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';

export default function HomeScreen() {
  const [selectedValue, setSelectedValue] = useState("item1");
  return (
    <View style={styles.container}>
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor: '#FFF',
  },
  pickerContainer: {
    alignSelf: 'flex-end', // Alinhar à direita
  },
  picker: {
    height: 50,
    width: 150,
  },
});
