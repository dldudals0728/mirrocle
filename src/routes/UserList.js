import { StatusBar } from "expo-status-bar";
import {
  Alert,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { Fontisto } from "@expo/vector-icons";
import { Logo } from "../components/Logo";
import { MyButton } from "../components/MyButton";
import { theme } from "../../colors";

function UserList({ navigation }) {
  /**
   * @todo 유저 정보를 수정할 수 있도록 버튼 또는 네비게이션 제공
   * @todo 등록된 프리셋이 없다 ? (프리셋을 등록해 보세요 alert; AddUser) : null
   */
  const gotoUser = () => {
    Alert.alert("access user", "success!", [
      {
        text: "OK",
      },
    ]);
    navigation.navigate("MainScreen");
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
      <Logo titleSize={30} style={styles.logoStyle} />
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
      <View style={{ width: "100%" }}>
        <MyButton
          text="Mirrocle Settings"
          onPress={() => navigation.navigate("MirrocleSettings")}
        />
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.baeminBg,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },

  logoStyle: {
    marginBottom: 40,
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

export { UserList };
