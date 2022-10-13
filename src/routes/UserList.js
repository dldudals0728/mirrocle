import { StatusBar } from "expo-status-bar";
import {
  Alert,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
  Dimensions,
  Image,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { Fontisto } from "@expo/vector-icons";
import { Logo } from "../components/Logo";
import { MyButton } from "../components/MyButton";
import { theme } from "../../colors";
import { Icons } from "../../icons";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

function UserList({ navigation, route }) {
  /**
   * @todo 유저 정보를 수정할 수 있도록 버튼 또는 네비게이션 제공
   * @todo 등록된 프리셋이 없다 ? (프리셋을 등록해 보세요 alert; AddUser) : null
   */
  console.log(route.params);

  const userColList = [0, 0];
  const userMaxList = [
    { userIdx: 0, userName: "Root", userImage: "icon__1", userAPI: "" },
    { userIdx: 1, userName: "admin", userImage: "icon__2", userAPI: "" },
    { userIdx: null },
    { userIdx: null },
  ];

  async function getUserListFromServer() {
    let url = `${IP_ADDRESS}/user/login`;
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
    const loginInfo = await res.json();
    console.log(loginInfo);
    return loginInfo;
  }

  const gotoUser = (username, userIdx) => {
    navigation.navigate("MainScreen", {
      username,
      userIdx,
    });
  };
  const addUser = () => {
    Alert.alert("add user", "Do you want add user?", [
      {
        text: "cancel",
      },
      {
        text: "I'm Sure",
        onPress: () => {
          navigation.navigate("AddUser");
        },
      },
    ]);
  };
  const payUser = () => {
    Alert.alert("pay for additional user", "Do you want pay for add user?", [
      {
        text: "cancel",
      },
      {
        text: "I'm Sure",
        onPress: () => {
          Alert.alert("payment", "success!", [
            {
              text: "OK",
            },
          ]);
        },
      },
    ]);
  };
  return (
    <View style={styles.container}>
      <Logo titleSize={30} style={styles.logoStyle} />
      <View style={styles.userContainer}>
        {userColList.map((value, idx) => {
          const colList = userMaxList.slice(idx * 2, idx * 2 + 2);
          return (
            <View style={styles.userContainer__col} key={idx}>
              {colList.map((value, idx) => {
                const isNull = value.userIdx === null;
                return (
                  <TouchableWithoutFeedback
                    onPress={() => {
                      // isNull ? addUser : gotoUser
                      if (isNull) {
                        addUser();
                      } else {
                        gotoUser(value.userName, value.userIdx);
                      }
                    }}
                    key={idx}
                  >
                    <View
                      style={{
                        ...styles.userBox,
                        backgroundColor: isNull ? "#3A3D40" : "#F0F0F0",
                      }}
                    >
                      {isNull ? (
                        <AntDesign
                          name={isNull ? "pluscircle" : "user"}
                          size={100}
                          color="black"
                          style={
                            isNull ? styles.emptyUser : styles.userCharacter
                          }
                        />
                      ) : (
                        <Image
                          style={{ width: 90, height: 90 }}
                          source={Icons[value.userImage].src}
                        />
                      )}
                      {isNull ? null : (
                        <Text style={styles.userText}>{value.userName}</Text>
                      )}
                    </View>
                  </TouchableWithoutFeedback>
                );
              })}
            </View>
          );
        })}
        {/* <View style={styles.userContainer__col}>
          <TouchableWithoutFeedback onPress={gotoUser}>
            <View style={{ ...styles.userBox, backgroundColor: "#CCCCCC" }}>
              <AntDesign
                name="user"
                size={100}
                color="black"
                style={styles.userCharacter}
              />
              <Text style={styles.userText}>user2</Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
        <View style={styles.userContainer__col}>
          <TouchableWithoutFeedback onPress={addUser}>
            <View style={{ ...styles.userBox, backgroundColor: "#3A3D40" }}>
              <AntDesign
                name="pluscircle"
                color="black"
                style={styles.emptyUser}
              />
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback onPress={payUser}>
            <View style={{ ...styles.userBox, backgroundColor: "#3A3D40" }}>
              <Fontisto name="dollar" style={styles.paidUser} />
              <Text style={styles.payText}>6.99$</Text>
            </View>
          </TouchableWithoutFeedback>
        </View> */}
      </View>
      <View style={{ width: "100%" }}>
        <MyButton
          text="Mirrocle Settings"
          onPress={() => navigation.navigate("MirrocleSettings")}
        />
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.baeminBg,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },

  logoStyle: {
    marginBottom: 40,
  },

  userContainer: { paddingBottom: 20 },

  userContainer__col: {
    flexDirection: "row",
    justifyContent: "center",
  },

  userCharacter: {
    fontSize: 90,
    paddingBottom: 18,
  },

  userText: {
    fontSize: 20,
    fontWeight: "600",
  },

  emptyUser: {
    fontSize: 90,
    paddingVertical: 20,
    color: "white",
  },

  paidUser: {
    fontSize: 90,
    paddingVertical: 10,
    paddingHorizontal: 24,
    color: "white",
  },

  payText: {
    fontSize: 20,
    fontWeight: "600",
    color: "white",
  },

  userBox: {
    borderRadius: 5,
    borderWidth: 2,
    paddingHorizontal: 30,
    paddingVertical: 10,
    marginHorizontal: 10,
    marginVertical: 10,
    justifyContent: "center",
    alignItems: "center",
  },
});

export { UserList };
