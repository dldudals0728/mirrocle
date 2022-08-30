import {
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
  Keyboard,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { theme } from "./colors";
import { useEffect, useState } from "react";

function SignIn({ navigation }) {
  const [userId, setUserId] = useState("");
  const [userPwd, setUserPwd] = useState("");
  const [checkPwd, setCheckPwd] = useState("");
  const goHome = () => {
    navigation.goBack();
  };
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <View style={styles.SignInContainer}>
          <View style={styles.banner}>
            <MaterialCommunityIcons
              name="mirror-rectangle"
              size={100}
              color="black"
            />
            <View>
              <Text>Smart Mirror</Text>
              <Text style={styles.bannerText}>Mirrocle</Text>
            </View>
          </View>
          <TextInput
            value={userId}
            onChangeText={setUserId}
            style={styles.singin}
            placeholder="아이디 입력"
            returnKeyType="done"
          ></TextInput>
          <TextInput
            value={setUserPwd}
            onChangeText={userPwd}
            style={styles.singin}
            placeholder="비밀번호 입력"
            returnKeyType="done"
          ></TextInput>
          <TextInput
            value={checkPwd}
            onChangeText={setCheckPwd}
            style={styles.singin}
            placeholder="비밀번호 확인(재입력)"
            returnKeyType="done"
          ></TextInput>
          <View style={styles.SignInBtnContainer}>
            <TouchableWithoutFeedback onPress={goHome}>
              <View style={styles.SingInBtn}>
                <Text style={styles.SingInBtnText}>돌아가기</Text>
              </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback>
              <View style={styles.SingInBtn}>
                <Text style={styles.SingInBtnText}>회원가입</Text>
              </View>
            </TouchableWithoutFeedback>
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
  singin: {
    fontSize: 16,
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  banner: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-end",
    marginBottom: 20,
  },
  bannerText: {
    fontSize: 30,
    fontWeight: "700",
  },
  SingInBtn: {
    textAlign: "center",
    alignItems: "center",
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginBottom: 20,
    borderStyle: "solid",
    borderColor: "black",
    borderWidth: 1,
  },

  SingInBtnText: {
    fontSize: 16,
    fontWeight: "700",
  },
});

export { SignIn };
