import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import ListFreelancer from '../components/ListFreelancer';
import Layout from '../components/Layout';

export default function HomeScreen() {
  const [selectedValue, setSelectedValue] = useState("item1");
  const [isPickerVisible, setPickerVisible] = useState(false);

  return (
    <Layout>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.nomeMarca}>nome marca</Text>
          <TouchableOpacity 
            style={styles.filterButton} 
            onPress={() => setPickerVisible(!isPickerVisible)}
          >
            <Text style={styles.filterButtonText}>Filtrar</Text>
          </TouchableOpacity>
        </View>

        {isPickerVisible && (
          <View style={styles.pickerContainer}>
            <Text>TIPOS DE SERVIÇO</Text>
            <View>
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
        )}

        <ListFreelancer/>
      </View>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 2,
    padding: 20,
    //backgroundColor: '#FFF',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  nomeMarca: {
    fontSize: 25,
    textTransform: 'uppercase',
    fontWeight: 'bold',
  },
  filterButton: {
    backgroundColor: '#FFC88d',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  filterButtonText: {
    color: '#000',
    fontWeight: 'bold',
  },
  pickerContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  picker: {
    height: 50,
    width: 150,
  },
});

