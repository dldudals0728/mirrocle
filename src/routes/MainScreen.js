import { StatusBar } from "expo-status-bar";
import {
  Animated,
  Dimensions,
  Modal,
  PanResponder,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useEffect, useRef, useState } from "react";
import { Octicons } from "@expo/vector-icons";
import { Logo } from "../components/Logo";
import { theme } from "../../colors";
import { widgetList } from "../../widgets";
import { Feather } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");
const CONTAINER_HORIZONTAL_PADDING = 20;
const AnimatedBox = Animated.createAnimatedComponent(View);
const OS = Platform.OS;

function MainScreen({ navigation }) {
  const [mirrorList, setMirrorList] = useState([]);
  const [page, setPage] = useState(0);
  const [menuVisible, setMenuVisible] = useState(false);
  const [widgetListVisible, setWidgetListVisible] = useState(false);
  const [widgetDetailVisible, setWidgetDetailVisible] = useState(false);
  const [selectedWidget, setSelectedWidget] = useState({});
  const paging = (event) => {
    setPage(event.nativeEvent.contentOffset.x);
  };
  useEffect(() => {
    setMirrorList([0, 1, 2]);
  }, []);
  const detailPosition = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const detailPanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
      onPanResponderGrant: (event, gesture) => {
        detailPosition.setOffset({
          x: detailPosition.x._value,
          y: detailPosition.y._value,
        });
      },
      // onPanResponderMove: Animated.event([null, { dy: detailPosition.y }], {
      //   useNativeDriver: false,
      //   listener: (event, gesture) => {},
      // }),
      onPanResponderMove: (event, gesture) => {
        if (gesture.dy < 0) {
          return;
        }
        detailPosition.setValue({ x: 0, y: gesture.dy });
      },
      onPanResponderRelease: (event, gesture) => {
        // console.log("========== event ==========");
        // console.log(event);
        // console.log("========== event ==========");
        // console.log("========== event.nativeEvent ==========");
        // console.log(event.nativeEvent);
        // console.log("========== event.nativeEvent ==========");
        if (gesture.vy >= 3.5) {
          setWidgetDetailVisible((prev) => !prev);
          setTimeout(() => detailPosition.setValue({ x: 0, y: 0 }), 500);
        } else if (gesture.dy <= 0) {
          return;
        } else if (gesture.dy >= 300) {
          // 이게 계속 이야기되는 함수를 넘겨서 비동기 문제를 해결하는 방법!
          setWidgetDetailVisible((prev) => !prev);
          setTimeout(() => detailPosition.setValue({ x: 0, y: 0 }), 500);
        } else {
          /**
           * @todo Animated.decay 사용 방법을 숙지하지 못해 spring 사용. decay로 바꿀 것을 권장
           */
          Animated.spring(detailPosition, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: false,
          }).start();
        }
      },
    })
  ).current;
  const isScrollTop = useRef(true);
  const scrollY = useRef(new Animated.Value(0)).current;
  const listPosition = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const listPanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        return !(gestureState.dx === 0 && gestureState.dy === 0);
      },
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
      onPanResponderGrant: (event, gesture) => {
        listPosition.setOffset({
          x: listPosition.x._value,
          y: listPosition.y._value,
        });
        if (scrollY._value === 0) {
          isScrollTop.current = true;
        } else {
          isScrollTop.current = false;
        }
      },
      onPanResponderMove: (event, gesture) => {
        if (gesture.dy < 0) {
          return;
        }
        if (isScrollTop.current) {
          listPosition.setValue({ x: 0, y: gesture.dy });
        }
      },
      onPanResponderRelease: (event, gesture) => {
        if (!isScrollTop.current) {
          return;
        }
        if (gesture.vy >= 3.5) {
          setWidgetListVisible((prev) => !prev);
          setTimeout(() => listPosition.setValue({ x: 0, y: 0 }), 500);
        } else if (gesture.dy <= 0) {
          return;
        } else if (gesture.dy >= 300) {
          // 이게 계속 이야기되는 함수를 넘겨서 비동기 문제를 해결하는 방법!
          setWidgetListVisible((prev) => !prev);
          setTimeout(() => listPosition.setValue({ x: 0, y: 0 }), 500);
        } else {
          /**
           * @todo Animated.decay 사용 방법을 숙지하지 못해 spring 사용. decay로 바꿀 것을 권장
           */
          Animated.spring(listPosition, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: false,
          }).start();
        }
      },
    })
  ).current;
  const onScroll = (event) => {
    const y = event.nativeEvent.contentOffset.y;
    scrollY.setValue(y);
  };

  return (
    <View style={styles.container}>
      <Modal
        visible={widgetListVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() =>
          OS === "android" ? setWidgetListVisible(!widgetListVisible) : null
        }
      >
        <Modal
          visible={widgetDetailVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() =>
            OS === "android"
              ? setWidgetDetailVisible(!widgetDetailVisible)
              : null
          }
        >
          <AnimatedBox
            style={{
              flex: 1,
              justifyContent: "flex-start",
              alignItems: "center",
              marginTop: 120,
              backgroundColor: theme.IOS__grey,
              borderRadius: 25,
              transform: [{ translateY: detailPosition.y }],
            }}
          >
            <View style={styles.widgetControllContainer} />
            {/**
             * widget detail btn
             */}
            <View
              style={{
                width: "100%",
                height: "100%",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ScrollView
                horizontal
                pagingEnabled
                {...(OS === "ios"
                  ? { ...detailPanResponder.panHandlers }
                  : null)}
              >
                <View
                  style={{
                    alignItems: "center",
                    width: SCREEN_WIDTH,
                  }}
                >
                  <Text style={{ fontSize: 26, color: "white", marginTop: 50 }}>
                    {selectedWidget.message}
                  </Text>
                  <View
                    style={{
                      width: "100%",
                      height: "100%",
                      justifyContent: "center",
                      alignItems: "center",
                      marginTop: -80,
                    }}
                  >
                    <TouchableOpacity
                      style={{
                        backgroundColor: "rgba(128, 128, 128, 0.3)",
                        borderRadius: 10,
                        width: 200,
                        height: 200,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                      onPress={() => {
                        setWidgetListVisible(!widgetListVisible);
                        setWidgetDetailVisible(!widgetDetailVisible);
                        navigation.navigate("PlaceWidgets", {
                          name: selectedWidget.message,
                          widthSize: selectedWidget.widthSize,
                          heightSize: selectedWidget.heightSize,
                          theme: selectedWidget.theme,
                          icon: selectedWidget.icon,
                        });
                      }}
                    >
                      {selectedWidget.theme == "Ionicons" ? (
                        <Ionicons
                          name={selectedWidget.icon}
                          size={80}
                          color="white"
                        />
                      ) : (
                        <Feather
                          name={selectedWidget.icon}
                          size={80}
                          color="white"
                        />
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
              </ScrollView>
            </View>
          </AnimatedBox>
        </Modal>
        <AnimatedBox
          /**
           * @todo widgetDetailModal이 앞으로 왔을 때, 폭이 줄어드는 애니메이션 넣으면 good
           */
          style={{
            ...styles.widgetContainer,
            transform: [{ translateY: listPosition.y }],
          }}
        >
          <View style={styles.widgetControllContainer} />
          <ScrollView
            style={styles.widgetScrollContainer}
            showsVerticalScrollIndicator={false}
            scrollEventThrottle={1}
            {...(OS === "ios" ? { ...listPanResponder.panHandlers } : null)}
            // onScroll={onScroll}
            onScroll={OS === "ios" ? onScroll : null}
            // bounces: 위(또는 아래)에 컴포넌트가 없을 경우 움직이지 X
            /**
             * @todo 리스트를 스와이프 하는중에는 true, 닫기 위한 스와이프는 false로 적용되도록 하는 로직 있으면 good!
             */
            // bounces={!isScrollTop.current}
            bounces={false}
            overScrollMode="never"
          >
            {widgetList.map((widgetRow, idx) => (
              <View
                key={idx}
                style={{
                  flexDirection: "row",
                  width: "100%",
                  justifyContent: "center",
                }}
              >
                {widgetRow.map((widget, idx) => (
                  <TouchableOpacity
                    key={idx}
                    onPress={() => {
                      setWidgetDetailVisible(!widgetDetailVisible);
                      setSelectedWidget(widget);
                    }}
                    style={{
                      justifyContent: "center",
                      alignItems: "center",
                      width: "40%",
                      marginTop: 10,
                      marginBottom: 10,
                    }}
                  >
                    <View
                      style={{
                        backgroundColor: "black",
                        borderRadius: 10,
                        padding: 10,
                        marginBottom: 10,
                      }}
                    >
                      {widget.theme == "Ionicons" ? (
                        <Ionicons name={widget.icon} size={80} color="white" />
                      ) : (
                        <Feather name={widget.icon} size={80} color="white" />
                      )}
                    </View>
                    <Text style={{ color: "white" }}>{widget.message}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            ))}
          </ScrollView>
        </AnimatedBox>
      </Modal>
      <Modal
        visible={menuVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() =>
          OS === "android" ? setMenuVisible(!menuVisible) : null
        }
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
                  setWidgetListVisible(!widgetListVisible);
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
          borderRadius: 50,
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
            marginTop: OS === "ios" ? -6 : -14,
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
    marginTop: 100,
    backgroundColor: theme.IOS__grey,
    borderRadius: 25,
  },

  widgetControllContainer: {
    backgroundColor: "grey",
    width: "20%",
    height: 5,
    borderRadius: 20,
    marginVertical: 10,
  },

  widgetScrollContainer: {
    width: "100%",
    paddingHorizontal: 20,
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
