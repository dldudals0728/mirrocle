import {
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
  Keyboard,
  Alert,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { theme } from "./colors";
import { useState } from "react";
import { MyButton } from "./src/components/MyButton";
import { Logo } from "./src/components/Logo";
import { MyTextInput } from "./src/components/MyTextInput";

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
    if (userId === "") {
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
    } else {
      Alert.alert("회원가입", "회원가입이 완료되었습니다.", [
        {
          text: "OK",
        },
      ]);
      clearAll();
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
              onPress={() => navigation.navigate("Login")}
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
