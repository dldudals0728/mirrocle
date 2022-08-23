import { StatusBar } from "expo-status-bar";
import {
  Alert,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { Fontisto } from "@expo/vector-icons";

export default function App() {
  const gotoUser = () => {
    Alert.alert("access user", "success!", [
      {
        text: "OK",
      },
    ]);
  };
  const addUser = () => {
    Alert.alert("add user", "Do you want add user?", [
      {
        text: "cancel",
      },
      {
        text: "I'm Sure",
        onPress: () => {
          Alert.alert("add user", "success!", [
            {
              text: "OK",
            },
          ]);
        },
      },
    ]);
  };
  const payUser = () => {
    Alert.alert("pay for additional user", "Do you want pay for add user?", [
      {
        text: "cancel",
      },
      {
        text: "I'm Sure",
        onPress: () => {
          Alert.alert("payment", "success!", [
            {
              text: "OK",
            },
          ]);
        },
      },
    ]);
  };
  return (
    <View style={styles.container}>
      <View style={styles.banner}>
        <MaterialCommunityIcons
          name="mirror-rectangle"
          size={100}
          color="black"
        />
        <View>
          <Text>Smart Mirror</Text>
          <Text style={styles.bannerText}>Mirrocle</Text>
        </View>
      </View>
      <View style={styles.userContainer}>
        <View style={styles.userContainer__col}>
          <TouchableWithoutFeedback onPress={gotoUser}>
            <View style={{ ...styles.userBox, backgroundColor: "#CCCCCC" }}>
              <AntDesign
                name="user"
                size={100}
                color="black"
                style={styles.userCharacter}
              />
              <Text style={styles.userText}>user1</Text>
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback onPress={gotoUser}>
            <View style={{ ...styles.userBox, backgroundColor: "#CCCCCC" }}>
              <AntDesign
                name="user"
                color="black"
                style={styles.userCharacter}
              />
              <Text style={styles.userText}>user2</Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
        <View style={styles.userContainer__col}>
          <TouchableWithoutFeedback onPress={addUser}>
            <View style={{ ...styles.userBox, backgroundColor: "#3A3D40" }}>
              <AntDesign
                name="pluscircle"
                color="black"
                style={styles.emptyUser}
              />
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback onPress={payUser}>
            <View style={{ ...styles.userBox, backgroundColor: "#3A3D40" }}>
              <Fontisto name="dollar" style={styles.paidUser} />
              <Text style={styles.payText}>6.99$</Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2AC1BC",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },

  banner: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-end",
    marginBottom: 40,
  },

  bannerText: {
    fontSize: 30,
    fontWeight: "700",
  },

  userContainer: { paddingBottom: 20 },

  userContainer__col: {
    flexDirection: "row",
  },

  userCharacter: {
    fontSize: 100,
    paddingBottom: 18,
  },

  userText: {
    fontSize: 18,
    fontWeight: "600",
  },

  emptyUser: {
    fontSize: 100,
    paddingVertical: 20,
    color: "white",
  },

  paidUser: {
    fontSize: 100,
    paddingVertical: 10,
    paddingHorizontal: 24,
    color: "white",
  },

  payText: {
    fontSize: 18,
    fontWeight: "600",
    color: "white",
  },

  userBox: {
    borderRadius: 5,
    borderWidth: 2,
    paddingHorizontal: 30,
    paddingVertical: 10,
    marginHorizontal: 10,
    marginVertical: 10,
    justifyContent: "center",
    alignItems: "center",
  },
});
