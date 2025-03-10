import * as React from "react";
import { View, StyleSheet } from "react-native";
import { Text, TextInput } from "react-native-paper";

interface InputFieldProps {
  label: string;
  value: string | undefined;
  onChangeText: (text: string) => void;
  keyboardType?: "default" | "numeric" | "email-address" | "phone-pad";
  textContentType?: "none" | "emailAddress" | "password" | "telephoneNumber";
  autoCorrect?: boolean;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  secureTextEntry?: boolean;
  mask?: "cpf" | "date" | "phone";
  maxLength?: number;
  placeholder?: string;
  errorMessage?: string;
}

const formatCPF = (cpf: string) => {
  return cpf
    .replace(/\D/g, "")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
};

const formatDate = (date: string) => {
  return date
    .replace(/\D/g, "")
    .replace(/(\d{2})(\d)/, "$1/$2")
    .replace(/(\d{2})(\d)/, "$1/$2");
};

const formatPhoneNumber = (phone: string) => {
  const cleaned = phone.replace(/\D/g, "");
  const match = cleaned.match(/^(\d{2})(\d{4,5})(\d{4})$/);

  if (match) {
    const intlCode = match[1];
    const part1 = match[2];
    const part2 = match[3];
    return `(${intlCode}) ${part1}-${part2}`;
  }
  return phone;
};

const InputField: React.FC<InputFieldProps> = ({
  label,
  value,
  onChangeText,
  keyboardType = "default",
  textContentType = "none",
  autoCorrect = true,
  autoCapitalize = "sentences",
  secureTextEntry = false,
  mask,
  maxLength,
  placeholder,
  errorMessage,
}) => {
  const handleChange = React.useCallback(
    (text: string) => {
      if (!text) {
        onChangeText("");
        return;
      }

      let formattedText = text;

      switch (mask) {
        case "cpf":
          formattedText = formatCPF(text);
          break;
        case "date":
          formattedText = formatDate(text);
          break;
        case "phone":
          formattedText = formatPhoneNumber(text);
          break;
        default:
          formattedText = text;
          break;
      }

      onChangeText(formattedText);
    },
    [mask, onChangeText, value]
  );

  // FIX FOR EXPO SDK 52 (what a mess of a update huh expo devs)
  const _inputMode = keyboardType === "numeric" ? "numeric" : undefined;
  const _keyboardType =
    keyboardType === "numeric" ? "number-pad" : keyboardType;

  return (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        label={label}
        placeholder={placeholder}
        value={value}
        inputMode={_inputMode}
        onChangeText={handleChange}
        keyboardType={_keyboardType}
        textContentType={textContentType}
        autoCorrect={autoCorrect}
        autoCapitalize={autoCapitalize}
        secureTextEntry={secureTextEntry}
        style={styles.input}
        maxLength={maxLength}
      />
      {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}
    </View>
  );
};

export default InputField;

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
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: -8,
    marginBottom: 10,
  },
});
