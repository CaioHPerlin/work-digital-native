import * as React from "react";
import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { supabase } from "../../lib/supabase";
import LinkedCity from "../components/LinkedCity";
import LinkedState from "../components/LinkedState";
import { SafeAreaView } from "react-native-safe-area-context";

type ChangeCityProps = {
  navigation: any;
  userId: string;
};

export default function ChangeCity({ navigation, userId }: ChangeCityProps) {
  const [loading, setLoading] = useState(false);
  const [estado, setEstado] = useState<string>("");
  const [cidade, setCidade] = useState<string>("");

  const [fetchingStates, setFetchingStates] = useState(true);

  useEffect(() => {
    // Fetch user profile on component mount
    const fetchUserProfile = async () => {
      try {
        const { data, error } = await supabase
          .from("profiles") // Adjust table name if needed
          .select("*")
          .eq("id", userId) // Replace with actual user ID
          .single();

        if (error) {
          console.error("Error fetching user profile:", error);
          return;
        }

        setEstado(data.state);
        setCidade(data.city);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
  }, []);

  const updateUserProfile = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("profiles") // Adjust table name if needed
        .update({
          state: estado,
          city: cidade,
        })
        .eq("id", userId); // Replace with actual user ID

      if (error) {
        console.error("Error updating user profile:", error);
        Alert.alert(
          "Erro",
          "Ocorreu um erro ao tentar atualizar o perfil do usuário."
        );
        return;
      }

      Alert.alert("Sucesso", "Cidade e estado atualizados com sucesso.");
      navigation.goBack();
    } catch (error) {
      console.error("Error updating user profile:", error);
      Alert.alert(
        "Erro",
        "Ocorreu um erro ao tentar atualizar o perfil do usuário."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  const handleChangeCity = () => {
    if (estado && cidade) {
      updateUserProfile();
    } else {
      Alert.alert("Selecione seu estado e cidade.");
    }
  };

  return (
    <>
      <SafeAreaView style={styles.container}>
        <ScrollView>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Estado</Text>
            <LinkedState
              state={estado}
              setState={setEstado}
              onLoad={() => setFetchingStates(false)}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Cidade</Text>
            <LinkedCity
              state={estado}
              city={cidade}
              setCity={setCidade}
              fetchingStates={fetchingStates}
            />
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={handleCancel}>
              <Text style={styles.buttonText}>Voltar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleChangeCity}>
              <Text style={styles.buttonText}>
                {loading ? "Alterando..." : "Alterar Cidade"}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    color: "#2d47f0",
    fontSize: 28,
    marginBottom: 20,
    textAlign: "center",
    fontFamily: "TitanOne-Regular",
    margin: 2,
  },
  inputGroup: {
    marginBottom: 10,
    width: "100%",
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: "bold",
  },
  picker: {
    backgroundColor: "#fffefd",
    borderColor: "#FFC88d",
    borderWidth: 1,
    marginBottom: 10,
    height: 50,
    width: "100%",
    justifyContent: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    width: "100%",
  },
  button: {
    backgroundColor: "#2d47f0",
    padding: 18,
    borderRadius: 5,
    alignItems: "center",
    flex: 1,
    marginHorizontal: 5,
    borderWidth: 2,
    borderColor: "#f27e26",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
