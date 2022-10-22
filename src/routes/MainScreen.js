import * as Location from "expo-location";
import { StatusBar } from "expo-status-bar";
import {
  ActivityIndicator,
  Alert,
  Animated,
  Dimensions,
  Keyboard,
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
import { MyTextInput } from "../components/MyTextInput";
import { IP_ADDRESS } from "../../temp/IPAddress";
import { API_KEYS } from "../../temp/API";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");
const CONTAINER_HORIZONTAL_PADDING = 10;
const AnimatedBox = Animated.createAnimatedComponent(View);
const OS = Platform.OS;

const subwayOption = {
  "01호선": { color: "#0052A4", description: "1" },
  "02호선": { color: "#009D3E", description: "2" },
  "03호선": { color: "#EF7C1C", description: "3" },
  "04호선": { color: "#00A5DE", description: "4" },
  "05호선": { color: "#996CAC", description: "5" },
  "06호선": { color: "#CD7C2F", description: "6" },
  "07호선": { color: "#BDB092", description: "7" },
  "08호선": { color: "#EA545D", description: "8" },
  "09호선": { color: "#BDB092", description: "9" },
  우이신설경전철: { color: "#B0CE18", description: "우이신설" },
  경춘선: { color: "#0C8E72", description: "경춘" },
  경의선: { color: "#77C4A3", description: "경의중앙" },
  수인분당선: { color: "#F5A200", description: "수인분당" },
  신분당선: { color: "#D4003B", description: "신분당" },
  공항철도: { color: "#0090D2", description: "공항" },
};

function MainScreen({ navigation, route }) {
  const [isKeyboardShow, setIsKeyboardShow] = useState(false);
  const [indicatorVisible, setIndicatorVisible] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [widgetListVisible, setWidgetListVisible] = useState(false);
  const [widgetDetailVisible, setWidgetDetailVisible] = useState(false);
  const [selectedWidget, setSelectedWidget] = useState({});
  const [loading, setLoading] = useState(true);
  const [loadedWidget, setLoadedWidget] = useState({});

  const [previewVisible, setPreviewVisible] = useState(false);
  const [settingVisible, setSettingVisible] = useState(false);
  const [attributeVisible, setAttributeVisible] = useState(false);

  const [isWidgetSelected, setIsWidgetSelected] = useState(false);
  const editWidget = useRef({});

  const [weather, setWeather] = useState({
    latitude: 0,
    longitude: 0,
    city: "",
  });
  const [station, setStation] = useState({
    subwayStationName: "",
    subwayRouteName: "",
    subwayStationId: "",
  });

  const [subwayStationName, setSubwayStationName] = useState("");
  const [subwayStationList, setSubwayStationList] = useState([]);

  const [busRouteNumber, setBusRouteNumber] = useState("");
  // const []

  const getLocation = async () => {
    setIndicatorVisible((prev) => !prev);
    const { granted } = await Location.requestForegroundPermissionsAsync();
    if (!granted) {
      Alert.alert(
        "위치정보 권한 요청 실패",
        "위치정보 권한 요청이 거절되었습니다.",
        [
          {
            text: "OK",
          },
        ]
      );
      return;
    }
    const {
      coords: { latitude, longitude },
    } = await Location.getCurrentPositionAsync({ accuracy: 5 });
    const location = await Location.reverseGeocodeAsync(
      { latitude, longitude },
      { useGoogleMaps: false }
    );
    const temp = { ...loadedWidget };
    temp[
      editWidget.current.key
    ].attribute.attr_member.city = `${location[0].city} ${location[0].district}`;
    temp[editWidget.current.key].attribute.attr_member.latitude = latitude;
    temp[editWidget.current.key].attribute.attr_member.longitude = longitude;
    temp[
      editWidget.current.key
    ].attribute.main = `${location[0].city} ${location[0].district}`;

    setLoadedWidget(temp);
    setIndicatorVisible((prev) => !prev);
    console.log("finish!");
  };

  const getStation = async () => {
    if (subwayStationName === "") {
      Alert.alert("검색어 오류", "검색어를 입력해주세요.", [
        {
          text: "OK",
        },
      ]);
      return;
    }
    setIndicatorVisible(true);
    const API = API_KEYS.seoulSubwayStationInfo;
    // const url = `http://apis.data.go.kr/1613000/SubwayInfoService/getKwrdFndSubwaySttnList?serviceKey=${API}&pageNo=${"1"}&numOfRows=${"1000"}&_type=${"json"}&subwayStationName=${encodeURIComponent(
    //   subwayStationName
    // )}`;
    const url = `http://openapi.seoul.go.kr:8088/${API}/json/SearchSTNBySubwayLineInfo/1/1000/${" "}/${subwayStationName}`;
    const res = await fetch(url);
    const json = await res.json();
    // console.log(json.SearchSTNBySubwayLineInfo);
    const subwayStationList = json.SearchSTNBySubwayLineInfo
      ? json.SearchSTNBySubwayLineInfo.row
      : [];
    const supportedSubwayStationList = subwayStationList.filter((station) => {
      return Object.keys(subwayOption).includes(station.LINE_NUM);
    });
    setSubwayStationList(supportedSubwayStationList);
    setIndicatorVisible(false);
  };

  const saveStation = () => {
    if (!station.subwayStationId) {
      Alert.alert("역 선택 오류", "역이 선택되지 않았습니다!", [
        {
          text: "OK",
        },
      ]);
      return;
    } else {
      Alert.alert(
        `${station.subwayRouteName}\n${station.subwayStationName}`,
        "해당 역으로 설정하시겠습니까?",
        [
          {
            text: "cancel",
          },
          {
            text: "OK",
            onPress: () => {
              Alert.alert("완료", "역이 설정되었습니다.", [
                {
                  text: "OK",
                },
              ]);
              const temp = { ...loadedWidget };
              temp[
                editWidget.current.key
              ].attribute.attr_member.subwayStationName =
                station.subwayStationName;
              temp[
                editWidget.current.key
              ].attribute.attr_member.subwayRouteName = station.subwayRouteName;
              temp[
                editWidget.current.key
              ].attribute.attr_member.subwayStationId = station.subwayStationId;
              temp[
                editWidget.current.key
              ].attribute.main = `${station.subwayRouteName}\n${station.subwayStationName}`;

              setLoadedWidget(temp);
              setAttributeVisible(!attributeVisible);
              setSettingVisible(!settingVisible);
            },
          },
        ]
      );
    }
  };

  const selectWidgetSetting = (widget) => {
    editWidget.current = widget;
    !isWidgetSelected ? setIsWidgetSelected(true) : null;
    console.log("editWidget.current:", editWidget.current);
  };

  const deleteWidget = (key) => {
    /**
     * 객체 삭제 -> 키값 0 ~ length - 1로 재설정 -> value의 key값 "0" ~ "length - 1"로 재설정
     */
    const newWidgetList = {};
    const widgetList = { ...loadedWidget };
    delete widgetList[key];
    const arrayWidgetList = Object.values(widgetList);
    arrayWidgetList.forEach((value, idx) => {
      value.key = idx.toString();
      newWidgetList[parseInt(idx)] = value;
    });
    console.log(widgetList);
    console.log("==================");
    console.log(newWidgetList);
    setLoadedWidget(newWidgetList);
  };

  const loadWidgetFromDB = async () => {
    // let url = "http://" + IP_ADDRESS + "/user/json";
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
    let url = IP_ADDRESS + "/user/json";
    const res = await fetch(url);
    const json = await res.json();
    console.log("json:", json);
    console.log(typeof json);
    // const tempWidget = [
    //   {
    //     coordinate: { x: 0, y: 0 },
    //     module_name: "시계",
    //     size: { height: 2, width: 2 },
    //   },
    //   {
    //     coordinate: { x: 4, y: 0 },
    //     module_name: "날씨",
    //     size: { height: 1, width: 1 },
    //   },
    //   {
    //     coordinate: { x: 3, y: 4 },
    //     module_name: "교통정보",
    //     size: { height: 3, width: 2 },
    //   },
    //   {
    //     coordinate: { x: 0, y: 9 },
    //     module_name: "ToDo",
    //     size: { height: 1, width: 3 },
    //   },
    // ];

    const tempWidget = {
      0: {
        key: "0",
        coordinate: { x: 0, y: 0 },
        module_name: "시계",
        size: { height: 2, width: 2 },
        attribute: {
          main: "",
          attr_name: "",
          attr_member: {},
        },
      },
      1: {
        key: "1",
        coordinate: { x: 4, y: 0 },
        module_name: "날씨",
        size: { height: 1, width: 1 },
        attribute: {
          main: "",
          attr_name: "위치 설정",
          attr_member: {
            latitude: 0,
            longitude: 0,
            city: "",
          },
        },
      },
      2: {
        key: "2",
        coordinate: { x: 3, y: 4 },
        module_name: "교통정보(지하철)",
        size: { height: 3, width: 2 },
        attribute: {
          main: "",
          attr_name: "지하철 역 선택",
          attr_member: {
            subwayStationName: "",
            subwayRouteName: "",
            subwayStationId: "",
          },
        },
      },
      3: {
        key: "3",
        coordinate: { x: 0, y: 9 },
        module_name: "ToDo",
        size: { height: 1, width: 3 },
        attribute: {
          main: "",
          attr_name: "ToDo list 편집",
          attr_member: {},
        },
      },
      4: {
        key: "4",
        coordinate: { x: 0, y: 2 },
        module_name: "교통정보(버스)",
        size: { height: 1, width: 2 },
        attribute: {
          main: "",
          attr_name: "내 주변 정류소 찾기",
          attr_member: {
            subwayStationName: "",
            subwayRouteName: "",
            subwayStationId: "",
          },
        },
      },
    };
    setLoadedWidget(tempWidget);
  };

  const keyboardShow = () => setIsKeyboardShow((prev) => !prev);
  const keyboradHide = () => setIsKeyboardShow((prev) => !prev);

  useEffect(() => {
    Keyboard.addListener("keyboardDidShow", keyboardShow);
    Keyboard.addListener("keyboardDidHide", keyboradHide);
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
      <ActivityIndicator
        animating={indicatorVisible}
        style={{ position: "absolute", top: "50%", zIndex: 50 }}
      />
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
          <Modal
            visible={attributeVisible}
            animationType="fade"
            transparent={true}
            onRequestClose={() => console.log("close")}
          >
            <Pressable
              style={{
                flex: 1,
                backgroundColor: "transparent",
              }}
              onPress={() => {
                console.log(isKeyboardShow);
                if (isKeyboardShow) {
                  Keyboard.dismiss();
                } else {
                  indicatorVisible
                    ? null
                    : setAttributeVisible(!attributeVisible);
                }
              }}
            />
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                position: "absolute",
                top: SCREEN_HEIGHT * 0.2,
                left: SCREEN_WIDTH * 0.1,
              }}
            >
              <View
                style={{
                  height: SCREEN_HEIGHT * 0.6,
                  width: SCREEN_WIDTH * 0.8,
                  borderRadius: 15,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: theme.IOS__grey,
                }}
              >
                <ActivityIndicator
                  animating={indicatorVisible}
                  style={{ position: "absolute", top: "49%", zIndex: 50 }}
                />
                {isWidgetSelected &&
                editWidget.current.attribute.attr_name === "지하철 역 선택" ? (
                  <View
                    style={{
                      flex: 1,
                      width: "100%",
                      paddingHorizontal: "5%",
                    }}
                  >
                    <MyTextInput
                      placeholder="지하철 역 검색"
                      value={subwayStationName}
                      onChangeText={setSubwayStationName}
                      returnKeyType="done"
                      onSubmitEditing={getStation}
                      style={{
                        marginTop: 20,
                        marginBottom: 10,
                      }}
                    />
                    <View
                      style={{
                        ...styles.stationContainer,
                        marginBottom: 5,
                        justifyContent: "center",
                        borderColor: station.subwayStationId
                          ? subwayOption[station.subwayRouteName].color
                          : "black",
                      }}
                    >
                      {station.subwayStationId ? (
                        <View
                          style={{
                            width: "100%",
                            height: "100%",
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <Text style={{ fontSize: 16 }}>
                            {station.subwayStationName}
                          </Text>
                          <View
                            style={{
                              width:
                                station.subwayRouteName[0] === "0" ? 30 : null,
                              height:
                                station.subwayRouteName[0] === "0" ? 30 : null,
                              borderRadius: 15,
                              borderWidth: 3,
                              borderColor:
                                subwayOption[station.subwayRouteName].color,
                              justifyContent: "center",
                              alignItems: "center",
                              padding: 5,
                            }}
                          >
                            <Text
                              style={{
                                color:
                                  subwayOption[station.subwayRouteName].color,
                              }}
                            >
                              {station.subwayRouteName[0] === "0"
                                ? station.subwayRouteName[1]
                                : station.subwayRouteName}
                            </Text>
                          </View>
                        </View>
                      ) : (
                        <Text style={{ fontSize: 18 }}>
                          지하철을 선택해주세요.
                        </Text>
                      )}
                    </View>
                    <View
                      style={{
                        height: 1,
                        width: "100%",
                        borderColor: "white",
                        borderWidth: 0.5,
                        marginBottom: 5,
                      }}
                    ></View>
                    <ScrollView showsVerticalScrollIndicator={false}>
                      {subwayStationList.length !== 0 ? (
                        subwayStationList.map((value, idx) => {
                          return (
                            <TouchableOpacity
                              key={idx}
                              onPress={() => {
                                const selectedStation = {
                                  subwayStationName: value.STATION_NM,
                                  subwayRouteName: value.LINE_NUM,
                                  subwayStationId: value.STATION_CD,
                                };
                                setStation(selectedStation);
                              }}
                            >
                              <View
                                style={{
                                  ...styles.stationContainer,
                                  borderColor:
                                    subwayOption[value.LINE_NUM].color,
                                }}
                              >
                                <Text style={{ fontSize: 16 }}>
                                  {value.STATION_NM}
                                </Text>
                                <View
                                  style={{
                                    width:
                                      value.LINE_NUM[0] === "0" ? 30 : null,
                                    height:
                                      value.LINE_NUM[0] === "0" ? 30 : null,
                                    borderRadius: 15,
                                    borderWidth: 3,
                                    borderColor:
                                      subwayOption[value.LINE_NUM].color,
                                    justifyContent: "center",
                                    alignItems: "center",
                                    padding: 5,
                                  }}
                                >
                                  <Text
                                    style={{
                                      color: subwayOption[value.LINE_NUM].color,
                                    }}
                                  >
                                    {value.LINE_NUM[0] === "0"
                                      ? value.LINE_NUM[1]
                                      : value.LINE_NUM}
                                  </Text>
                                </View>
                              </View>
                            </TouchableOpacity>
                          );
                        })
                      ) : (
                        <View
                          style={{
                            width: "100%",
                            height: "100%",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <Text style={{ color: "white" }}>
                            * 지원하지 않는 역은 검색되지 않습니다. *
                          </Text>
                          <Text style={{ color: "white" }}>
                            * 신림선 / 경강선 / 서해선 *
                          </Text>
                          <Text style={{ color: "white" }}>
                            * 인천 도시철도 1호선 / 인천 도시철도 2호선 *
                          </Text>
                          <Text style={{ color: "white" }}>
                            * 의정부 경전철 / 용인 경전철 / 김포 도시철도 *
                          </Text>
                        </View>
                      )}
                    </ScrollView>
                    <MyButton
                      onPress={saveStation}
                      text="저장"
                      style={{
                        marginTop: 20,
                      }}
                    />
                  </View>
                ) : isWidgetSelected &&
                  editWidget.current.attribute.attr_name === "위치 설정" ? (
                  <View
                    style={{ justifyContent: "center", alignItems: "center" }}
                  >
                    {indicatorVisible ? (
                      <View>
                        <Text style={{ color: "white", fontSize: 16 }}>
                          GPS 정보를 받아와 설정을 완료하고 있습니다.
                        </Text>
                        <Text style={{ color: "white", fontSize: 16 }}>
                          잠시만 기다려 주세요...
                        </Text>
                      </View>
                    ) : (
                      <View>
                        <Text style={{ color: "white", fontSize: 18 }}>
                          설정이 완료되었습니다!
                        </Text>
                        <Text
                          style={{
                            color: "white",
                            fontSize: 18,
                            alignSelf: "center",
                          }}
                        >
                          현재 위치:{" "}
                          {
                            loadedWidget[editWidget.current.key].attribute
                              .attr_member.city
                          }
                        </Text>
                        <MyButton
                          style={{ backgroundColor: "white" }}
                          text="닫기"
                        />
                      </View>
                    )}
                  </View>
                ) : null}
              </View>
            </View>
          </Modal>
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
                paddingLeft: "10%",
                paddingRight: "10%",
              }}
            >
              <Text
                style={{
                  color: "white",
                  fontSize: 22,
                  fontWeight: "bold",
                  marginBottom: 20,
                }}
              >
                {editWidget.current.module_name}
              </Text>
              {isWidgetSelected && editWidget.current.attribute.main ? (
                <Text
                  style={{
                    color: "white",
                    fontSize: 16,
                    fontWeight: "bold",
                    marginBottom: 20,
                  }}
                >
                  {editWidget.current.attribute.main}
                </Text>
              ) : null}
              {isWidgetSelected && editWidget.current.attribute.attr_name ? (
                <TouchableOpacity
                  style={{
                    ...styles.widgetControllButton,
                    backgroundColor: "aliceblue",
                  }}
                  onPress={() => {
                    // setPreviewVisible(!previewVisible);
                    // setSettingVisible(!settingVisible);
                    // editWidgetAttribute(editWidget.current.attribute.attr_name);
                    const currentFuncName =
                      editWidget.current.attribute.attr_name;
                    currentFuncName === "ToDo list 편집"
                      ? null
                      : setAttributeVisible(!attributeVisible);
                    if (currentFuncName === "위치 설정") {
                      getLocation();
                    } else if (currentFuncName === "ToDo list 편집") {
                      navigation.navigate("ToDos", {
                        username: route.params.username,
                      });
                      setPreviewVisible(!previewVisible);
                      setSettingVisible(!settingVisible);
                    }
                  }}
                >
                  <Text style={styles.widgetControllText}>
                    {editWidget.current.attribute.attr_name}
                  </Text>
                </TouchableOpacity>
              ) : null}
              <TouchableOpacity
                style={{
                  ...styles.widgetControllButton,
                  backgroundColor: "skyblue",
                }}
                onPress={() => {
                  setSettingVisible((prev) => !prev);
                  setPreviewVisible((prev) => !prev);
                  console.log(editWidget.current);
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
                    // theme: editWidget.current.theme,
                    // icon: editWidget.current.icon,
                    edit: true,
                    key: editWidget.current.key,
                  });
                }}
              >
                <Text style={styles.widgetControllText}>위젯 위치 변경</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  ...styles.widgetControllButton,
                  backgroundColor: "red",
                }}
                onPress={() => {
                  Alert.alert(
                    "위젯 삭제",
                    `${editWidget.current.module_name} 위젯을 삭제하시겠습니까?`,
                    [
                      {
                        text: "cancel",
                      },
                      {
                        text: "OK",
                        onPress: () => {
                          Alert.alert(
                            "완료",
                            "위젯이 성공적으로 삭제되었습니다.",
                            [
                              {
                                text: "OK",
                              },
                            ]
                          );
                          setPreviewVisible(!previewVisible);
                          setSettingVisible(!settingVisible);
                          deleteWidget(editWidget.current.key);
                        },
                      },
                    ]
                  );
                }}
              >
                <Text style={{ ...styles.widgetControllText, color: "white" }}>
                  삭제
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  ...styles.widgetControllButton,
                  backgroundColor: "white",
                }}
                onPress={() => setSettingVisible((prev) => !prev)}
              >
                <Text style={styles.widgetControllText}>Close</Text>
              </TouchableOpacity>
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
            : Object.keys(loadedWidget).map((key, idx) => {
                const widget = loadedWidget[key];
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
          <Text style={styles.username}>{route.params.username}</Text>
        </View>
      </View>
      <TouchableWithoutFeedback
        onLongPress={() =>
          indicatorVisible ? null : setPreviewVisible(!previewVisible)
        }
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
            : Object.keys(loadedWidget).map((key, idx) => {
                const widget = loadedWidget[key];
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
        text="위젯 추가"
        onPress={() => {
          // 모달을 두 개 이상 띄울 수 없다. 닫고 띄우기
          if (indicatorVisible) {
            return;
          }
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

  widgetButtonContainer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
  },

  widgetControllButton: {
    borderRadius: 10,
    marginBottom: "10%",
    height: "10%",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },

  widgetControllText: {
    fontSize: 18,
    fontWeight: "600",
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

  stationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 3,
  },
});

export { MainScreen };
