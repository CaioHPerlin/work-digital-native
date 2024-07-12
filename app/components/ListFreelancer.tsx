import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";

interface Freelancer {
  id: number;
  role: string;
  name: string;
  phone: string;
  email: string;
  city: string;
  state: string;
  description: string;
  profile_picture: string;
  picture_folder: string;
}

interface ListFreelancerProps {
  data: Freelancer[];
  navigation: any;
}

const ListFreelancer: React.FC<ListFreelancerProps> = ({
  data,
  navigation,
}) => {
  const navigateToDetails = (freelancer: Freelancer) => {
    navigation.navigate("FreelancerDetails", { freelancer });
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }: { item: Freelancer }) => (
          <TouchableOpacity
            onPress={() => navigateToDetails(item)}
            style={styles.itemContainer}
          >
            <Image
              source={{
                uri: `https://res.cloudinary.com/dwngturuh/image/upload/profile-pictures/${item.id}.jpg`,
              }}
              style={styles.image}
            />
            <View style={styles.textContainer}>
              <Text style={styles.nameText}>{item.name}</Text>
              <Text style={styles.roleText}>{item.role}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default ListFreelancer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
  },
  itemContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    margin: 5,
    borderColor: "#FFC88d",
    borderWidth: 1,
    backgroundColor: "#ffffff",
    borderBottomColor: "transparent",
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
    fontSize: 20,
  },
  roleText: {
    fontSize: 18,
    color: "#666",
  },
});
