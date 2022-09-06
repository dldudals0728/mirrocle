import { StatusBar } from "expo-status-bar";
import {
  Alert,
  Animated,
  Dimensions,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useEffect, useState } from "react";
import { Octicons } from "@expo/vector-icons";
import { Logo } from "../components/Logo";
import { MyButton } from "../components/MyButton";
import { theme } from "../../colors";
import { Widgets } from "./Widgets";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");
const CONTAINER_HORIZONTAL_PADDING = 20;

function MainScreen({ navigation }) {
  const [mirrorList, setMirrorList] = useState([]);
  const [page, setPage] = useState(0);
  const [menuVisible, setMenuVisible] = useState(false);
  const [widgetVisible, setWidgetVisible] = useState(false);
  const paging = (event) => {
    setPage(event.nativeEvent.contentOffset.x);
  };
  useEffect(() => {
    setMirrorList([0, 1, 2]);
  }, []);
  return (
    <View style={styles.container}>
      <Modal
        visible={widgetVisible}
        animationType="animated"
        onRequestClose={() => console.log("test")}
        transparent={true}
      >
        <View style={styles.widgetContainer}>
          <View style={styles.widgetController}></View>
          {/* setVisible: 이게되네 */}
          <Widgets navigation={navigation} setVisible={setWidgetVisible} />
          <MyButton
            text="close"
            onPress={() => setWidgetVisible(!widgetVisible)}
          />
        </View>
      </Modal>
      <Modal
        visible={menuVisible}
        animationType="fade"
        onRequestClose={() => console.log("menu test")}
        transparent={true}
      >
        <Pressable
          style={{
            flex: 1,
            backgroundColor: "transparent",
          }}
          onPress={() => setMenuVisible(!menuVisible)}
        />
        <View style={styles.menuContainer}>
          <View style={styles.menuWrapper}>
            <View style={styles.menuList}>
              <TouchableOpacity
                onPress={() => {
                  // 모달을 두 개 이상 띄울 수 없다. 닫고 띄우기
                  setMenuVisible(!menuVisible);
                  setWidgetVisible(!widgetVisible);
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
      </Modal>
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
          onMomentumScrollEnd={paging}
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
        onPress={() => setMenuVisible(!menuVisible)}
        style={{
          backgroundColor: menuVisible ? "skyblue" : "aliceblue",
          width: 75,
          height: 75,
          borderRadius: "50%",
          position: "absolute",
          right: 30,
          bottom: 30,
          borderWidth: 5,
          borderColor: menuVisible ? "aliceblue" : "skyblue",
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
            style={{
              fontSize: 60,
              color: menuVisible ? "aliceblue" : "skyblue",
            }}
          >
            +
          </Text>
        </View>
      </TouchableOpacity>
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

  widgetContainer: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    marginTop: 60,
    backgroundColor: "rgba(40, 40, 40, 0.9)",
    borderRadius: 25,
  },

  widgetController: {
    backgroundColor: "grey",
    width: "20%",
    height: 5,
    borderRadius: 20,
    marginVertical: 10,
  },

  menuContainer: {
    position: "absolute",
    right: 10,
    bottom: 110,
    height: "40%",
    width: "50%",
  },

  menuWrapper: {
    height: "100%",
    justifyContent: "flex-end",
  },

  menuList: {
    height: "100%",
    justifyContent: "space-around",
    backgroundColor: "aliceblue",
    borderRadius: 20,
    paddingLeft: 15,
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
