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
  TouchableOpacity,
} from "react-native";
import { useEffect, useState } from "react";
import { theme } from "../../colors";
import { Logo } from "../components/Logo";
import { MyButton } from "../components/MyButton";
import { MyTextInput } from "../components/MyTextInput";
import { IP_ADDRESS } from "../../temp/IPAddress";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

function Login({ navigation }) {
  const [userId, setUserId] = useState("");
  const [userPwd, setUserPwd] = useState("");
  const clearAll = () => {
    setUserId("");
    setUserPwd("");
  };
  const checkConnection = async (checkAccountIdx) => {
    let url = IP_ADDRESS + "/mirror/serial";
    url += `?accountIndex=${checkAccountIdx}`;

    const res = await fetch(url);
    const json = await res.json();
    console.log(json);
    if (json.status === 200) {
      console.log("is connect");
    } else {
      console.log("is not connect");
    }
  };
  async function loginWithServer() {
    let url = `${IP_ADDRESS}/account/login`;
    // url += `?id=${userId}&pw=${userPwd}`;
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
    const loginInfo = await res.json();
    return loginInfo;
  }
  const login = async () => {
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
    } else {
      /**
       * @todo 계속 Promise로 반환하는데...
       */
      const loginInfo = await loginWithServer();
      if (loginInfo.status === 200) {
        console.log(loginInfo);
        if (loginInfo.mirrorIdx !== null) {
          navigation.reset({
            routes: [
              {
                name: "UserList",
                params: {
                  accountIdx: loginInfo.Account_idx,
                  mirrorIdx: loginInfo.mirrorIdx,
                },
              },
            ],
          });
        } else {
          navigation.reset({
            routes: [{ name: "ConnectMirrocle", params: loginInfo }],
          });
          // navigation.reset({
          //   routes: [
          //     {
          //       name: "UserList",
          //       params: {
          //         accountIdx: loginInfo.Account_idx,
          //       },
          //     },
          //   ],
          // });
        }
        clearAll();
      } else {
        Alert.alert("로그인 실패", "아이디 혹은 비밀번호 오류입니다.", [
          {
            text: "OK",
          },
        ]);
      }
    }
  };
  const signIn = () => {
    navigation.navigate("SignIn");
    clearAll();
  };
  const findAccount = (mode) => {
    navigation.navigate("FindAccount", { mode });
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
  };
  const loginWithGithub = () => {
    Alert.alert("Log in with github", "success!", [
      {
        text: "OK",
      },
    ]);
    navigation.navigate("ConnectMirrocle");
  };
  const loginWithKakao = () => {
    navigation.navigate("UserEdit");
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
          {/* <View style={styles.socialLogin}>
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
          </View> */}
          <View
            style={{
              marginTop: 20,
              flexDirection: "row",
              justifyContent: "space-around",
            }}
          >
            <TouchableOpacity onPress={() => findAccount("ID")}>
              <Text
                style={{
                  color: theme.IOS__grey,
                  textDecorationLine: "underline",
                }}
              >
                아이디 찾기
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => findAccount("Password")}>
              <Text
                style={{
                  color: theme.IOS__grey,
                  textDecorationLine: "underline",
                }}
              >
                비밀번호 찾기
              </Text>
            </TouchableOpacity>
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
