import { useState } from "react";
import {
  Keyboard,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { theme } from "../../colors";
import { MyButton } from "../components/MyButton";
import { MyTextInput } from "../components/MyTextInput";

function FindAccount({ navigation, route }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [id, setId] = useState("");
  const [message, setMessage] = useState("");
  const mode = route.params.mode === "ID" ? "아이디" : "비밀번호";
  const findId = () => {
    if (name === "admin" && email === "admin@ac.kr") {
      const findId = "root";
      setMessage(`${name}님의 아이디는 "${findId}" 입니다.`);
    } else {
      setMessage("사용자 정보가 정확하지 않습니다!");
    }
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
