import { useState } from "react";
import {
  Alert,
  Keyboard,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { theme } from "../../colors";
import { IP_ADDRESS } from "../../temp/IPAddress";
import { MyButton } from "../components/MyButton";
import { MyTextInput } from "../components/MyTextInput";

function FindAccount({ navigation, route }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [id, setId] = useState("");
  const [message, setMessage] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [checkNewPwd, setCheckNewPwd] = useState("");
  const [accountIdx, setAccountIdx] = useState(0);
  const [pwResetVisible, setPwResetVisible] = useState(false);
  const mode = route.params.mode === "ID" ? "아이디" : "비밀번호";

  const resetUserPassword = () => {
    if (newPwd === "" || checkNewPwd === "") {
      Alert.alert("비밀번호 입력", "재설정할 비밀번호를 입력해주세요.", [
        {
          text: "OK",
        },
      ]);
    } else if (newPwd.length < 5) {
      Alert.alert("비밀번호 입력", "비밀번호는 5자 이상이어야 합니다.", [
        {
          text: "OK",
        },
      ]);
    } else if (newPwd !== checkNewPwd) {
      Alert.alert("비밀번호 불일치", "입력한 비밀번호가 일치하지 않습니다.", [
        {
          text: "OK",
        },
      ]);
    } else if (newPwd.includes(" ")) {
      Alert.alert(
        "비밀번호 입력 오류",
        "비밀번호에 공백문자를 포함할 수 없습니다.",
        [
          {
            text: "OK",
          },
        ]
      );
    } else {
      resetUserPasswordWithServer();
      Alert.alert("비밀번호 재설정", "비밀번호가 변경되었습니다.", [
        {
          text: "OK",
        },
      ]);
      navigation.pop();
    }
  };

  async function selectIdWithServer() {
    let url = `${IP_ADDRESS}/account/idfind`;
    url += `?name=${name}&email=${email}`;
    // GET 형식은 header와 body 넣으면 X: TypeError: Body not allowed for GET or HEAD requests
    const selectedId = await fetch(url);
    const json = await selectedId.json();
    console.log("selectedId:", json);
    return json;
  }

  async function selectPwdWithSever() {
    let url = `${IP_ADDRESS}/account/pwfind`;
    url += `?id=${id}&name=${name}&email=${email}`;
    const selectedPwd = await fetch(url);
    const json = await selectedPwd.json();
    console.log(json);
    return json;
  }

  async function resetUserPasswordWithServer() {
    let url = `${IP_ADDRESS}/account/pwcreate`;
    url += `?idx=${accountIdx}&pw=${newPwd}`;
    await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        pw: newPwd,
      }),
    });
  }

  const findId = async () => {
    const findId = await selectIdWithServer();
    if (findId.status === 200) {
      setMessage(`${name}님의 비밀번호는 "${findId.Account_id}" 입니다.`);
    } else {
      setMessage("사용자 정보가 정확하지 않습니다!");
    }
  };
  const findPwd = async () => {
    const findPwd = await selectPwdWithSever();
    if (findPwd.status === 200) {
      setAccountIdx(findPwd.Account_idx);
      setPwResetVisible(!pwResetVisible);
    } else {
      setMessage("사용자 정보가 정확하지 않습니다!");
    }
  };
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Modal
          visible={pwResetVisible}
          animationType="fade"
          transparent={true}
          onRequestClose={() =>
            OS === "android" ? setPwResetVisible(!pwResetVisible) : null
          }
        >
          <Pressable
            style={{
              flex: 1,
              backgroundColor: "transparent",
            }}
            onPress={() => setPwResetVisible(!pwResetVisible)}
          />
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View
              style={{
                position: "absolute",
                width: "90%",
                height: "80%",
                left: "5%",
                top: "10%",
                justifyContent: "center",
                paddingHorizontal: 12,
                borderRadius: 12,
                backgroundColor: "#303030",
              }}
            >
              <Text
                style={{
                  color: "white",
                  fontSize: 24,
                  textAlign: "center",
                  marginBottom: 18,
                }}
              >{`"${id}"\n님의 비밀번호를 재설정합니다.`}</Text>
              <MyTextInput
                placeholder="새로운 비밀번호 입력"
                placeholderTextColor="#C0C0C0"
                value={newPwd}
                onChangeText={setNewPwd}
                secureTextEntry={true}
                returnKeyType="done"
              />
              <MyTextInput
                placeholder="비밀번호 재입력"
                placeholderTextColor="#C0C0C0"
                value={checkNewPwd}
                onChangeText={setCheckNewPwd}
                secureTextEntry={true}
                returnKeyType="done"
              />
              <MyButton
                style={{ backgroundColor: "black", borderColor: "white" }}
                textStyle={{ color: "white" }}
                text="비밀번호 재설정"
                onPress={resetUserPassword}
              />
            </View>
          </TouchableWithoutFeedback>
        </Modal>
        <MyTextInput placeholder="이름" value={name} onChangeText={setName} />
        <MyTextInput
          placeholder="e-mail"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        {mode === "비밀번호" ? (
          <MyTextInput placeholder="아이디" value={id} onChangeText={setId} />
        ) : null}
        <MyButton
          text={`${mode} 찾기`}
          onPress={() => {
            mode === "비밀번호" ? findPwd() : findId();
            Keyboard.dismiss();
          }}
        />
        <MyButton text="돌아가기" onPress={() => navigation.pop()} />
        <View style={{ alignItems: "center", marginBottom: 20 }}>
          <Text style={{ fontSize: 18, fontWeight: "bold" }}>{message}</Text>
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

export { FindAccount };
