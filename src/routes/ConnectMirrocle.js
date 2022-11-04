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
import { IP_ADDRESS } from "../../temp/IPAddress";
import { MyButton } from "../components/MyButton";
import { MyTextInput } from "../components/MyTextInput";

function ConnectMirrocle({ navigation, route }) {
  const { Account_idx: accountIdx, mirrorIdx, SN } = route.params;
  console.log(accountIdx);
  console.log(mirrorIdx);
  const [mirrorNumber, setMirrorNumber] = useState("");
  useEffect(() => {
    if (route.params.SN) {
      setMirrorNumber(route.params.SN);
      connect();
    }
  }, []);
  const connectMirrorWithServer = async () => {
    let url = `${IP_ADDRESS}/mirror/connect`;
    if (route.params.SN) {
      url += `?serialNum=${SN}&accountIndex=${accountIdx}`;
    } else {
      url += `?serialNum=${mirrorNumber}&accountIndex=${accountIdx}`;
    }
    await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        serialNum: SN,
        accountIdx,
      }),
    });
    navigation.reset({
      routes: [
        {
          name: "UserList",
          params: {
            accountIdx,
            mirrorIdx,
          },
        },
      ],
    });
  };
  const scanQRCode = () =>
    navigation.navigate("QRCodeScanner", { accountIdx, mirrorIdx });
  const connect = async () => {
    await connectMirrorWithServer();
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
            onPress={() => {
              if (mirrorNumber === "") {
                Alert.alert("시리얼 넘버 오류", "시리얼 넘버를 입력해주세요.", [
                  {
                    text: "OK",
                  },
                ]);
                return;
              }
              connect();
            }}
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
