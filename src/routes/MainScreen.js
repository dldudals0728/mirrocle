import { StatusBar } from "expo-status-bar";
import {
  Alert,
  Animated,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useEffect, useRef, useState } from "react";
import { Octicons } from "@expo/vector-icons";
import { Logo } from "../components/Logo";
import { MyButton } from "../components/MyButton";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");
const CONTAINER_HORIZONTAL_PADDING = 20;

function MainScreen({ navigation }) {
  const scrollX = useRef(new Animated.Value(0)).current;
  const [mirrorList, setMirrorList] = useState([]);
  const [page, setPage] = useState(0);
  const test = (event) => {
    setPage(event.nativeEvent.contentOffset.x);
  };
  useEffect(() => {
    setMirrorList([0, 1, 2]);
  }, []);
  const addEditWidget = () => {
    Alert.alert("add/edit widget", "go to next window", [
      {
        text: "OK",
      },
    ]);
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
          size={14}
          style={{
            marginLeft: 18,
            opacity: 0.5,
          }}
        />
        <Octicons
          name={page > 100 && page < 600 ? "dot" : "dot-fill"}
          size={14}
          style={{
            marginLeft: 18,
            opacity: 0.5,
          }}
        />
        <Octicons
          name={page >= 600 ? "dot" : "dot-fill"}
          size={14}
          style={{
            marginLeft: 18,
            opacity: 0.5,
          }}
        />
      </View>
      <View style={{ width: "100%" }}>
        <MyButton text="Edit Your Mirrocle!" onPress={addEditWidget} />
      </View>
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
    height: SCREEN_HEIGHT - 200,
    backgroundColor: "teal",
    borderRadius: 5,
  },

  scrollStyle: {},

  indicatorContainer: {
    flexDirection: "row",
  },
});

export { MainScreen };
