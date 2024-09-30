import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Modal,
  TouchableWithoutFeedback,
  FlatList,
  TextInput,
  SafeAreaView,
} from "react-native";
import InputField from "../components/InputField";
import Checkbox from "../components/Checkbox";
import * as Animatable from "react-native-animatable";
import { SignUpFreelancer } from "@/interfaces/Auth";
import Icon from "react-native-vector-icons/FontAwesome";
import { supabase } from "@/lib/supabase";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import * as ImagePicker from "expo-image-picker";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { validateCPF, validatePhone } from "../../utils/validator";
import { uploadImage } from "../../lib/cloudinary";
import roles from "../../constants/roles";
import { LogBox } from "react-native";
import LinkedState from "../components/LinkedState";
import LinkedCity from "../components/LinkedCity";

dayjs.extend(customParseFormat);

interface Props {
  navigation: any;
}

const RegisterAccount: React.FC<Props> = ({ navigation }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [preSelectedRoles, setPreSelectedRoles] = useState<string[]>([]);
  const [searchText, setSearchText] = useState<string>("");
  const [loading, setLoading] = useState(false);

  let isFreelancer = false;
  // Define o schema Zod para validação
  const signUpSchema = z
    .object({
      name: z
        .string({ message: "Por favor, insira seu nome completo" })
        .min(3, { message: "Nome deve ter pelo menos 3 caracteres" }),
      email: z
        .string({ message: "Por favor, insira seu endereço de e-mail" })
        .email("Formato de e-mail inválido"),
      password: z
        .string({ message: "Senha é obrigatória" })
        .min(6, { message: "Senha deve ter pelo menos 6 caracteres" }),
      confirmPassword: z
        .string({ message: "É obrigatório confirmar sua senha" })
        .min(6, { message: "Senha deve ter pelo menos 6 caracteres" }),
      state: z.string().min(1, { message: "Por favor, selecione seu estado" }),
      city: z.string().min(1, { message: "Por favor, selecione sua cidade" }),
      isFreelancer: z.boolean(),
      cpf: z
        .string()
        .optional()
        .refine(
          (value) =>
            isFreelancer ? (value ? validateCPF(value) : false) : true,
          {
            message: "CPF inválido",
          }
        ),
      phoneNumber: z
        .string()
        .optional()
        .refine(
          (value) =>
            isFreelancer ? (value ? validatePhone(value) : false) : true,
          {
            message: "Número de telefone inválido",
          }
        ),
      birthDate: z
        .string()
        .optional()
        .refine(
          (value) =>
            isFreelancer
              ? dayjs().diff(dayjs(value, "DD/MM/YYYY"), "year") >= 18
              : true,
          { message: "Você deve ter pelo menos 18 anos" }
        ),
      profilePhoto: z.string().optional(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "As senhas não coincidem.",
      path: ["confirmPassword"],
    });

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    getValues,
  } = useForm<SignUpFreelancer>({
    resolver: zodResolver(signUpSchema),
  });

  isFreelancer = watch("isFreelancer");

  useEffect(() => {
    LogBox.ignoreLogs(["VirtualizedLists should never be nested"]);
  }, []);

  const handleConfirmRoles = () => {
    setIsOpen(false);

    setSelectedRoles([...preSelectedRoles]);
  };

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

  const handleSearch = (text: string) => {
    setSearchText(text);
  };

  const filteredRoles = roles
    .sort()
    .filter((service) =>
      service.toLowerCase().startsWith(searchText.toLowerCase())
    );

  const handleRoleSelect = (role: string) => {
    if (preSelectedRoles.includes(role)) {
      setPreSelectedRoles(preSelectedRoles.filter((r) => r !== role));
    } else {
      setPreSelectedRoles([...preSelectedRoles, role]);
    }
  };

  const handleSelectedRoleRemove = (role: string) => {
    if (selectedRoles.includes(role)) {
      const newArray = selectedRoles.filter((item) => item !== role);
      setSelectedRoles(newArray);
    }
  };

  const handleSignUp = async (data: SignUpFreelancer) => {
    if (isFreelancer && selectedRoles.length < 1) {
      return;
    }

    setLoading(true);

    if (data.birthDate && isFreelancer) {
      data.birthDate.split("/").reverse().join("-");
    }

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
          roles: data.isFreelancer ? selectedRoles : undefined,
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

  let state = watch("state");
  let city = watch("city");

  const roleModal = (
    <Modal
      visible={isOpen}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setIsOpen(false)}
    >
      <TouchableWithoutFeedback onPress={() => setIsOpen(false)}>
        <View style={styles.modalBackground}>
          <Animatable.View
            animation="slideInUp"
            duration={400}
            style={styles.modalContainer}
          >
            <View style={styles.searchInputContainer}>
              <TextInput
                style={styles.modalSearchBar}
                placeholder="Buscar Função"
                placeholderTextColor="#FFF"
                value={searchText}
                onChangeText={handleSearch}
              />
              <Icon
                name="search"
                size={20}
                color="#FFF"
                style={styles.searchIcon}
              />
            </View>
            <FlatList
              style={{ width: "100%" }}
              data={filteredRoles}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.modalItem,
                    preSelectedRoles.includes(item) && {
                      backgroundColor: "#2d47f0",
                    },
                  ]}
                  onPress={() =>
                    item.length > 1 ? handleRoleSelect(item) : ""
                  }
                >
                  {item.length > 1 && (
                    <Icon
                      name={
                        preSelectedRoles.includes(item)
                          ? "check-square-o"
                          : "square-o"
                      }
                      style={
                        preSelectedRoles.includes(item)
                          ? { ...styles.modalItemText, color: "#FFF" }
                          : item.length > 1
                          ? styles.modalItemText
                          : { ...styles.modalItemText, color: "#f27e26" }
                      }
                    />
                  )}
                  <Text
                    style={
                      preSelectedRoles.includes(item)
                        ? { ...styles.modalItemText, color: "#FFF" }
                        : item.length > 1
                        ? styles.modalItemText
                        : { ...styles.modalItemText, color: "#f27e26" }
                    }
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              )}
            />

            <TouchableOpacity
              style={styles.confirmButton}
              onPress={handleConfirmRoles}
            >
              <Text style={styles.confirmButtonText}>Confirmar Cargos</Text>
            </TouchableOpacity>
          </Animatable.View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );

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

        <Controller
          control={control}
          name="confirmPassword"
          render={({ field: { onChange, value } }) => (
            <InputField
              label="Confirme sua Senha"
              value={value}
              onChangeText={onChange}
              secureTextEntry
              autoCapitalize="none"
              errorMessage={errors.confirmPassword?.message}
            />
          )}
        />

        {/* State Picker */}
        <LinkedState
          state={state} // Fetch the current state value
          setState={(selectedState: any) => setValue("state", selectedState)} // Update the form's 'state' field with the selected sigla
        />
        {errors.state && (
          <Text style={styles.errorText}>{errors.state.message}</Text>
        )}

        {/* City Picker */}
        <LinkedCity
          state={state}
          city={city} // Fetch the current city value
          setCity={(selectedCity: any) => setValue("city", selectedCity)} // Update the form's 'city'
        />
        {errors.city && (
          <Text style={styles.errorText}>{errors.city.message}</Text>
        )}

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
            {/* Role Input */}
            <SafeAreaView style={{ marginBottom: 20 }}>
              <FlatList
                ListHeaderComponent={
                  <TouchableOpacity
                    onPress={() => setIsOpen(true)}
                    style={
                      selectedRoles.length === 0
                        ? {
                            ...styles.uploadButton,
                            marginBottom: 10,
                          }
                        : {
                            ...styles.uploadButton,
                            borderBottomLeftRadius: 0,
                            borderBottomRightRadius: 0,
                          }
                    }
                  >
                    <Text style={styles.uploadButtonText}>
                      Selecione seus serviços
                    </Text>
                  </TouchableOpacity>
                }
                data={selectedRoles}
                renderItem={(item) => (
                  <TouchableOpacity
                    onPress={() => handleSelectedRoleRemove(item.item)}
                    style={styles.roleContainer}
                  >
                    <Text>{item.item}</Text>
                    <Icon name="close" size={16} />
                  </TouchableOpacity>
                )}
              />

              {selectedRoles.length < 1 && (
                <Text style={styles.errorText}>
                  Você deve selecionar ao menos 1 função
                </Text>
              )}
            </SafeAreaView>
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
                  : "Adicionar Foto de Perfil (Opcional)"}
              </Text>
            </TouchableOpacity>

            {roleModal}
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
    backgroundColor: "#2d47f0",
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
    backgroundColor: "#2d47f0",
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: 20,
    alignItems: "center",
  },
  uploadButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  pickerContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  searchBar: {
    height: 50,
    borderColor: "#f27e26",
    borderWidth: 2,
    paddingHorizontal: 8,
    justifyContent: "center",
    width: "100%",
    borderRadius: 5,
    backgroundColor: "#2d47f0",
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 50,
    padding: 20,
    alignItems: "center",
    elevation: 20,
    height: "80%",
    borderColor: "#f27e26",
    borderWidth: 2,
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2d47f0",
    borderRadius: 25,
    paddingHorizontal: 10,
    height: 50,
    marginBottom: 10,
    width: "100%",
  },
  searchIcon: {
    marginRight: 10,
  },
  modalSearchBar: {
    flex: 1,
    color: "#FFF",
  },
  modalItem: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "nowrap",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 6,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    width: "100%",
  },
  modalItemText: {
    fontSize: 16,
    textAlign: "justify",
  },
  noSelectionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  roleContainer: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "nowrap",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    alignContent: "center",
    backgroundColor: "#fff",
    borderColor: "#2d47f0",
    borderWidth: 1,
    borderTopWidth: 0,
    paddingVertical: 8,
    borderRadius: 10,
    borderTopEndRadius: 0,
    borderTopStartRadius: 0,
    marginTop: 0,
    alignItems: "center",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginBottom: 10,
  },
  loadingText: {
    fontSize: 34,
    color: "#feb96f",
  },
  confirmButton: {
    width: "90%",
    marginTop: 20,
    backgroundColor: "#2d47f0",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  confirmButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default RegisterAccount;
