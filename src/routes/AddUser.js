import { useState, useEffect } from "react";
import {
  Alert,
  Dimensions,
  Image,
  Keyboard,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
  View,
  TouchableOpacity,
  Text,
} from "react-native";
import { theme } from "../../colors";
import { Icons } from "../../icons";
import { IP_ADDRESS } from "../../temp/IPAddress";
import { MyButton } from "../components/MyButton";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const ICON_BOX_LENGTH = parseInt(Object.keys(Icons).length / 4 + 1);

function AddUser({ navigation, route }) {
  const { accountIdx } = route.params;
  const [isfromedit, setIsFromEdit] = useState();
  const [username, setUsername] = useState("");
  const iconBox = [];
  for (var i = 1; i < ICON_BOX_LENGTH; i++) {
    iconBox.push(i);
  }
  const [selectedIcon, setSelectedIcon] = useState(
    require("../images/userIcon-1.png")
  );
  const [iconKey, setIconKey] = useState("icon__1");

  const addUserWithServer = async () => {
    let url = `${IP_ADDRESS}/user/create`;
    url += `?userId=${username}&accountIdx=${accountIdx}&userImage=${iconKey}`;
    await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: username,
        accountIdx: accountIdx,
        userImage: iconKey,
      }),
    });
  };

  const addUser = async () => {
    if (username === "") {
      Alert.alert("유저 이름 입력", "사용자의 이름을 설정해주세요.", [
        {
          text: "OK",
        },
      ]);
      return;
    }
    /**
     * @todo 해당 유저를 계정에 연결시킨다.
     */
    await addUserWithServer();
    Alert.alert("사용자 생성", "사용자가 생성되었습니다.", [
      {
        text: "OK",
      },
    ]);
    navigation.reset({
      routes: [
        {
          name: "UserList",
          params: {
            accountIdx,
          },
        },
      ],
    });
  };
  const checkroute = () => {
    const route = navigation.getState().routes;
    const pop = route.map((hi) => hi.name);
    if (pop[parseInt(pop.length) - 2] == "UserEdit") {
      setIsFromEdit(true);
    } else {
      setIsFromEdit(false);
    }
  };
  useEffect(checkroute, []);

  useEffect(() => console.log(iconKey), [iconKey]);

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{ alignItems: "center" }}>
          <View style={styles.userBox}>
            <Image style={styles.userIconImage} source={selectedIcon} />
          </View>
          <TextInput
            style={styles.inputUsername}
            placeholder="username"
            textAlign="center"
            value={username}
            onChangeText={setUsername}
          ></TextInput>
        </View>
      </TouchableWithoutFeedback>
      <View style={styles.pickupUserIcon}>
        <ScrollView
          horizontal
          pagingEnabled
          contentContainerStyle={{ alignItems: "center" }}
        >
          {/** 정리 필요! */}
          {iconBox.map((value, idx) => (
            <View key={idx} style={styles.iconPages}>
              {Object.keys(Icons).map((iconKey, idx) =>
                Math.ceil(Icons[iconKey].idx / 4) >= value &&
                Math.ceil(Icons[iconKey].idx / 4) < value + 1 ? (
                  <TouchableWithoutFeedback
                    key={idx}
                    onPress={() => {
                      setSelectedIcon(Icons[iconKey].src);
                      setIconKey(iconKey);
                    }}
                  >
                    <Image
                      style={{ width: 50, height: 50 }}
                      source={Icons[iconKey].src}
                    />
                  </TouchableWithoutFeedback>
                ) : null
              )}
            </View>
          ))}
        </ScrollView>
      </View>
      <MyButton
        style={{ marginTop: 20 }}
        text={isfromedit ? "수정완료" : "추가"}
        onPress={addUser}
      />
      <TouchableOpacity>
        <View
          style={{ ...styles.btnStyle, display: isfromedit ? "flex" : "none" }}
        >
          <Text style={styles.btnTextStyle}>삭제하기</Text>
        </View>
      </TouchableOpacity>

      <MyButton
        text="돌아가기"
        onPress={() => {
          navigation.pop();
        }}
      />
    </View>
  );
}

styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.baeminBg,
    justifyContent: "center",
    paddingHorizontal: 40,
  },

  userBox: {
    width: 75,
    height: 75,
    borderRadius: 15,
    marginBottom: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.githubWhite,
  },

  inputUsername: {
    borderBottomColor: "black",
    borderBottomWidth: 1,
    width: 150,
    fontSize: 18,
    marginBottom: 20,
    paddingBottom: 5,
  },

  pickupUserIcon: {
    height: 150,
    borderRadius: 15,
    backgroundColor: theme.githubWhite,
  },

  iconPages: {
    flexDirection: "row",
    width: SCREEN_WIDTH - 80,
    justifyContent: "space-around",
  },

  userIcon: {
    flexDirection: "row",
  },

  userIconImage: {
    width: 50,
    height: 50,
  },
  btnStyle: {
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
    backgroundColor: theme.baeminBg,
  },

  btnTextStyle: {
    fontSize: 16,
    fontWeight: "700",
  },
});

export { AddUser };
