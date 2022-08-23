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
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { theme } from "./colors";

export default function App() {
  const login = () => {
    Alert.alert("Log in", "success!", [
      {
        text: "OK",
      },
    ]);
  };
  const signIn = () => {
    Alert.alert("Sign in", "success!", [
      {
        text: "OK",
      },
    ]);
  };
  const loginWithGoogle = () => {
    Alert.alert("Log in with Google", "success!", [
      {
        text: "OK",
      },
    ]);
  };
  const loginWithGithub = () => {
    Alert.alert("Log in with github", "success!", [
      {
        text: "OK",
      },
    ]);
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
            style={styles.login}
            placeholder="아이디"
            returnKeyType="done"
          ></TextInput>
          <TextInput
            style={styles.login}
            placeholder="비밀번호"
            secureTextEntry={true}
            returnKeyType="done"
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
    backgroundColor: "#2AC1BC",
    justifyContent: "center",
    paddingHorizontal: 40,
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
