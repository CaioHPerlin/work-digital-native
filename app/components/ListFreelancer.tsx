import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { FlattenedProfile, Freelancer } from "../types";
import ImageWithFallback from "./ImageWithFallback";
import { optimizeImageLowQ } from "../../utils/imageOptimizer";

interface ListFreelancerProps {
  data: FlattenedProfile[];
  navigation: any;
  selectedRole?: string;
}

const ListFreelancer: React.FC<ListFreelancerProps> = ({
  data,
  navigation,
  selectedRole,
}) => {
  const navigateToDetails = (freelancer: FlattenedProfile) => {
    navigation.navigate("FreelancerDetails", {
      freelancer: { ...freelancer, roles: [selectedRole] },
    });
  };

  useEffect(() => {
    data.map((freelancer) => console.log(freelancer));
  }, [data]);

  return (
    <SafeAreaView style={styles.container}>
      {data.length === 0 ? (
        <Text style={{ textAlign: "center" }}>
          Nenhum freelancer encontrado.
        </Text>
      ) : (
        <FlatList
          data={data}
          keyExtractor={(freelancer) => freelancer.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => navigateToDetails(item)}
              style={styles.itemContainer}
            >
              <ImageWithFallback
                imageUrl={optimizeImageLowQ(item.profile_picture_url)}
                style={styles.image}
                cache={"none"}
              />
              <View style={styles.textContainer}>
                <Text style={styles.nameText}>
                  {item.name
                    .toLowerCase()
                    .split(" ")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ")}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </SafeAreaView>
  );
};

export default ListFreelancer;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingTop: 20,
  },
  flatlist: {
    flex: 1,
  },
  itemContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    margin: 5,
    borderColor: "#FFC88d",
    borderWidth: 2,
    backgroundColor: "#ffffff",
    borderRadius: 5,
  },
  textContainer: {
    marginLeft: 10,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  nameText: {
    fontSize: 18,
  },
  roleText: {
    fontSize: 16,
    color: "#666",
  },
});
