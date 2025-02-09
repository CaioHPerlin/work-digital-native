import React, { useEffect, useState } from "react";
import { View, StyleSheet, Alert, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import * as Animatable from "react-native-animatable";
import PersonalCard from "../components/PersonalCard";
import Description from "../components/Description";
import BtnPersonal from "../components/BtnPersonal";
import useImagePreloader from "../../hooks/useImagePreloader";
import { HighlightImage } from "../types";
import { supabase } from "../../lib/supabase";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "expo-router";

interface Props {
  route: any;
}

const FreelancerDetails: React.FC<Props> = ({ route }) => {
  const [initLoading, setInitLoading] = useState(false);
  const { freelancer } = route.params;
  const [highlight, setHighlight] = useState<HighlightImage | null>(null);

  const navigation = useNavigation();

  useEffect(() => {
    const fetchHighlight = async () => {
      if (!freelancer || !freelancer.roles || freelancer.roles.length === 0) {
        return; // No roles available to fetch highlights
      }

      try {
        const { data, error } = await supabase
          .from("highlights")
          .select("*")
          .eq("user_id", freelancer.id)
          .eq("role", freelancer.roles[0]);

        if (error) {
          console.error("Error fetching highlights:", error.message);
          Alert.alert("Erro ao buscar destaques");
          return;
        }

        if (data && data.length > 0) {
          setHighlight(data[0]); // Set the first highlight if available
        }
      } catch (error) {
        console.error(
          "Error in fetching highlights:",
          (error as Error).message
        );
      } finally {
        setInitLoading(false);
      }
    };

    fetchHighlight();
  }, [freelancer]);

  // Ensure the image URLs are properly formatted
  const imageUrls = [
    freelancer.profile_picture_url,
    ...(highlight?.images ?? []), // Fallback to empty array if no images
  ].filter(Boolean); // Remove any undefined/null values

  // Use the custom hook to preload images
  const loading = useImagePreloader(imageUrls);

  // Show loading animation while images are being cached
  if (loading || initLoading) {
    return (
      <View style={styles.centerContainer}>
        <Animatable.Text
          animation="bounce"
          iterationCount="infinite"
          style={styles.loadingText}
        >
          {"Carregando... "}
        </Animatable.Text>
      </View>
    );
  }

  // Once images are cached, show the actual UI
  return (
    <SafeAreaView style={styles.geral}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        style={{ position: "absolute", left: 20, top: 25, zIndex: 999 }}
      >
        <Icon name="arrow-left" size={25} color={"#f27e26"} />
      </TouchableOpacity>
      <View style={styles.dadosFreelancer}>
        <PersonalCard freelancer={freelancer} />
        <Description freelancer={freelancer} />
      </View>
      <BtnPersonal highlight={highlight} freelancer={freelancer} />
    </SafeAreaView>
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
    flex: 0.5,
    flexWrap: "wrap",
    flexDirection: "row",
  },
  dadosFreelancer: {
    margin: 0,
    borderWidth: 5,
    borderColor: "#2d47f0",
    paddingLeft: 20,
  },
  geral: {
    backgroundColor: "#2d47f0",
  },
  loadingText: {
    fontSize: 34,
    color: "#feb96f",
  },
});
export default FreelancerDetails;
