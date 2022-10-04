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
  TouchableWithoutFeedback,
  View,
} from "react-native";
//import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useRef, useState } from "react";
import { Logo } from "../components/Logo";
import { theme } from "../../colors";
import { widgetList, widgetSizeList } from "../../Widgets";
import { Feather } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { MyButton } from "../components/MyButton";
import { IP_ADDRESS } from "../../temp/IPAddress";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");
const CONTAINER_HORIZONTAL_PADDING = 10;
const AnimatedBox = Animated.createAnimatedComponent(View);
const OS = Platform.OS;

function MainScreen({ navigation, route }) {
  const [menuVisible, setMenuVisible] = useState(false);
  const [widgetListVisible, setWidgetListVisible] = useState(false);
  const [widgetDetailVisible, setWidgetDetailVisible] = useState(false);
  const [selectedWidget, setSelectedWidget] = useState({});
  const [loading, setLoading] = useState(true);
  const [loadedWidget, setLoadedWidget] = useState([]);
  const [previewVisible, setPreviewVisible] = useState(false);

  const [settingVisible, setSettingVisible] = useState(false);
  const editWidget = useRef({});

  const selectWidgetSetting = (widget) => {
    editWidget.current = widget;
    console.log(editWidget.current);
  };

  const loadWidgetFromDB = () => {
    // let url = "http://" + IP_ADDRESS + ":8080/mirrocle/template";
    // fetch(url)
    //   .then((response) => {
    //     response.json().then((result) => {
    //       setLoadedWidget((prev) => {
    //         return result;
    //       });

    //       console.log(result);
    //       console.log(typeof result);
    //     });
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });
    const tempWidget = [
      {
        coordinate: { x: 0, y: 0 },
        module_name: "시계",
        size: { height: 2, width: 2 },
      },
      {
        coordinate: { x: 4, y: 0 },
        module_name: "날씨",
        size: { height: 1, width: 1 },
      },
      {
        coordinate: { x: 3, y: 4 },
        module_name: "교통정보",
        size: { height: 3, width: 2 },
      },
    ];
    setLoadedWidget(tempWidget);
  };

  useEffect(() => {
    loadWidgetFromDB();
    setLoading((prev) => !prev);
    return () => setLoading((prev) => !prev);
  }, []);

  const grid = [
    [".", ".", ".", ".", "."],
    [".", ".", ".", ".", "."],
    [".", ".", ".", ".", "."],
    [".", ".", ".", ".", "."],
    [".", ".", ".", ".", "."],
    [".", ".", ".", ".", "."],
    [".", ".", ".", ".", "."],
    [".", ".", ".", ".", "."],
    [".", ".", ".", ".", "."],
    [".", ".", ".", ".", "."],
  ];
  const detailPosition = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const listPosition = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
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
        console.log(gesture);
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
                flex: 1,
                justifyContent: "space-around",
              }}
            >
              <View
                style={{
                  flex: 1,
                  justifyContent: "flex-end",
                  alignItems: "center",
                }}
              >
                <Text style={{ fontSize: 26, color: "white" }}>
                  {selectedWidget.message}
                </Text>
              </View>
              <View style={{ flex: 5 }}>
                <ScrollView
                  horizontal
                  pagingEnabled
                  /**
                   * @todo scrollView가 horizontal일 경우 의도치 않은 동작이 생겨 보류. IOS일 경우 버튼을 이용하여 close
                   */
                  // {...(OS === "ios"
                  //   ? { ...detailPanResponder.panHandlers }
                  //   : null)}
                >
                  {widgetSizeList.width.map((width, key) =>
                    widgetSizeList.height.map((height, key) => (
                      <View
                        key={key}
                        style={{
                          width: SCREEN_WIDTH,
                          justifyContent: "center",
                          alignItems: "center",
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
                              module_name: selectedWidget.message,
                              size: {
                                width: width,
                                height: height,
                              },
                              coordinate: {
                                x: 0,
                                y: 0,
                              },
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
                        <Text style={{ color: "white", fontSize: 28 }}>
                          {`${width} X ${height}`}
                        </Text>
                      </View>
                    ))
                  )}
                </ScrollView>
              </View>
              <View
                style={{
                  flex: 1,
                  justifyContent: "flex-start",
                  alignItems: "center",
                }}
              >
                <TouchableOpacity
                  onPress={() => setWidgetDetailVisible(!widgetDetailVisible)}
                >
                  <Ionicons
                    name="return-down-back"
                    style={{ fontSize: 52, color: "white" }}
                  />
                </TouchableOpacity>
              </View>
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
        visible={previewVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() =>
          OS === "android" ? setPreviewVisible(!previewVisible) : null
        }
      >
        <Modal
          visible={settingVisible}
          animationType="fade"
          transparent={true}
          onRequestClose={() => console.log("close")}
        >
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <View
              style={{
                height: SCREEN_HEIGHT / 2,
                width: SCREEN_WIDTH * 0.8,
                borderRadius: 15,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: theme.IOS__grey,
              }}
            >
              <Text
                style={{ color: "white", fontSize: 22, fontWeight: "bold" }}
              >
                {editWidget.current.module_name}
              </Text>
              <Pressable
                style={{
                  ...styles.widgetControllText,
                  backgroundColor: "skyblue",
                }}
                onPress={() => {
                  setSettingVisible((prev) => !prev);
                  setPreviewVisible((prev) => !prev);
                  navigation.navigate("PlaceWidgets", {
                    module_name: editWidget.current.module_name,
                    size: {
                      width: editWidget.current.size.width,
                      height: editWidget.current.size.height,
                    },
                    coordinate: {
                      x: editWidget.current.coordinate.x,
                      y: editWidget.current.coordinate.y,
                    },
                    theme: selectedWidget.theme,
                    icon: selectedWidget.icon,
                  });
                }}
              >
                <Text>위치 변경</Text>
              </Pressable>
              <Pressable
                style={{ ...styles.widgetControllText, backgroundColor: "red" }}
              >
                <Text style={{ color: "white" }}>삭제</Text>
              </Pressable>
              <Pressable
                style={{
                  ...styles.widgetControllText,
                  backgroundColor: "white",
                }}
                onPress={() => setSettingVisible((prev) => !prev)}
              >
                <Text>Close</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
        <Pressable
          style={{
            flex: 1,
            backgroundColor: "rgba(128, 128, 128, 0.8)",
          }}
          onPress={() => setPreviewVisible(!previewVisible)}
        />
        <View style={styles.previewContainer}>
          {grid.map((row, idx) => (
            <View key={idx} style={{ flexDirection: "row", height: "10%" }}>
              {row.map((col, idx) => (
                <View key={idx} style={styles.gridStyle} />
              ))}
            </View>
          ))}
          {loading
            ? null
            : loadedWidget.map((widget, idx) => {
                return (
                  <TouchableOpacity
                    key={idx}
                    style={{
                      ...styles.widgetStyle,
                      top: `${widget.coordinate.y * 10}%`,
                      left: `${widget.coordinate.x * 20}%`,
                      width: `${widget.size.width * 20}%`,
                      height: `${widget.size.height * 10}%`,
                    }}
                    onPress={() => {
                      // navigation.navigate("PlaceWidgets", {
                      //   widthSize: DEFAULT_WIDTH,
                      //   heightSize: DEFAULT_HEIGHT,
                      // });
                      // setPreviewVisible(!previewVisible);
                      selectWidgetSetting(widget);
                      setSettingVisible((prev) => !prev);
                    }}
                  >
                    <Text style={{ color: "white" }}>{widget.module_name}</Text>
                  </TouchableOpacity>
                );
              })}
        </View>
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
        {/* <View style={styles.menuContainer}>
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
        </View> */}
      </Modal>
      <View style={styles.header}>
        <Logo imageSize={40} titleSize={15} subTextSize={8} />
        <View>
          <Text style={styles.username}>username</Text>
        </View>
      </View>
      <TouchableWithoutFeedback
        onLongPress={() => setPreviewVisible(!previewVisible)}
      >
        <View style={styles.gridContainer}>
          {grid.map((row, idx) => (
            <View key={idx} style={{ flexDirection: "row", height: "10%" }}>
              {row.map((col, idx) => (
                <View key={idx} style={styles.gridStyle} />
              ))}
            </View>
          ))}
          {loading
            ? null
            : loadedWidget.map((widget, idx) => {
                return (
                  <View
                    key={idx}
                    style={{
                      ...styles.widgetStyle,
                      top: `${widget.coordinate.y * 10}%`,
                      left: `${widget.coordinate.x * 20}%`,
                      width: `${widget.size.width * 20}%`,
                      height: `${widget.size.height * 10}%`,
                    }}
                  >
                    <Text style={{ color: "white" }}>{widget.module_name}</Text>
                  </View>
                );
              })}
        </View>
      </TouchableWithoutFeedback>
      <MyButton
        text="위젯 편집"
        onPress={() => {
          // 모달을 두 개 이상 띄울 수 없다. 닫고 띄우기
          setMenuVisible(!menuVisible);
          setWidgetListVisible(!widgetListVisible);
        }}
        style={{ width: 300 }}
      />
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

  previewContainer: {
    flex: 1,
    position: "absolute",
    // absolute 자체적으로 가운데 정렬하기 꿀팁!
    top: "8%",
    left: "1%",
    width: "98%",
    height: "84%",
    backgroundColor: "#000",
    borderRadius: 15,
  },

  widgetControllText: {
    borderRadius: 20,
    height: 30,
    width: "80%",
    justifyContent: "center",
    alignItems: "center",
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
  gridContainer: {
    flex: 1,
    backgroundColor: "black",
    justifyContent: "center",
    marginTop: 20,
    marginBottom: 20,
    borderColor: theme.grey,
    borderRadius: 15,
  },
  gridStyle: {
    flexDirection: "row",
    width: "20%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    borderColor: "rgba(128, 128, 128, 0.3)",
  },

  widgetStyle: {
    position: "absolute",
    backgroundColor: "rgba(128, 128, 128, 0.3)",
    borderRadius: 15,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export { MainScreen };
