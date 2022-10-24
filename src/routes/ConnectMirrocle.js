import { useEffect, useState } from "react";
import {
  Alert,
  Keyboard,
  Platform,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { theme } from "../../colors";
import { MyButton } from "../components/MyButton";
import { MyTextInput } from "../components/MyTextInput";

function ConnectMirrocle({ navigation, route }) {
  const [mirrorNumber, setMirrorNumber] = useState("");
  // useEffect(() => {
  //   if (route.params) {
  //     setMirrorNumber(route.params.SN);
  //     connect();
  //   }
  // }, []);
  const scanQRCode = () => navigation.navigate("QRCodeScanner");
  const connect = () => {
    /**
     * @todo 입력된 고유번호(혹은 QRcode)가 DB에 있다 ? (DB user 테이블에 연동기기 설정; UserList) : 입력 오류 입니다.
     */
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
          <MyButton text="QR Code 촬영" onPress={scanQRCode} />
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
