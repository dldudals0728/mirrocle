import { StatusBar } from "expo-status-bar";
import {
  Alert,
  Animated,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useEffect, useRef, useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Octicons } from "@expo/vector-icons";

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
        <View style={styles.banner}>
          <MaterialCommunityIcons
            name="mirror-rectangle"
            size={40}
            color="black"
          />
          <View>
            <Text style={styles.bannerSubText}>Smart Mirror</Text>
            <Text style={styles.bannerText}>Mirrocle</Text>
          </View>
        </View>
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
          name={page < 349 ? "dot" : "dot-fill"}
          size={12}
          color="black"
          style={{
            display: "absolute",
            top: -50,
            marginLeft: 18,
            opacity: 0.5,
          }}
        />
        <Octicons
          name={page >= 350 && page < 699 ? "dot" : "dot-fill"}
          size={12}
          color="black"
          style={{
            display: "absolute",
            top: -50,
            marginLeft: 18,
            opacity: 0.5,
          }}
        />
        <Octicons
          name={page >= 700 ? "dot" : "dot-fill"}
          size={12}
          color="black"
          style={{
            display: "absolute",
            top: -50,
            marginLeft: 18,
            opacity: 0.5,
          }}
        />
      </View>
      <TouchableWithoutFeedback onPress={addEditWidget}>
        <View style={styles.widgetBtn}>
          <Text style={styles.widgetText}>Edit Your Mirrocle!</Text>
        </View>
      </TouchableWithoutFeedback>
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

  banner: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-end",
  },

  bannerText: {
    fontSize: 15,
    fontWeight: "700",
  },

  bannerSubText: {
    fontSize: 8,
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
    height: SCREEN_HEIGHT - 250,
    backgroundColor: "teal",
    borderRadius: 5,
  },

  scrollStyle: {},

  indicatorContainer: {
    flexDirection: "row",
  },

  widgetBtn: {
    width: "100%",
    textAlign: "center",
    alignItems: "center",
    marginTop: 20,
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderRadius: 10,
    marginBottom: 20,
    borderStyle: "solid",
    borderColor: "black",
    borderWidth: 1,
  },

  widgetText: {
    fontSize: 16,
    fontWeight: "700",
  },
});

export { MainScreen };
