import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TextInput } from "react-native-paper";
import axios from "axios";
import * as Animatable from "react-native-animatable";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";


SplashScreen.preventAutoHideAsync();

interface Props {
  navigation: any;
}

const Login: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState<string>("");
  const [senha, setSenha] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [loaded, error] = useFonts({
    "TitanOne-Regular": require("../../assets/fonts/TitanOne-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        "https://app-api-pied.vercel.app/users/auth",
        {
          email: email,
          password: senha,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data.token) {
        await AsyncStorage.setItem("cpf", response.data.user.cpf);
        navigation.navigate("Sidebar");
      }
    } catch (error) {
      alert("Verifique suas informações de login.");
      console.error("Error logging in:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Animatable.Text
          animation="bounce"
          iterationCount="infinite"
          style={styles.loadingText}
        >
          Carregando...
        </Animatable.Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.inlineText}>
        <Animatable.Text
          animation="bounce"
          delay={500}
          style={styles.title}
        >
          Bem
        </Animatable.Text>

        <Animatable.Text
          animation="bounce"
          delay={1000}
          style={styles.titleSubR}
        >
          v
        </Animatable.Text>
        <Animatable.Text
          animation="bounce"
          delay={3500}
          style={styles.title}
        >
          <Text style={styles.colorEspecific}>i</Text>
        </Animatable.Text>
        <Animatable.Text
          animation="bounce"
          delay={1000}
          style={styles.titleSub}
        >
          ndo
        </Animatable.Text>

        <Animatable.Text
          animation="bounce"
          delay={1500}
          style={styles.title}
        >
          ao
        </Animatable.Text>
        <Animatable.Text
          animation="bounce"
          delay={2000}
          style={styles.title}
        >
          1
        </Animatable.Text>
        <Animatable.Text
          animation="bounce"
          delay={2500}
          style={styles.title}
        >
          <Text style={styles.colorEspecific}>2</Text>
        </Animatable.Text>
        <Animatable.Text
          animation="bounce"
          delay={3000}
          style={styles.title}
        >
          PUL
          <Text style={styles.colorEspecific}>O</Text>
        </Animatable.Text>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          label="Email"
          value={email}
          onChangeText={(text) => setEmail(text)}
          keyboardType="email-address"
          style={styles.input}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Senha</Text>
        <TextInput
          label="Senha"
          value={senha}
          onChangeText={(text) => setSenha(text)}
          secureTextEntry
          style={styles.input}
        />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>ENTRAR</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("RegisterAccount")}>
          <Text style={styles.buttonText}>CADASTRAR</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.esqueciSenha}>Esqueci a Senha</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    color: "#2d47f0",
    fontSize: 30,
    marginBottom: 20,
    textAlign: "center",
    fontFamily: "TitanOne-Regular",
    margin: 2,
  },
  titleSub: {
    color: "#2d47f0",
    fontSize: 30,
    marginBottom: 20,
    textAlign: "center",
    fontFamily: "TitanOne-Regular",
    margin: 2,
    marginLeft:0,
    marginRight:0
  },
  titleSubR: {
    color: "#2d47f0",
    fontSize: 30,
    marginBottom: 20,
    textAlign: "center",
    fontFamily: "TitanOne-Regular",
    margin: 2,
    marginRight:0
  },
  colorEspecific: {
    color: "#f27e26",
  },
  animationTitle: {
    marginTop: 10,
    marginBottom: 20,
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
  inlineText: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  input: {
    borderColor: "black",
    borderWidth: 1,
    marginBottom: 10,
    color: "#000000",
    borderRadius: 5,
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
  esqueciSenha: {
    color: "#2d47f0",
    fontSize: 16,
    textAlign: "center",
    marginTop: 15,
    textTransform: "capitalize",
    fontWeight: "500",
  },
  loadingText: {
    fontSize: 34,
    color: "#feb96f",
  },
});

export default Login;
