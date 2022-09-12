import { useState } from "react";
import {
  Alert,
  Dimensions,
  Image,
  Keyboard,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { theme } from "../../colors";
import { Icons } from "../../icons";
import { MyButton } from "../components/MyButton";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const ICON_BOX_LENGTH = parseInt(Object.keys(Icons).length / 4 + 1);

function AddUser({ navigation }) {
  const [username, setUsername] = useState("");
  const iconBox = [];
  for (var i = 1; i < ICON_BOX_LENGTH; i++) {
    iconBox.push(i);
  }
  const [selectedIcon, setSelectedIcon] = useState(
    require("../images/userIcon-1.png")
  );
  const addUser = () => {
    if (username === "") {
      Alert.alert("유저 이름 입력", "사용자의 이름을 설정해주세요.", [
        {
          text: "OK",
        },
      ]);
    }
    /**
     * @todo 해당 유저를 계정에 연결시킨다.
     */
  };

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{ alignItems: "center" }}>
          <View style={styles.userBox}>
            <Image style={styles.userIconImage} source={selectedIcon} />
          </View>
          <TextInput
            style={styles.inputUsername}
            placeholder="username"
            textAlign="center"
            value={username}
            onChangeText={setUsername}
          ></TextInput>
        </View>
      </TouchableWithoutFeedback>
      <View style={styles.pickupUserIcon}>
        <ScrollView
          horizontal
          pagingEnabled
          contentContainerStyle={{ alignItems: "center" }}
        >
          {/** 정리 필요! */}
          {iconBox.map((value, idx) => (
            <View key={idx} style={styles.iconPages}>
              {Object.values(Icons).map((icon, idx) =>
                Math.ceil(icon.idx / 4) >= value &&
                Math.ceil(icon.idx / 4) < value + 1 ? (
                  <TouchableWithoutFeedback
                    key={idx}
                    onPress={() => {
                      setSelectedIcon(icon.src);
                    }}
                  >
                    <Image
                      style={{ width: 50, height: 50 }}
                      source={icon.src}
                    />
                  </TouchableWithoutFeedback>
                ) : null
              )}
            </View>
          ))}
        </ScrollView>
      </View>
      <MyButton
        style={{ marginTop: 20 }}
        text="추가"
        onPress={() => console.log("hi")}
      />
      <MyButton
        text="돌아가기"
        onPress={() => {
          navigation.pop();
        }}
      />
    </View>
  );
}

styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.baeminBg,
    justifyContent: "center",
    paddingHorizontal: 40,
  },

  userBox: {
    width: 75,
    height: 75,
    borderRadius: 15,
    marginBottom: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.githubWhite,
  },

  inputUsername: {
    borderBottomColor: "black",
    borderBottomWidth: 1,
    width: 150,
    fontSize: 18,
    marginBottom: 20,
    paddingBottom: 5,
  },

  pickupUserIcon: {
    height: 150,
    borderRadius: 15,
    backgroundColor: theme.githubWhite,
  },

  iconPages: {
    flexDirection: "row",
    width: SCREEN_WIDTH - 80,
    justifyContent: "space-around",
  },

  userIcon: {
    flexDirection: "row",
  },

  userIconImage: {
    width: 50,
    height: 50,
  },
});

export { AddUser };
