import { StatusBar } from "expo-status-bar";
import {
  Image,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
  Keyboard,
  Alert,
  Dimensions,
} from "react-native";
import { useState } from "react";
import { theme } from "../../colors";
import { Logo } from "../components/Logo";
import { MyButton } from "../components/MyButton";
import { MyTextInput } from "../components/MyTextInput";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

function Login({ navigation }) {
  const [userId, setUserId] = useState("");
  const [userPwd, setUserPwd] = useState("");
  const clearAll = () => {
    setUserId("");
    setUserPwd("");
  };
  const login = () => {
    // 사용자 인증 : User Authentication
    if (userId === "" || userPwd === "") {
      Alert.alert(
        "아이디 비밀번호 입력",
        "아이디 비밀번호를 모두 입력해주세요.",
        [
          {
            text: "OK",
          },
        ]
      );
    } else if (userId === "root" && userPwd === "1234") {
      /**
       * @todo 계정이 DB에 있다 ? (계정과 연결된 Mirrocle이 있다 ? UserList : ConnectMirrocle) : 아이디 혹은 비밀번호 오류
       */
      navigation.navigate("UserList");
      clearAll();
    } else {
      Alert.alert("로그인 실패", "아이디 혹은 비밀번호 오류입니다.", [
        {
          text: "OK",
        },
      ]);
    }
  };
  const signIn = () => {
    navigation.navigate("SignIn");
    clearAll();
  };
  const loginWithGoogle = () => {
    /**
     * @todo 소셜 계정 인증 ? SignIn : 인증이 완료되지 않았습니다.
     */
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
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <View style={styles.loginInputContainer}>
          <Logo titleSize={30} style={styles.logoStyle} />
          <MyTextInput
            placeholder="아이디"
            returnKeyType="done"
            onChangeText={setUserId}
            value={userId}
            onSubmitEditing={login}
          />
          <MyTextInput
            placeholder="비밀번호"
            secureTextEntry={true}
            returnKeyType="done"
            onChangeText={setUserPwd}
            value={userPwd}
            onSubmitEditing={login}
          ></MyTextInput>
        </View>
        <View style={styles.loginBtnContainer}>
          <MyButton text="로그인" onPress={login} />
          <MyButton text="회원가입" onPress={signIn} />
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
                    source={require("../images/google-icon.png")}
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
                    source={require("../images/github-icon.png")}
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
                    source={require("../images/kakao-icon.png")}
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
                    source={require("../images/meta-icon.png")}
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

  loginBtnContainer: {
    flex: 1,
  },

  socialLogin: {},

  social__col: {
    flexDirection: "row",
    justifyContent: "space-around",
  },

  socialBtn: {
    flexDirection: "row",
    width: SCREEN_WIDTH / 2.7,
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
