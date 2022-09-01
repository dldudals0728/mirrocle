import { StatusBar } from "expo-status-bar";
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
  Keyboard,
  Alert,
} from "react-native";
import { theme } from "./colors";
import { useState } from "react";
import { Logo } from "./src/components/Logo";

function Login({ navigation }) {
  const [userId, setUserId] = useState("");
  const [userPwd, setUserPwd] = useState("");
  const onChangeUserId = (payload) => setUserId(payload);
  const onChangeUserPwd = (payload) => setUserPwd(payload);
  const login = () => {
    // 사용자 인증 : User Authentication
    userId === "root" && userPwd === "1234"
      ? Alert.alert("로그인", "success!", [
          {
            text: "OK",
          },
        ])
      : Alert.alert("로그인 실패", "아이디 혹은 비밀번호 오류입니다.", [
          {
            text: "OK",
          },
        ]);

    userId === "root" && userPwd === "1234"
      ? navigation.navigate("UserList")
      : null;
  };
  const signIn = () => {
    navigation.navigate("SignIn");
  };
  const loginWithGoogle = () => {
    Alert.alert("Log in with Google", "success!", [
      {
        text: "OK",
      },
    ]);
    navigation.navigate("AddUser");
  };
  const loginWithGithub = () => {
    Alert.alert("Log in with github", "success!", [
      {
        text: "OK",
      },
    ]);
    navigation.navigate("Connection");
  };
  const loginWithKakao = () => {
    Alert.alert("Log in with kakao", "success!", [
      {
        text: "OK",
      },
    ]);
  };
  const loginWithMeta = () => {
    Alert.alert("Log in with Meta", "success!", [
      {
        text: "OK",
      },
    ]);
  };
  return (
    // TouchableWithoutFeedback onPress={Keyboard.dismiss}으로 View(container)를 감쌀 시, 빈 공간을 터치하면 키보드가 내려간다!
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <View style={styles.loginInputContainer}>
          <Logo titleSize={30} style={styles.logoStyle} />
          <TextInput
            style={styles.login}
            placeholder="아이디"
            returnKeyType="done"
            onChangeText={onChangeUserId}
            value={userId}
          ></TextInput>
          <TextInput
            style={styles.login}
            placeholder="비밀번호"
            secureTextEntry={true}
            returnKeyType="done"
            onChangeText={onChangeUserPwd}
            value={userPwd}
          ></TextInput>
        </View>
        <View style={styles.loginBtnContainer}>
          <TouchableWithoutFeedback onPress={login}>
            <View style={styles.loginBtn}>
              <Text style={styles.loginText}>로그인</Text>
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback onPress={signIn}>
            <View style={styles.loginBtn}>
              <Text style={styles.loginText}>회원가입</Text>
            </View>
          </TouchableWithoutFeedback>
          <View style={styles.socialLogin}>
            <View style={styles.social__col}>
              <TouchableWithoutFeedback onPress={loginWithGoogle}>
                <View
                  style={{
                    ...styles.socialBtn,
                    backgroundColor: theme.googleBg,
                  }}
                >
                  <Image
                    style={styles.logo}
                    source={require("./src/images/google-icon.png")}
                  />
                  <Text
                    style={{ ...styles.socialText, color: theme.googleColor }}
                  >
                    google
                  </Text>
                </View>
              </TouchableWithoutFeedback>
              <TouchableWithoutFeedback onPress={loginWithGithub}>
                <View
                  style={{
                    ...styles.socialBtn,
                    backgroundColor: theme.githubBg,
                  }}
                >
                  <Image
                    style={styles.logo}
                    source={require("./src/images/github-icon.png")}
                  />
                  <Text
                    style={{ ...styles.socialText, color: theme.githubColor }}
                  >
                    github
                  </Text>
                </View>
              </TouchableWithoutFeedback>
            </View>
            <View style={styles.social__col}>
              <TouchableWithoutFeedback onPress={loginWithKakao}>
                <View
                  style={{
                    ...styles.socialBtn,
                    backgroundColor: theme.kakaoBg,
                  }}
                >
                  <Image
                    style={styles.logo}
                    source={require("./src/images/kakao-icon.png")}
                  />
                  <Text
                    style={{ ...styles.socialText, color: theme.kakaoColor }}
                  >
                    kakao
                  </Text>
                </View>
              </TouchableWithoutFeedback>
              <TouchableWithoutFeedback onPress={loginWithMeta}>
                <View
                  style={{ ...styles.socialBtn, backgroundColor: theme.MetaBg }}
                >
                  <Image
                    style={styles.logo}
                    source={require("./src/images/meta-icon.png")}
                  />
                  <Text
                    style={{ ...styles.socialText, color: theme.MetaColor }}
                  >
                    Meta
                  </Text>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </View>
        </View>
        <StatusBar style="auto" />
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

  logoStyle: {
    marginBottom: 20,
  },

  loginInputContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },

  login: {
    fontSize: 16,
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderRadius: 10,
    marginBottom: 20,
  },

  loginBtnContainer: {
    flex: 1,
  },

  loginBtn: {
    textAlign: "center",
    alignItems: "center",
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderRadius: 10,
    marginBottom: 20,
    borderStyle: "solid",
    borderColor: "black",
    borderWidth: 1,
  },

  loginText: {
    fontSize: 16,
    fontWeight: "700",
  },

  socialLogin: {},

  social__col: {
    flexDirection: "row",
    justifyContent: "space-around",
  },

  socialBtn: {
    flexDirection: "row",
    width: 150,
    height: 50,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: 5,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },

  socialText: {
    fontSize: 20,
    fontWeight: "600",
  },

  logo: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
});

export { Login };
