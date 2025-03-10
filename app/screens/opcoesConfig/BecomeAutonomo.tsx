import React, { useEffect, useRef, useState } from "react";
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
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import InputField from "../../components/InputField";
import * as Animatable from "react-native-animatable";
import { UserToFreelancer } from "@/interfaces/Auth";
import Icon from "react-native-vector-icons/FontAwesome";
import { supabase } from "@/lib/supabase";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import * as ImagePicker from "expo-image-picker";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { validateCPF, validatePhone } from "../../../utils/validator";
import { uploadImage } from "../../../lib/cloudinary";
import roles from "../../../constants/roles";
import { LogBox } from "react-native";
import FixedText from "@/app/components/FixedText";

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

  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    LogBox.ignoreLogs(["VirtualizedLists should never be nested"]);
  }, []);

  // Define o schema Zod para validação
  const signUpSchema = z.object({
    description: z.string().optional(),
    cpf: z
      .string({ message: "Seu CPF é obrigatório" })
      .refine((value) => validateCPF(value), {
        message: "CPF inválido",
      }),
    phoneNumber: z
      .string({ message: "Seu número de telefone é obrigatório" })
      .refine((value) => validatePhone(value), {
        message: "Número de telefone inválido",
      }),
    birthDate: z
      .string({ message: "Sua data de nascimento é obrigatória" })
      .refine(
        (value) => dayjs().diff(dayjs(value, "DD/MM/YYYY"), "year") >= 18,
        { message: "Você deve ter pelo menos 18 anos" }
      ),
    profilePhoto: z.string().optional(),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<UserToFreelancer>({
    resolver: zodResolver(signUpSchema),
  });

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

  const handleOpenModal = () => {
    setIsOpen(true);
    setPreSelectedRoles([...selectedRoles]);
  };

  const handleConfirmRoles = () => {
    setIsOpen(false);

    setSelectedRoles([...preSelectedRoles]);
  };

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

  const handleSignUp = async (data: UserToFreelancer) => {
    setLoading(true);

    if (selectedRoles.length < 1) {
      setLoading(false);
      return;
    }

    data.birthDate = data.birthDate.split("/").reverse().join("-");

    const fullData = {
      ...data,
      roles: selectedRoles,
    };
    console.log(fullData);

    const { data: supabaseData, error: authError } =
      await supabase.auth.getUser();

    if (authError || !supabaseData.user) {
      throw new Error("Failed to get user from Supabase Auth");
    }

    const userId = supabaseData.user.id;

    // Update the user's profile to mark as a freelancer
    const { error: updateError } = await supabase
      .from("profiles")
      .update({ is_freelancer: true })
      .match({ id: userId });

    if (updateError) {
      setLoading(false);
      console.error("Error during update:", updateError.message);
      return Alert.alert(
        "Erro ao atualizar banco de dados.",
        "Tente novamente mais tarde."
      );
    }

    // Insert a new row into the freelancers table
    const { error: insertError } = await supabase.from("freelancers").insert([
      {
        user_id: userId,
        cpf: fullData.cpf,
        phone_number: fullData.phoneNumber,
        birthdate: fullData.birthDate,
        profile_picture_url: data.profilePhoto
          ? `https://res.cloudinary.com/dwngturuh/image/upload/profile_pictures/${userId}.jpg`
          : null,
        roles: fullData.roles,
        description: fullData.description,
      },
    ]);

    if (insertError) {
      setLoading(false);
      console.error("Error during sign up:", insertError.message);
      return Alert.alert(
        "Erro ao cadastrar.",
        "Já existe um prestador com este CPF ou E-mail."
      );
    }

    // Success! Optionally handle success state here
    console.log("Freelancer registration successful");
    Alert.alert(
      "Sucesso!",
      "Perfil de prestador cadastrado com sucesso! Faça login novamente para acessar a interface do prestador."
    );

    if (data.profilePhoto && supabaseData.user) {
      await uploadImage(data.profilePhoto, supabaseData.user.id);
    }

    setLoading(false);
    await supabase.auth.signOut({ scope: "local" });
  };

  const roleModal = (
    <Modal
      visible={isOpen}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setIsOpen(false)}
    >
      <TouchableWithoutFeedback onPress={() => setIsOpen(false)}>
        <View style={styles.modalBackground}>
          {/* Inner TouchableWithoutFeedback prevents the modal from closing when interacting  */}
          <TouchableWithoutFeedback>
            <Animatable.View
              animation="slideInUp"
              duration={400}
              style={styles.modalContainer}
            >
              <View style={styles.searchInputContainer}>
                <TextInput
                  ref={inputRef}
                  style={styles.modalSearchBar}
                  placeholder="Buscar Função"
                  placeholderTextColor="#FFF"
                  value={searchText}
                  onChangeText={handleSearch}
                />

                <TouchableOpacity
                  onPress={() => {
                    if (inputRef.current) {
                      inputRef.current.focus();
                    }
                  }}
                >
                  <Icon
                    name="search"
                    size={20}
                    color="#FFF"
                    style={styles.searchIcon}
                  />
                </TouchableOpacity>
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
                <Text style={styles.confirmButtonText}>Confirmar</Text>
              </TouchableOpacity>
            </Animatable.View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={30}
        style={{ flex: 1 }}
      >
        <ScrollView>
          <>
            {/* Description Input */}
            <Controller
              control={control}
              name="description"
              render={({ field: { onChange, value } }) => (
                <InputField
                  label="Descrição dos seus serviços (Opcional)"
                  value={value}
                  onChangeText={onChange}
                  keyboardType="default"
                  errorMessage={errors.description?.message}
                />
              )}
            />

            {/* Role Input */}
            <SafeAreaView style={{ marginBottom: 20 }}>
              <FlatList
                ListHeaderComponent={
                  <TouchableOpacity
                    onPress={handleOpenModal}
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
                    <FixedText style={styles.uploadButtonText}>
                      Selecione seus serviços
                    </FixedText>
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
      </KeyboardAvoidingView>
    </SafeAreaView>
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
