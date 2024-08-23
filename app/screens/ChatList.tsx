import * as React from "react";
import { StyleSheet, Image, TouchableOpacity, View } from "react-native";
import { Text } from "react-native-paper";

const ChatList = () => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.card}>
        <View style={styles.userInfo}>
          <View style={styles.userImgWrapper}>
            <Image
              style={styles.userImg}
              source={{ uri: "https://example.com/image.jpg" }}
            />
          </View>
          <View style={styles.textSection}>
            <View style={styles.userInfoText}>
              <Text style={styles.userName}>User Name</Text>
              <Text style={styles.postTime}>12:00 PM</Text>
            </View>
            <Text style={styles.messageText}>This is a message text.</Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default ChatList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingLeft: 20,
    paddingRight: 20,
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
  card: {
    width: "100%",
  },
  userInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  userImgWrapper: {
    paddingTop: 15,
    paddingBottom: 15,
  },
  userImg: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  textSection: {
    flexDirection: "column",
    justifyContent: "center",
    padding: 15,
    paddingLeft: 0,
    marginLeft: 10,
    width: 300,
    borderBottomWidth: 1,
    borderBottomColor: "#cccccc",
  },
  userInfoText: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  userName: {
    fontSize: 14,
    fontWeight: "bold",
  },
  postTime: {
    fontSize: 12,
    color: "#666",
  },
  messageText: {
    fontSize: 14,
    color: "#333333",
  },
});
