import { useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  Keyboard,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { theme } from "./colors";
import { Icons } from "./icons";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const ICON_BOX_LENGTH = parseInt(Object.keys(Icons).length / 4 + 1);

function AddUser({ navigation }) {
  const iconBox = [];
  for (var i = 1; i < ICON_BOX_LENGTH; i++) {
    iconBox.push(i);
  }
  const [selectedIcon, setSelectedIcon] = useState(
    require("./src/images/userIcon-1.png")
  );
  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback
        onPress={() => {
          navigation.navigate("Login");
        }}
      >
        <View style={styles.userBox}>
          <Image style={styles.userIconImage} source={selectedIcon} />
        </View>
      </TouchableWithoutFeedback>
      <TextInput
        style={styles.inputUsername}
        placeholder="username"
      ></TextInput>
      <View style={styles.pickupUserIcon}>
        <ScrollView
          horizontal
          pagingEnabled
          contentContainerStyle={{ alignItems: "center" }}
        >
          {/* <View style={styles.iconPages}>
            <Image
              style={styles.userIconImage}
              source={require("./src/images/userIcon-1.png")}
            />
            <TouchableWithoutFeedback
              onPress={() => {
                setSelectedIcon(require("./src/images/userIcon-2.png"));
              }}
            >
              <Image
                style={styles.userIconImage}
                source={require("./src/images/userIcon-2.png")}
              />
            </TouchableWithoutFeedback>
            <Image
              style={styles.userIconImage}
              source={require("./src/images/userIcon-3.png")}
            />
            <Image
              style={styles.userIconImage}
              source={require("./src/images/userIcon-4.png")}
            />
          </View>
          <View style={styles.iconPages}>
            <Image
              style={styles.userIconImage}
              source={require("./src/images/userIcon-5.png")}
            />
            <Image
              style={styles.userIconImage}
              source={require("./src/images/userIcon-6.png")}
            />
            <Image
              style={styles.userIconImage}
              source={require("./src/images/userIcon-7.png")}
            />
            <Image
              style={styles.userIconImage}
              source={require("./src/images/userIcon-8.png")}
            />
          </View>
          <View style={styles.iconPages}>
            <Image
              style={styles.userIconImage}
              source={require("./src/images/userIcon-9.png")}
            />
            <Image
              style={styles.userIconImage}
              source={require("./src/images/userIcon-10.png")}
            />
            <Image
              style={styles.userIconImage}
              source={require("./src/images/userIcon-11.png")}
            />
            <Image
              style={styles.userIconImage}
              source={require("./src/images/userIcon-12.png")}
            />
          </View> */}

          {/* idx = 0 부터 시작! */}
          {/* {Object.values(Icons).map((value, idx) => (
            <TouchableWithoutFeedback
              onPress={() => {
                setSelectedIcon(value.src);
              }}
              key={idx}
            >
              <Image
                style={{ width: 50, height: 50, marginRight: 20 }}
                source={value.src}
              />
            </TouchableWithoutFeedback>
          ))} */}

          {/** 정리 필요! */}
          {iconBox.map((value, idx) => (
            <View key={idx} style={styles.iconPages}>
              {Object.values(Icons).map((icon, idx) =>
                Math.ceil(icon.idx / 4) >= value &&
                Math.ceil(icon.idx / 4) < value + 1 ? (
                  <TouchableWithoutFeedback
                    key={idx}
                    onPress={() => {
                      setSelectedIcon(icon.src);
                    }}
                  >
                    <Image
                      style={{ width: 50, height: 50 }}
                      source={icon.src}
                    />
                  </TouchableWithoutFeedback>
                ) : null
              )}
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.baeminBg,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  userBox: {
    width: 75,
    height: 75,
    borderRadius: 15,
    marginBottom: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.grey,
  },
  inputUsername: {
    borderBottomColor: "black",
    borderBottomWidth: 1,
    width: 150,
    fontSize: 18,
    marginBottom: 20,
  },
  pickupUserIcon: {
    width: "100%",
    height: 150,
    borderRadius: 15,
    backgroundColor: theme.ivory,
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
});

export { AddUser };
