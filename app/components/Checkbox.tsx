import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import FixedText from "./FixedText";

interface CheckboxProps {
  label: string;
  isChecked: boolean;
  onChange: (newValue: boolean) => void;
}

const Checkbox: React.FC<CheckboxProps> = ({ label, isChecked, onChange }) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onChange(!isChecked)}
      activeOpacity={0.7}
    >
      <View style={[styles.checkbox, isChecked && styles.checked]}>
        {isChecked && <Ionicons name="checkmark" size={16} color="white" />}
      </View>
      <FixedText style={styles.label}>{label}</FixedText>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderRadius: 4,
    borderColor: "#007bff",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  checked: {
    backgroundColor: "#007bff",
  },
  label: {
    fontSize: 16,
    color: "#333",
  },
});

export default Checkbox;
