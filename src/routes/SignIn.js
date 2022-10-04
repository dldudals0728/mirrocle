import {
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  Keyboard,
  Alert,
  Text,
} from "react-native";
import { useState } from "react";
import { theme } from "../../colors";
import { MyButton } from "../components/MyButton";
import { Logo } from "../components/Logo";
import { MyTextInput } from "../components/MyTextInput";

function SignIn({ navigation }) {
  const [userId, setUserId] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPwd, setUserPwd] = useState("");
  const [checkPwd, setCheckPwd] = useState("");
  const [name, setName] = useState("");
  const [isDuplicate, setIsDuplicate] = useState(true);
  const [checkDuplicate, setCheckDuplicate] = useState(false);
  const clearAll = () => {
    setUserId("");
    setUserPwd("");
    setCheckPwd("");
  };
  const signIn = () => {
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
    } else if (userPwd.length < 5) {
      Alert.alert("비밀번호 오류", "비밀번호는 5자리 이상이어야 합니다!", [
        {
          text: "OK",
        },
      ]);
      setCheckDuplicate(false);
      return;
    } else if (userPwd !== checkPwd) {
      Alert.alert("비밀번호 불일치", "비밀번호가 일치하지 않습니다.", [
        {
          text: "OK",
        },
      ]);
    } else if (userEmail === "") {
      Alert.alert("사용자 메일 입력", "사용자 메일을 입력해주세요.", [
        {
          text: "OK",
        },
      ]);
    } else if (!userEmail.includes("@") || !userEmail.includes(".")) {
      Alert.alert("메일 입력 오류", "메일 형식이 올바르지 않습니다.", [
        {
          text: "OK",
        },
      ]);
    } else if (name === "") {
      Alert.alert("이름 입력", "이름을 입력해주세요.", [
        {
          text: "OK",
        },
      ]);
    } else if (isDuplicate) {
      Alert.alert("아이디 확인", "아이디 중복을 확인해주세요.", [
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
  const idCheck = () => {
    if (userId === "") {
      Alert.alert("아이디 입력", "아이디를 입력해주세요.", [
        {
          text: "OK",
        },
      ]);
      setCheckDuplicate(false);
      return;
    } else if (userId.length < 5) {
      Alert.alert("아이디 오류", "아이디는 5자리 이상이어야 합니다!", [
        {
          text: "OK",
        },
      ]);
      setCheckDuplicate(false);
      return;
    }
    setCheckDuplicate(true);
    if (userId === "root") {
      setIsDuplicate(true);
    } else {
      setIsDuplicate(false);
    }
  };
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <View style={styles.SignInContainer}>
          <Logo style={{ marginBottom: 20 }} titleSize={30} titleWeight="700" />
          <View>
            <View style={{ flexDirection: "row" }}>
              <MyTextInput
                value={userId}
                onChangeText={setUserId}
                placeholder="아이디 입력"
                returnKeyType="done"
                onSubmitEditing={signIn}
                style={{ flex: 1, marginRight: 5 }}
              />
              <MyButton text="확인" onPress={idCheck} />
            </View>
            <View
              style={{
                display: checkDuplicate ? "flex" : "none",
                position: "relative",
                top: -20,
              }}
            >
              <Text style={{ color: isDuplicate ? "red" : "blue" }}>
                {isDuplicate
                  ? "사용할 수 없는 아이디 입니다."
                  : "사용 가능한 아이디 입니다."}
              </Text>
            </View>
          </View>
          <MyTextInput
            value={userPwd}
            onChangeText={setUserPwd}
            secureTextEntry={true}
            placeholder="비밀번호 입력"
            returnKeyType="done"
            onSubmitEditing={signIn}
          />
          <MyTextInput
            value={checkPwd}
            onChangeText={setCheckPwd}
            secureTextEntry={true}
            placeholder="비밀번호 확인(재입력)"
            returnKeyType="done"
            onSubmitEditing={signIn}
          />
          <MyTextInput
            value={name}
            onChangeText={setName}
            placeholder="이름"
            returnKeyType="done"
            onSubmitEditing={signIn}
          />
          <MyTextInput
            value={userEmail}
            onChangeText={setUserEmail}
            placeholder="e-mail"
            returnKeyType="done"
            onSubmitEditing={signIn}
            keyboardType="email-address"
          />
          <View>
            <MyButton text="회원가입" onPress={signIn} />
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
