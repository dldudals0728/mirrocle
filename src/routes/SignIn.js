import {
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  Keyboard,
  Alert,
} from "react-native";
import { useState } from "react";
import { theme } from "../../colors";
import { MyButton } from "../components/MyButton";
import { Logo } from "../components/Logo";
import { MyTextInput } from "../components/MyTextInput";

function SignIn({ navigation }) {
  const [userId, setUserId] = useState("");
  const [userPwd, setUserPwd] = useState("");
  const [checkPwd, setCheckPwd] = useState("");
  const clearAll = () => {
    setUserId("");
    setUserPwd("");
    setCheckPwd("");
  };
  const signin = () => {
    /**
     * @todo 본인 인증 넣기(전화번호 or pass)
     */
    if (userId === "") {
      /**
       * @todo 아이디가 DB에 있다 ? 이미 사용중인 아이디 입니다. : null
       */
      Alert.alert("아이디 입력", "아이디를 입력해주세요.", [
        {
          text: "OK",
        },
      ]);
    } else if (userPwd === "" || checkPwd === "") {
      Alert.alert("비밀번호 입력", "비밀번호를 입력해주세요.", [
        {
          text: "OK",
        },
      ]);
    } else if (userPwd !== checkPwd) {
      Alert.alert("비밀번호 불일치", "비밀번호가 일치하지 않습니다.", [
        {
          text: "OK",
        },
      ]);
    } else {
      Alert.alert("회원가입", "회원가입이 완료되었습니다.", [
        {
          text: "OK",
        },
      ]);
      clearAll();
      navigation.pop();
    }
  };
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <View style={styles.SignInContainer}>
          <Logo style={{ marginBottom: 20 }} titleSize={30} titleWeight="700" />
          <MyTextInput
            value={userId}
            onChangeText={setUserId}
            placeholder="아이디 입력"
            returnKeyType="done"
            onSubmitEditing={signin}
          ></MyTextInput>
          <MyTextInput
            value={userPwd}
            onChangeText={setUserPwd}
            secureTextEntry={true}
            placeholder="비밀번호 입력"
            returnKeyType="done"
            onSubmitEditing={signin}
          ></MyTextInput>
          <MyTextInput
            value={checkPwd}
            onChangeText={setCheckPwd}
            secureTextEntry={true}
            placeholder="비밀번호 확인(재입력)"
            returnKeyType="done"
            onSubmitEditing={signin}
          ></MyTextInput>
          <View style={styles.SignInBtnContainer}>
            <MyButton text="회원가입" onPress={signin} />
            <MyButton
              text="돌아가기"
              onPress={() => {
                navigation.pop();
              }}
            />
          </View>
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
  SignInContainer: {
    flex: 1,
    justifyContent: "center",
  },
});

export { SignIn };
