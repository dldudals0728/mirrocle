import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  Image,
} from "react-native";
import { useState } from "react";
import { Logo } from "../components/Logo";
import { MyButton } from "../components/MyButton";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

function UserEdit({ navigation }) {
  const deleteUser = () => {
    /**
     * @todo DB와 연동해서 해당 user 계정 레코드 삭제
     */
    console.log("ㅎㅇ");
  };
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Logo titleSize={30} style={styles.logoStyle} />
      <View style={styles.list_container}>
        <View style={styles.user}>
          <Image
            style={styles.userlogo}
            source={require("../images/userIcon-1.png")}
          />
          <Text style={styles.username}>user1</Text>
          <TouchableOpacity>
            <Text
              style={styles.btnstyle}
              onPress={() => navigation.navigate("AddUser")}
            >
              수정
            </Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text
              style={{ ...styles.btnstyle, borderColor: "red", color: "red" }}
              onPress={() => deleteUser()}
            >
              삭제
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.user}>
          <Image
            style={styles.userlogo}
            source={require("../images/userIcon-2.png")}
          />
          <Text style={styles.username}>user2</Text>
          <TouchableOpacity>
            <Text
              style={styles.btnstyle}
              onPress={() => navigation.navigate("AddUser")}
            >
              수정
            </Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text
              style={{ ...styles.btnstyle, borderColor: "red", color: "red" }}
              onPress={() => deleteUser()}
            >
              삭제
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.user}>
          <Image
            style={styles.userlogo}
            source={require("../images/userIcon-3.png")}
          />
          <Text style={styles.username}>user3</Text>
          <TouchableOpacity>
            <Text
              style={styles.btnstyle}
              onPress={() => navigation.navigate("AddUser")}
            >
              수정
            </Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text
              style={{ ...styles.btnstyle, borderColor: "red", color: "red" }}
              onPress={() => deleteUser()}
            >
              삭제
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <MyButton
        text="돌아가기"
        style={{ marginTop: 40 }}
        onPress={() => {
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
    backgroundColor: "gainsboro",
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
    borderWidth: 1,
    borderRadius: 10,
    fontSize: 18,
    marginHorizontal: 5,
    textAlign: "center",
  },
});

export { UserEdit };
