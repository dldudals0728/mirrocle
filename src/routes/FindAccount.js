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
    url += `?pw=${"232323"}&name=${name}&email=${email}`;
    // GET 형식은 header와 body 넣으면 X: TypeError: Body not allowed for GET or HEAD requests
    const selectedId = await fetch(url);
    console.log("selectedId:", selectedId);
    return selectedId;
  }

  async function selectPwdWIthSever() {
    // let url = "http://" + IP_ADDRESS + ":8080/mirrocle/login";
    // url += `?accountID=${userId}&accountPwd=${userPwd}`;
    // const res = await fetch(url).catch((error) => console.log(error));
    let url = `${IP_ADDRESS}/account/login`;
    url += `?id=${userId}&pw=${userPwd}`;
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: userId,
        pw: userPwd,
      }),
    });
    const loginCode = await res.json();
    return loginCode;
  }

  const findId = () => {
    const findId = selectIdWithServer();
    setMessage(`${name}님의 비밀번호는 "${findId}" 입니다.`);
  };
  const findPwd = () => {
    if (name === "admin" && email === "admin@ac.kr" && id === "root") {
      const findPwd = "1234";
      setMessage(`${name}님의 비밀번호는 "${findPwd}" 입니다.`);
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
