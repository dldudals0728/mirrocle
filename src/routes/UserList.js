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
import { useEffect, useState } from "react";
import { AntDesign } from "@expo/vector-icons";
import { Fontisto } from "@expo/vector-icons";
import { Logo } from "../components/Logo";
import { MyButton } from "../components/MyButton";
import { theme } from "../../colors";
import { Icons } from "../../icons";
import { IP_ADDRESS } from "../../temp/IPAddress";
import { useIsFocused } from "@react-navigation/native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

function UserList({ navigation, route }) {
  const isFocused = useIsFocused();
  /**
   * @todo 유저 정보를 수정할 수 있도록 버튼 또는 네비게이션 제공
   * @todo 등록된 프리셋이 없다 ? (프리셋을 등록해 보세요 alert; AddUser) : null
   */

  // const accountIdx = route.params.accountIdx;
  const { accountIdx } = route.params;

  const userColList = [0, 0];
  const [userList, setUserList] = useState([]);

  useEffect(() => {
    getUserListFromServer();
  }, [isFocused]);

  async function getUserListFromServer() {
    /**
     * userIdx, userId, userImg, userTemplate, accountIdx
     */
    let url = `${IP_ADDRESS}/user/allselect`;
    url += `?accountIdx=${accountIdx}`;
    const res = await fetch(url);
    const userList = await res.json();
    const newUserList = [...userList];
    for (let i = newUserList.length; i < 4; i++) {
      newUserList.push({
        userIdx: null,
      });
    }
    setUserList(newUserList);
  }

  const gotoUser = (username, userIdx) => {
    navigation.navigate("MainScreen", {
      accountIdx,
      userIdx,
      username,
    });
  };
  const addUser = () => {
    navigation.navigate("AddUser", {
      accountIdx,
    });
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
          const colList = userList.slice(idx * 2, idx * 2 + 2);
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
                        gotoUser(value.userId, value.userIdx);
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
                        <Text style={styles.userText}>{value.userId}</Text>
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
          onPress={() =>
            navigation.navigate("MirrocleSettings", { accountIdx })
          }
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
