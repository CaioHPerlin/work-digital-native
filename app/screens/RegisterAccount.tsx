import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import axios from "axios";
import InputField from "../components/InputField";
import PickerField from "../components/PickerField";
import Checkbox from "../components/Checkbox";
import { SignUpFreelancer } from "@/interfaces/Auth";
import Location from "@/interfaces/Location";
import { supabase } from "@/lib/supabase";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import * as ImagePicker from "expo-image-picker";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { validateCPF, validatePhone } from "../../utils/validator";
import { uploadImage } from "../../lib/cloudinary";

dayjs.extend(customParseFormat);

interface Props {
  navigation: any;
}

// Define o schema Zod para validação
const signUpSchema = z.object({
  name: z.string().min(3, { message: "Nome deve ter pelo menos 3 caracteres" }),
  email: z.string().email("Formato de e-mail inválido"),
  password: z
    .string()
    .min(6, { message: "Senha deve ter pelo menos 6 caracteres" }),
  state: z.string().min(1, { message: "Estado é obrigatório" }),
  city: z.string().min(1, { message: "Cidade é obrigatória" }),
  isFreelancer: z.boolean(),
  cpf: z
    .string()
    .optional()
    .refine((value) => (value ? validateCPF(value) : false), {
      message: "CPF inválido",
    }),
  phoneNumber: z
    .string()
    .optional()
    .refine((value) => (value ? validatePhone(value) : false), {
      message: "Número de telefone inválido",
    }),
  birthDate: z
    .string()
    .optional()
    .refine(
      (value) => {
        const age = dayjs().diff(dayjs(value, "DD/MM/YYYY"), "year");
        return age >= 18;
      },
      { message: "Você deve ter pelo menos 18 anos" }
    ),
  profilePhoto: z.string().optional(),
});

const RegisterAccount: React.FC<Props> = ({ navigation }) => {
  const [states, setStates] = useState<Location[]>([]);
  const [cities, setCities] = useState<Location[]>([]);
  const [loadingStates, setLoadingStates] = useState<boolean>(true);
  const [loadingCities, setLoadingCities] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<SignUpFreelancer>({
    resolver: zodResolver(signUpSchema),
  });

  const stateValue = watch("state");
  const isFreelancer = watch("isFreelancer");

  // Buscar estados ao montar o componente
  useEffect(() => {
    const fetchStates = async () => {
      try {
        const response = await axios.get(
          "https://servicodados.ibge.gov.br/api/v1/localidades/estados"
        );
        setStates(
          response.data.sort((a: any, b: any) => a.nome.localeCompare(b.nome))
        );
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingStates(false);
      }
    };

    fetchStates();
  }, []);

  // Buscar cidades quando o estado for selecionado
  useEffect(() => {
    if (stateValue) {
      setLoadingCities(true);
      const fetchCities = async () => {
        try {
          const response = await axios.get(
            `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${stateValue}/municipios`
          );
          setCities(
            response.data.sort((a: any, b: any) => a.nome.localeCompare(b.nome))
          );
        } catch (error) {
          console.error(error);
        } finally {
          setLoadingCities(false);
        }
      };

      fetchCities();
    }
  }, [stateValue]);

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setValue("profilePhoto", result.assets[0].uri);
    }
  };

  const handleSignUp = async (data: SignUpFreelancer) => {
    setLoading(true);

    data.birthDate = data.birthDate.split("/").reverse().join("-");

    const { data: supabaseData, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          name: data.name,
          email: data.email,
          state: data.state,
          city: data.city,
          is_freelancer: data.isFreelancer,
          cpf: data.isFreelancer ? data.cpf : undefined,
          phone_number: data.isFreelancer ? data.phoneNumber : undefined,
          birth_date: data.isFreelancer ? data.birthDate : undefined,
          profile_photo: data.isFreelancer ? data.profilePhoto : undefined,
        },
      },
    });

    if (error) {
      setLoading(false);
      return Alert.alert(
        "Erro ao cadastrar.",
        "Já existe um usuário com este CPF ou E-mail."
      );
    }

    Alert.alert(
      "Cadastro bem-sucedido",
      `Sua conta foi cadastrada com sucesso!`
    );

    if (data.isFreelancer && data.profilePhoto && supabaseData.user) {
      await uploadImage(data.profilePhoto, supabaseData.user.id);
    }

    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <Text style={styles.title}>Cadastro</Text>

        {/* Full Name Input */}
        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, value } }) => (
            <InputField
              label="Nome Completo"
              value={value}
              onChangeText={onChange}
              autoCapitalize="words"
              keyboardType="default"
              errorMessage={errors.name?.message}
            />
          )}
        />

        {/* Email Input */}
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, value } }) => (
            <InputField
              label="E-mail"
              value={value}
              onChangeText={onChange}
              autoCapitalize="none"
              keyboardType="email-address"
              errorMessage={errors.email?.message}
            />
          )}
        />

        {/* Password Input */}
        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, value } }) => (
            <InputField
              label="Senha"
              value={value}
              onChangeText={onChange}
              secureTextEntry
              autoCapitalize="none"
              errorMessage={errors.password?.message}
            />
          )}
        />

        {/* State Picker */}
        <Controller
          control={control}
          name="state"
          render={({ field: { onChange, value } }) => (
            <PickerField
              label="Estado"
              selectedValue={value}
              onValueChange={onChange}
              data={states}
              loading={loadingStates}
              errorMessage={errors.state?.message}
            />
          )}
        />

        {/* City Picker */}
        <Controller
          control={control}
          name="city"
          render={({ field: { onChange, value } }) => (
            <PickerField
              label="Cidade"
              selectedValue={value}
              onValueChange={onChange}
              data={cities}
              loading={loadingCities}
              enabled={!!stateValue}
              errorMessage={errors.city?.message}
            />
          )}
        />

        {/* Checkbox Sou prestador de serviços */}
        <Controller
          control={control}
          name="isFreelancer"
          defaultValue={false}
          render={({ field: { onChange, value } }) => (
            <Checkbox
              label="Sou prestador de serviços"
              isChecked={value}
              onChange={onChange}
            />
          )}
        />

        {isFreelancer && (
          <>
            {/* CPF Input */}
            <Controller
              control={control}
              name="cpf"
              render={({ field: { onChange, value } }) => (
                <InputField
                  label="CPF"
                  value={value}
                  onChangeText={onChange}
                  keyboardType="numeric"
                  errorMessage={errors.cpf?.message}
                  mask="cpf"
                  maxLength={14}
                />
              )}
            />

            {/* Phone Number Input */}
            <Controller
              control={control}
              name="phoneNumber"
              render={({ field: { onChange, value } }) => (
                <InputField
                  label="Número de Telefone"
                  value={value}
                  onChangeText={onChange}
                  keyboardType="phone-pad"
                  errorMessage={errors.phoneNumber?.message}
                  mask="phone"
                  maxLength={15}
                />
              )}
            />

            {/* Birth Date Input */}
            <Controller
              control={control}
              name="birthDate"
              render={({ field: { onChange, value } }) => (
                <InputField
                  label="Data de Nascimento"
                  value={value}
                  onChangeText={onChange}
                  keyboardType="numeric"
                  errorMessage={errors.birthDate?.message}
                  mask="date"
                  maxLength={10}
                />
              )}
            />

            {/* Profile Photo Upload */}
            <TouchableOpacity
              onPress={handlePickImage}
              style={styles.uploadButton}
            >
              <Text style={styles.uploadButtonText}>
                {watch("profilePhoto")
                  ? "Alterar Foto de Perfil"
                  : "Adicionar Foto de Perfil"}
              </Text>
            </TouchableOpacity>
          </>
        )}

        {/* Submit Button */}
        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmit(handleSignUp)}
          disabled={loading}
        >
          <Text style={styles.submitButtonText}>
            {loading ? "Cadastrando..." : "Cadastrar"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 30,
  },
  submitButton: {
    backgroundColor: "#6200ee",
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: 20,
    marginBottom: 10,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  uploadButton: {
    backgroundColor: "#6200ee",
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: 20,
    alignItems: "center",
  },
  uploadButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default RegisterAccount;
