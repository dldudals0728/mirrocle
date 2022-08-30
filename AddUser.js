import { useEffect, useState } from "react";
import {
  Image,
  Keyboard,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { theme } from "./colors";

function AddUser({ navigation }) {
  const [userIcon, setUserIcon] = useState([]);
  useEffect(() => {
    const icons = [];
    {
      for (var i = 0; i <= 12; i++) icons.push(`userIcon-${i}.png`);
    }
    setUserIcon(icons);
  }, []);
  return (
    <View style={styles.container}>
      <View style={styles.userBox}></View>
      <TextInput
        style={styles.inputUsername}
        placeholder="username"
      ></TextInput>
      <View style={styles.pickupUserIcon}>
        <ScrollView contentContainerStyle={{}}>
          {userIcon.map((icon, idx) => {
            <View
              key={idx}
              style={{ backgroundColor: "white", width: 50, height: 50 }}
            >
              <Text>icon</Text>
              <Text>icon</Text>
              <Text>icon</Text>
            </View>;
          })}
        </ScrollView>
      </View>
    </View>
  );
}

styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.baeminBg,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  userBox: {
    width: 75,
    height: 75,
    borderRadius: 15,
    marginBottom: 20,
    backgroundColor: theme.grey,
  },
  inputUsername: {
    borderBottomColor: "black",
    borderBottomWidth: 1,
    width: 150,
    fontSize: 18,
    marginBottom: 20,
  },
  pickupUserIcon: {
    width: "100%",
    height: 150,
    backgroundColor: "teal",
  },
  userIcon: {
    flexDirection: "row",
  },
});

export { AddUser };
