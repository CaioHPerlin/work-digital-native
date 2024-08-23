import { Picker } from "@react-native-picker/picker";
import * as React from "react";
import { View, StyleSheet } from "react-native";
import { ActivityIndicator, Text, TextInput } from "react-native-paper";

interface PickerFieldProps {
  label: string;
  selectedValue: string;
  onValueChange: (value: string) => void;
  data: LocationData[];
  enabled?: boolean;
  loading?: boolean;
}

interface LocationData {
  id: string;
  nome: string;
  sigla?: string;
}

const PickerField: React.FC<PickerFieldProps> = ({
  label,
  selectedValue,
  onValueChange,
  data,
  enabled = true,
  loading = false,
}) => (
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
        <Picker.Item label={`Selecione um ${label.toLowerCase()}`} value="" />
        {data.map((item: LocationData) => (
          <Picker.Item
            key={item.id}
            label={item.nome}
            value={item.sigla || item.nome}
          />
        ))}
      </Picker>
    )}
  </View>
);

export default PickerField;

const styles = StyleSheet.create({
  inputGroup: {
    marginBottom: 10,
    width: "100%",
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: "bold",
  },
  input: {
    borderColor: "black",
    borderWidth: 1,
    marginBottom: 10,
    color: "#000000",
    borderRadius: 5,
  },
  picker: {
    borderColor: "black",
    borderWidth: 1,
    marginBottom: 10,
    color: "#000000",
    borderRadius: 5,
  },
});
