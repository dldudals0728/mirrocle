import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { useEffect, useState } from "react";
import { Logo } from "../components/Logo";
import { MyButton } from "../components/MyButton";
import { Icons } from "../../icons";
import { IP_ADDRESS } from "../../temp/IPAddress";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

function UserEdit({ navigation, route }) {
  const { accountIdx } = route.params;
  const [userList, setUserList] = useState([]);

  const getUserList = async () => {
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
  };

  const deleteUserWithServer = async (userIdx) => {
    let url = `${IP_ADDRESS}/user/delete`;
    url += `?accountIdx=${accountIdx}&userIdx=${userIdx}`;
    await fetch(url, {
      method: "DELETE",
    });
  };

  const editUser = (idx) => {
    const user = userList[idx];
    navigation.navigate("AddUser", { user });
  };
  const deleteUser = (idx) => {
    Alert.alert("사용자 삭제", "선택한 사용자를 삭제하시겠습니까?", [
      {
        text: "cancel",
      },
      {
        text: "OK",
        onPress: () => {
          deleteUserWithServer(userList[idx].userIdx);
          const newUserList = [...userList];
          delete newUserList[idx];
          newUserList.push({ userIdx: null });
          setUserList(newUserList);
          Alert.alert("완료", "사용자가 삭제되었습니다.", [
            {
              text: "OK",
            },
          ]);
        },
      },
    ]);
  };

  useEffect(() => {
    getUserList();
  }, []);
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Logo titleSize={30} style={styles.logoStyle} />
      <View style={styles.list_container}>
        {userList.map((value, idx) =>
          value.userIdx ? (
            <View key={idx} style={styles.user}>
              <Image
                style={styles.userlogo}
                source={Icons[value.userImage].src}
              />
              <Text style={styles.username}>{value.userId}</Text>
              <TouchableOpacity>
                <Text style={styles.btnstyle} onPress={() => editUser(idx)}>
                  수정
                </Text>
              </TouchableOpacity>
              <TouchableOpacity>
                <Text
                  style={{
                    ...styles.btnstyle,
                    borderColor: "red",
                    color: "red",
                  }}
                  onPress={() => deleteUser(idx)}
                >
                  삭제
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View
              key={idx}
              style={{ ...styles.user, backgroundColor: "#404040" }}
            >
              <Text style={{ fontSize: 18, fontWeight: "600", color: "white" }}>
                사용자가 존재하지 않습니다!
              </Text>
            </View>
          )
        )}
      </View>
      <MyButton
        text="돌아가기"
        style={{ marginTop: 40 }}
        onPress={() => {
          // navigation.reset({
          //   routes: [
          //     {
          //       name: "UserList",
          //       params: {
          //         accountIdx,
          //       },
          //     },
          //   ],
          // });
          navigation.pop();
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2AC1BC",
    justifyContent: "center",
    paddingHorizontal: 40,
  },
  logoStyle: {
    marginBottom: 20,
  },
  list_container: {
    justifyContent: "center",
  },
  user: {
    height: SCREEN_HEIGHT / 10,
    marginVertical: 10,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderStyle: "solid",
    borderColor: "black",
    borderWidth: 2,
    borderRadius: 10,
    backgroundColor: "#F0F0F0",
  },
  userlogo: {
    width: "15%",
    height: "60%",
    marginLeft: 5,
  },
  username: {
    width: "40%",
    fontSize: 22,
    justifyContent: "center",
    marginHorizontal: 5,
  },
  btnstyle: {
    width: SCREEN_WIDTH / 8,
    borderStyle: "solid",
    borderColor: "black",
    borderWidth: 2,
    borderRadius: 10,
    fontSize: 16,
    fontWeight: "600",
    marginHorizontal: 5,
    textAlign: "center",
  },
  empty: {
    backgroundColor: "#808080",
  },
});

export { UserEdit };
