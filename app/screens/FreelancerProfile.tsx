import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Alert,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  Modal,
  TouchableWithoutFeedback,
  FlatList,
  TextInput,
  SafeAreaView,
} from "react-native";
import { supabase } from "../../lib/supabase";
import { FlattenedProfile, HighlightImage } from "../types"; // Adjust the path as needed
import * as ImagePicker from "expo-image-picker";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import InputField from "../components/InputField";
import { validatePhone } from "../../utils/validator";
import * as Animatable from "react-native-animatable";
import roles from "../../constants/roles";
import Icon from "react-native-vector-icons/FontAwesome";
import ImageWithFallback from "../components/ImageWithFallback";
import { LogBox } from "react-native";
import { uploadImage } from "../../lib/cloudinary";

interface UpdateFreelancer {
  name: string;
  description?: string;
  phoneNumber: string;
  profilePhoto?: string;
  roles: string[];
}

const profileSchema = z.object({
  name: z.string().min(1, { message: "Nome é obrigatório" }),
  description: z.string().optional(),
  phoneNumber: z
    .string()
    .min(10, { message: "Número de telefone inválido" })
    .refine(validatePhone, { message: "Telefone inválido" }),
  roles: z
    .array(z.string())
    .min(1, { message: "Selecione ao menos uma função" }),
});

const FreelancerProfile: React.FC<{ userId: string }> = ({ userId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [searchText, setSearchText] = useState<string>("");

  const [freelancer, setFreelancer] = useState<FlattenedProfile>();
  const [loading, setLoading] = useState<boolean>(false);
  const [initLoading, setInitLoading] = useState<boolean>(false);
  const [imageUri, setImageUri] = useState<string | null>(null);

  const [highlightImages, setHighlightImages] = useState<HighlightImage[]>([]);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<UpdateFreelancer>({
    resolver: zodResolver(profileSchema),
  });

  const handleSearch = (text: string) => {
    setSearchText(text);
  };

  const filteredRoles = roles
    .sort()
    .filter((service) =>
      service.toLowerCase().startsWith(searchText.toLowerCase())
    );

  const handleRoleSelect = (role: string) => {
    if (selectedRoles.includes(role)) {
      setSelectedRoles(selectedRoles.filter((r) => r !== role));
    } else {
      setSelectedRoles([...selectedRoles, role]);
    }
  };

  const handleRoleRemove = (role: string) => {
    if (selectedRoles.includes(role)) {
      const newArray = selectedRoles.filter((item) => item !== role);
      setSelectedRoles(newArray);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!userId) return;

      setInitLoading(true);
      try {
        // Fetch profile and highlights data
        const { data, error } = await supabase
          .from("profiles")
          .select(
            `
              id,
              email,
              name,
              state,
              city,
              freelancers:freelancers!inner(
                cpf,
                phone_number,
                birthdate,
                profile_picture_url,
                roles,
                description
              ),
              highlights:highlights!left(
                role,
                images
              )
            `
          )
          .eq("id", userId);

        if (error) {
          throw new Error(error.message);
        }

        const profileData = data[0];

        if (!profileData) {
          Alert.alert(
            "Ocorreu um erro",
            "Falha ao encontrar registro do usuário. Tente novamente mais tarde"
          );
          return;
        }

        const { freelancers, highlights, ...rest } = profileData;

        if (!freelancers) {
          Alert.alert(
            "Ocorreu um erro",
            "Não foi possível encontrar informações do freelancer."
          );
          return;
        }

        const flattenedData = {
          ...rest,
          ...freelancers,
          highlights: highlights || [], // Ensure highlights is always an array
        };

        // Set the profile and freelancer data
        setFreelancer(flattenedData);

        // Set form values
        setValue("name", flattenedData.name);
        setValue("description", flattenedData.description || undefined);
        setValue("phoneNumber", flattenedData.phone_number);
        setValue("profilePhoto", flattenedData.profile_picture_url);
        setValue("roles", flattenedData.roles || []);
        setSelectedRoles(flattenedData.roles);
        setImageUri(flattenedData.profile_picture_url);

        // Set highlights data
        setHighlightImages(flattenedData.highlights);
      } catch (error) {
        console.error("Error fetching data:", error);
        Alert.alert(
          "Erro ao buscar dados",
          "Não foi possível buscar os dados do usuário."
        );
      } finally {
        await setTimeout(() => setInitLoading(false), 300);
      }
    };

    fetchData();
  }, [userId, setValue, setFreelancer, setImageUri, setHighlightImages]);

  useEffect(() => {
    LogBox.ignoreLogs(["VirtualizedLists should never be nested"]);
  }, []);

  const handleHighlightUpload = async (role: string) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [9, 16],
      quality: 1,
    });

    if (!result.canceled && result.assets[0]?.uri) {
      setHighlightImages((prev) => {
        // Find the index of the role in the current state
        const index = prev.findIndex((item) => item.role === role);

        // Update or add the role's image list
        if (index !== -1) {
          // Role exists, update the existing entry
          const updatedHighlightImages = [...prev];
          updatedHighlightImages[index] = {
            ...updatedHighlightImages[index],
            images: [
              ...updatedHighlightImages[index].images,
              result.assets[0].uri,
            ],
          };
          return updatedHighlightImages;
        } else {
          // Role does not exist, add a new entry
          return [...prev, { role, images: [result.assets[0].uri] }];
        }
      });
    }
  };

  const handleHighlightRemove = (role: string, index: number) => {
    setHighlightImages((prev) => {
      const updatedHighlightImages = prev.map((item) => {
        if (item.role === role) {
          return {
            ...item,
            images: item.images.filter((_, imgIndex) => imgIndex !== index),
          };
        }
        return item;
      });
      return updatedHighlightImages;
    });
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
      setImageUri(result.assets[0].uri);
    }
  };

  const handleUpdateProfile = async (data: any) => {
    setInitLoading(true);
    console.log(highlightImages);

    try {
      console.log(data.profilePhoto);
      if (imageUri && freelancer) {
        await uploadImage(imageUri, userId);
      }

      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          name: data.name,
          state: data.state,
          city: data.city,
          email: data.email,
        })
        .eq("id", userId);

      if (profileError) throw profileError;

      const { data: freelancerData, error: freelancerError } = await supabase
        .from("freelancers")
        .update({
          phone_number: data.phoneNumber,
          profile_picture_url: imageUri
            ? `https://res.cloudinary.com/dwngturuh/image/upload/profile_pictures/${userId}.jpg`
            : undefined,
          roles: selectedRoles,
          description: data.description,
        })
        .eq("user_id", userId);

      if (freelancerError) throw freelancerError;

      // Prepare highlights for upsert
      const highlightsToUpsert = await Promise.all(
        highlightImages.map(async (highlight) => {
          const uploadedImages: string[] = await Promise.all(
            highlight.images.map(async (uri, index) => {
              const result = await uploadImage(
                uri,
                `highlights/${userId}_${Date.now()}_${index}`
              );
              return result?.secure_url; // Adjust this if necessary
            })
          );

          return {
            user_id: userId,
            role: highlight.role,
            images: uploadedImages,
          };
        })
      );

      // Upsert highlights
      const { error: highlightError } = await supabase
        .from("highlights")
        .upsert(highlightsToUpsert, {
          onConflict: ["user_id", "role"], // Specify conflict columns
        });

      if (highlightError) throw highlightError;

      Alert.alert("Perfil atualizado com sucesso!");
    } catch (error) {
      console.error(error);
      Alert.alert("Erro ao atualizar perfil", (error as Error).message);
    } finally {
      setInitLoading(false);
    }
  };

  if (initLoading) {
    return (
      <View style={styles.centerContainer}>
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
                    selectedRoles.includes(item) && {
                      backgroundColor: "#6200ee",
                    },
                  ]}
                  onPress={() =>
                    item.length > 1 ? handleRoleSelect(item) : ""
                  }
                >
                  <Text
                    style={
                      selectedRoles.includes(item)
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
          </Animatable.View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );

  return (
    <ScrollView style={styles.container}>
      <ImageWithFallback
        cache={false}
        imageUrl={imageUri}
        style={styles.profileImage}
      />

      <TouchableOpacity onPress={handlePickImage} style={styles.uploadButton}>
        <Text style={styles.uploadButtonText}>Alterar Foto de Perfil</Text>
      </TouchableOpacity>

      <Controller
        control={control}
        name="name"
        render={({ field: { onChange, value } }) => (
          <InputField
            label="Nome Completo"
            value={value}
            onChangeText={onChange}
            errorMessage={errors.name?.message as string}
          />
        )}
      />

      <Controller
        control={control}
        name="description"
        render={({ field: { onChange, value } }) => (
          <InputField
            label="Descrição"
            value={value}
            onChangeText={onChange}
            errorMessage={errors.description?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="phoneNumber"
        render={({ field: { onChange, value } }) => (
          <InputField
            label="Número de Telefone"
            value={value}
            onChangeText={onChange}
            keyboardType="phone-pad"
            errorMessage={errors.phoneNumber?.message as string}
          />
        )}
      />

      <>
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
                        marginBottom: 0,
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
                onPress={() => handleRoleRemove(item.item)}
                style={styles.roleContainer}
              >
                <Text>{item.item}</Text>
              </TouchableOpacity>
            )}
          />

          {selectedRoles.length < 1 && (
            <Text style={styles.errorText}>
              Você deve selecionar ao menos 1 função
            </Text>
          )}
        </SafeAreaView>
        {roleModal}
      </>

      <Text style={styles.title}>Adicionar Destaques</Text>
      {selectedRoles.map((role) => (
        <View key={role} style={styles.roleContainerX}>
          <TouchableOpacity
            onPress={() => handleHighlightUpload(role)}
            style={{
              flexDirection: "row",
              gap: 10,
              alignItems: "center",
            }}
          >
            <Icon
              name="plus"
              size={20}
              color="#FFF"
              style={{
                padding: 10,
                backgroundColor: "#6200ee",
                maxWidth: 45,
                borderRadius: 10,
              }}
            />
            <Text style={styles.roleTitle}>{role}</Text>
          </TouchableOpacity>
          <ScrollView horizontal style={styles.imageScrollView}>
            {highlightImages
              .find((item) => item.role === role)
              ?.images.map((uri, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleHighlightRemove(role, index)}
                >
                  <Image source={{ uri }} style={styles.image} />
                </TouchableOpacity>
              ))}
          </ScrollView>
        </View>
      ))}

      <TouchableOpacity
        style={styles.submitButton}
        onPress={handleSubmit(handleUpdateProfile)}
        disabled={loading}
      >
        <Text style={styles.submitButtonText}>
          {loading ? "Atualizando..." : "Atualizar Perfil"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  profileImage: {
    margin: 10,
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: "center",
    marginBottom: 20,
  },
  uploadButton: {
    backgroundColor: "#6200ee",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  uploadButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: "#6200ee",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
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
    backgroundColor: "#fff",
    borderColor: "#6200ee",
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
  roleContainerX: {
    marginBottom: 20,
  },
  roleTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  imageScrollView: {
    flexDirection: "row",
    marginTop: 10,
  },
  image: {
    width: 100,
    height: 100,
    marginRight: 10,
  },
  loadingText: {
    fontSize: 34,
    color: "#feb96f",
  },
});

export default FreelancerProfile;
