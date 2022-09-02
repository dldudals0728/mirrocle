import { useState } from "react";
import {
  Alert,
  Keyboard,
  Platform,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
// import { PERMISSIONS, request } from "react-native-permissions";
import { theme } from "./colors";
import { MyButton } from "./src/components/MyButton";
import { MyTextInput } from "./src/components/MyTextInput";

function ConnectMirrocle({ navigation }) {
  // const requestPermissions = async () => {
  //   console.log(Platform.OS);
  //   // error
  //   const result = await request(PERMISSIONS.IOS.CAMERA);
  //   console.log(result);
  // };
  const [mirrorNumber, setMirrorNumber] = useState("");
  const connect = () => {
    Alert.alert("Connect to Mirrocle", "success!", [
      {
        text: "OK",
      },
    ]);
  };
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <View>
          <MyTextInput
            style={styles.identification}
            placeholder="Mirrocle 고유번호 입력"
            onSubmitEditing={connect}
            value={mirrorNumber}
            onChangeText={setMirrorNumber}
          ></MyTextInput>
        </View>
        <View>
          <MyButton
            text="연결하기"
            onPress={() => navigation.navigate("UserList")}
          />
          <View style={{ alignItems: "center", marginBottom: 20 }}>
            <Text>또는</Text>
          </View>
          <MyButton
            text="QR Code 촬영"
            onPress={() => navigation.navigate("Login")}
          />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.baeminBg,
    justifyContent: "center",
    paddingHorizontal: 40,
  },
});

export { ConnectMirrocle };
