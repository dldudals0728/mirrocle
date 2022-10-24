import { useState } from "react";
import {
  Keyboard,
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
  const mode = route.params.mode === "ID" ? "아이디" : "비밀번호";

  async function selectIdWithServer() {
    let url = `${IP_ADDRESS}/account/idfind`;
    url += `?name=${name}&email=${email}`;
    // GET 형식은 header와 body 넣으면 X: TypeError: Body not allowed for GET or HEAD requests
    const selectedId = await fetch(url);
    const json = await selectedId.json();
    console.log("selectedId:", json);
    return json;
  }

  async function selectPwdWIthSever() {
    let url = `${IP_ADDRESS}/account/pwfind`;
    url += `?id=${id}&name=${name}&email=${email}`;
    const selectedPwd = await fetch(url);
    const json = await selectedPwd.json();
    console.log(json);
    return json;
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
    const findPwd = await selectPwdWIthSever();
    if (findPwd.status === 200) {
      setMessage(`${name}님의 비밀번호는 "${findPwd.Account_pw}" 입니다.`);
    } else {
      setMessage("사용자 정보가 정확하지 않습니다!");
    }
  };
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
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
