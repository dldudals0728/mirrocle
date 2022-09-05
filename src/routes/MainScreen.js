import { StatusBar } from "expo-status-bar";
import {
  Alert,
  Animated,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useEffect, useRef, useState } from "react";
import { Octicons } from "@expo/vector-icons";
import { Logo } from "../components/Logo";
import { MyButton } from "../components/MyButton";
import { theme } from "../../colors";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");
const CONTAINER_HORIZONTAL_PADDING = 20;

function MainScreen({ navigation }) {
  const scrollX = useRef(new Animated.Value(0)).current;
  const [mirrorList, setMirrorList] = useState([]);
  const [page, setPage] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const test = (event) => {
    setPage(event.nativeEvent.contentOffset.x);
  };
  useEffect(() => {
    setMirrorList([0, 1, 2]);
  }, []);
  const openMenu = () => {
    menuOpen ? setMenuOpen(false) : setMenuOpen(true);
  };
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Logo imageSize={40} titleSize={15} subTextSize={8} />
        <View>
          <Text style={styles.username}>username</Text>
        </View>
      </View>
      <View style={styles.scrollContainer}>
        <ScrollView
          pagingEnabled
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollStyle}
          onMomentumScrollEnd={test}
          // in README
          scrollEventThrottle={0}
        >
          {mirrorList.map((mirror, idx) => {
            return (
              <View key={idx} style={styles.mirror}>
                <Text style={{ fontSize: 40 }}>화면 {mirror}</Text>
              </View>
            );
          })}
        </ScrollView>
      </View>
      <View style={styles.indicatorContainer}>
        <Octicons
          name={page <= 100 ? "dot" : "dot-fill"}
          style={styles.indicator}
        />
        <Octicons
          name={page > 100 && page < 600 ? "dot" : "dot-fill"}
          style={styles.indicator}
        />
        <Octicons
          name={page >= 600 ? "dot" : "dot-fill"}
          style={styles.indicator}
        />
      </View>
      <TouchableOpacity
        onPress={openMenu}
        style={{
          backgroundColor: menuOpen ? "skyblue" : "aliceblue",
          width: 75,
          height: 75,
          borderRadius: "50%",
          position: "absolute",
          right: 30,
          bottom: 30,
          borderWidth: 5,
          borderColor: menuOpen ? "aliceblue" : "skyblue",
        }}
      >
        <View
          style={{
            width: "100%",
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
            marginTop: -6,
          }}
        >
          <Text
            style={{ fontSize: 60, color: menuOpen ? "aliceblue" : "skyblue" }}
          >
            +
          </Text>
        </View>
      </TouchableOpacity>
      {menuOpen ? (
        <View
          style={{
            position: "absolute",
            right: 10,
            bottom: 110,
            height: "80%",
            width: "50%",
          }}
        >
          <View
            style={{
              height: "100%",
              justifyContent: "flex-end",
            }}
          >
            <View
              style={{
                height: "50%",
                justifyContent: "space-around",
                backgroundColor: "aliceblue",
                borderRadius: 20,
                paddingLeft: 15,
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("Widgets");
                  setMenuOpen(false);
                }}
              >
                <Text style={{ fontSize: 18 }}>위젯 편집</Text>
              </TouchableOpacity>
              <TouchableOpacity>
                <Text style={{ fontSize: 18 }}>사용자 정보 수정</Text>
              </TouchableOpacity>
              <TouchableOpacity>
                <Text style={{ fontSize: 18 }}>템플릿 리스트</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ) : null}

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2AC1BC",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingHorizontal: CONTAINER_HORIZONTAL_PADDING,
    paddingTop: 50,
  },

  header: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },

  username: {
    fontSize: 15,
  },

  mirror: {
    width: SCREEN_WIDTH - CONTAINER_HORIZONTAL_PADDING * 2,
    backgroundColor: "white",
    marginVertical: 10,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },

  scrollContainer: {
    height: SCREEN_HEIGHT - 100,
    borderRadius: 5,
  },

  scrollStyle: {},

  indicatorContainer: {
    flexDirection: "row",
    position: "relative",
    top: -50,
  },

  indicator: {
    fontSize: 14,
    marginLeft: 18,
    opacity: 0.5,
  },
});

export { MainScreen };
