import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Modal,
  TouchableWithoutFeedback,
  ActivityIndicator,
} from "react-native";
import * as Animatable from "react-native-animatable";
import ListFreelancer from "../components/ListFreelancer";
import roles from "@/constants/roles";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import Icon from "react-native-vector-icons/FontAwesome";
import { FlattenedProfile } from "../types";
import { supabase } from "../../lib/supabase";
import { useFocusEffect } from "expo-router";

SplashScreen.preventAutoHideAsync();

interface Props {
  navigation: any;
}

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const [userId, setUserId] = useState<string>("");
  const [userCity, setUserCity] = useState<string>("");
  const [userState, setUserState] = useState<string>("");
  const [selectedValue, setSelectedValue] = useState<string>("");
  const [searchText, setSearchText] = useState<string>("");
  const [freelancers, setFreelancers] = useState<FlattenedProfile[]>([]);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const inputRef = useRef<TextInput>(null);

  const [loaded, error] = useFonts({
    "TitanOne-Regular": require("../../assets/fonts/TitanOne-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  const fetchId = async () => {
    const { data: authData } = await supabase.auth.getUser();
    if (authData.user) {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", authData.user.id)
        .single();

      if (error) {
        console.error("Error fetching user profile:", error);
        return;
      }

      setUserId(authData.user.id);
      setUserState(data.state);
      setUserCity(data.city);
    }
  };

  const fetchFreelancers = async (role: string) => {
    if (!role || !userId) return;

    setIsLoading(true);
    setApiError(null);

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
        )
      `
      )
      .filter("id", "neq", userId)
      .filter("freelancers.roles", "cs", `{${role}}`) // Use 'cs' for contains
      .filter("state", "eq", userState)
      .filter("city", "eq", userCity);

    if (error) {
      setApiError("Erro ao buscar prestadores. Tente novamente.");
      return console.log(error.message);
    } else {
      console.log("Freelancers data:", data, selectedValue);
    }

    const flattenedData: any[] = data.map((profile) => {
      const { freelancers, ...rest } = profile;
      return {
        ...rest,
        ...freelancers,
      };
    });

    setFreelancers(flattenedData);
    setIsLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      fetchId();
      fetchFreelancers(selectedValue);
    }, [userCity])
  );

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", async () => {
      await fetchId();
      await fetchFreelancers(selectedValue);
    });

    return () => {
      unsubscribe();
    };
  }, [navigation]);

  const handleItemSelect = async (item: string) => {
    if (!userId) {
      await fetchId();
    }
    setSelectedValue(item);
    setIsModalVisible(false);
    await fetchFreelancers(item); // Fetch freelancers immediately after selection
  };

  const handleSearch = (text: string) => {
    setSearchText(text);
  };

  const filteredServiceTypes = roles
    .sort()
    .filter((service) =>
      service.toLowerCase().startsWith(searchText.toLowerCase())
    );

  if (!loaded && !error) {
    return null;
  }

  return (
    <View style={styles.backColor}>
      <Animatable.Text animation="fadeInDown" style={styles.headerContainer}>
        1<Text style={styles.colorEspecific}>2</Text> PUL
        <Text style={styles.colorEspecific}>O</Text>
      </Animatable.Text>

      <View style={styles.container}>
        <Animatable.View animation="bounceIn" style={styles.pickerContainer}>
          <TouchableOpacity
            style={styles.searchBar}
            onPress={() => setIsModalVisible(true)}
          >
            <Text
              style={{
                color: "#ffffff",
                textAlign: "center",
                fontWeight: "700",
              }}
            >
              {"Selecione um serviço"}
            </Text>
          </TouchableOpacity>
        </Animatable.View>

        <Modal
          visible={isModalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setIsModalVisible(false)}
        >
          <TouchableWithoutFeedback onPress={() => setIsModalVisible(false)}>
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
                      placeholder="Buscar Um Serviço"
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
                    data={filteredServiceTypes}
                    keyExtractor={(item) => item}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        style={styles.modalItem}
                        onPress={() =>
                          item.length > 1 ? handleItemSelect(item) : ""
                        }
                      >
                        <Text
                          style={
                            item.length > 1
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
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>

        {isLoading ? (
          <ActivityIndicator size="large" color="#2d47f0" />
        ) : apiError ? (
          <Text style={{ textAlign: "center", color: "red" }}>{apiError}</Text>
        ) : freelancers.length > 0 ? (
          <Animatable.View animation="fadeInUp">
            <ListFreelancer
              data={freelancers}
              navigation={navigation}
              selectedRole={selectedValue}
            />
          </Animatable.View>
        ) : (
          <View style={styles.noSelectionContainer}>
            <Text style={{ textAlign: "center" }}>
              {selectedValue
                ? "Nenhum prestador encontrado."
                : "Selecione um serviço acima para buscar por prestadores!"}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  backColor: {
    backgroundColor: "#fff",
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  headerContainer: {
    color: "#2d47f0",
    fontSize: 30,
    marginTop: "9%",
    textAlign: "center",
    fontFamily: "TitanOne-Regular",
    margin: 2,
  },
  colorEspecific: {
    color: "#f27e26",
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
});

export default HomeScreen;
