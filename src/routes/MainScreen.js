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
import { Feather } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { MyButton } from "../components/MyButton";
import { MyTextInput } from "../components/MyTextInput";
import { IP_ADDRESS } from "../../temp/IPAddress";
import { API_KEYS } from "../../temp/API";
import { widgets } from "../components/Widgets";
import { useIsFocused } from "@react-navigation/native";
import axios from "axios";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");
const CONTAINER_HORIZONTAL_PADDING = 10;
const AnimatedBox = Animated.createAnimatedComponent(View);
const OS = Platform.OS;

const moduleSize = {
  "아날로그 시계": [
    {
      x: 2,
      y: 2,
    },
  ],
  "디지털 시계": [
    {
      x: 2,
      y: 1,
    },
  ],
  날씨: [
    {
      x: 1,
      y: 1,
    },
    {
      x: 2,
      y: 1,
    },
  ],
  지하철: [
    {
      x: 3,
      y: 1,
    },
  ],
  ToDo: [
    {
      x: 2,
      y: 2,
    },
    {
      x: 1,
      y: 3,
    },
  ],
  뉴스: [
    {
      x: 4,
      y: 3,
    },
  ],
  달력: [
    {
      x: 3,
      y: 3,
    },
  ],
};

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

const newsCategories = [
  {
    name: "all", // 실제 카테고리
    text: "전체보기", // 렌더링할 때 사용할 한글 카테고리
  },
  {
    name: "business",
    text: "비즈니스",
  },
  {
    name: "entertainment",
    text: "엔터테인먼트",
  },
  {
    name: "health",
    text: "건강",
  },
  {
    name: "science",
    text: "과학",
  },
  {
    name: "sports",
    text: "스포츠",
  },
  {
    name: "technology",
    text: "기술",
  },
];

function MainScreen({ navigation, route }) {
  const { accountIdx, userIdx, username } = route.params;
  const isFocused = useIsFocused();
  const [isKeyboardShow, setIsKeyboardShow] = useState(false);
  const [indicatorVisible, setIndicatorVisible] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [widgetListVisible, setWidgetListVisible] = useState(false);
  const [widgetDetailVisible, setWidgetDetailVisible] = useState(false);
  const [selectedWidget, setSelectedWidget] = useState({
    key: 0,
    app: {
      theme: "",
      icon: "",
    },
    coordinate: { x: 0, y: 0 },
    module_name: "",
    size: { height: 0, width: 0 },
    attribute: {
      detail: "",
      attr_name: "",
      attr_member: {},
    },
  });
  const [loading, setLoading] = useState(true);
  const [loadedWidget, setLoadedWidget] = useState([]);
  const [widgetWrapper, setWidgetWrapper] = useState([]);

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

  const [newsCategory, setNewsCategory] = useState({
    name: "",
    text: "",
  });

  const [gmail, setGmail] = useState("");

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
    ].attribute.detail = `${location[0].city} ${location[0].district}`;

    setLoadedWidget(temp);
    setIndicatorVisible((prev) => !prev);
    saveWidgetWithServer(temp);
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
    const API = await getAPIKey();
    const url = `http://openapi.seoul.go.kr:8088/${API}/json/SearchSTNBySubwayLineInfo/1/1000/${" "}/${subwayStationName}`;
    const res = await fetch(url);
    const json = await res.json();
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
              ].attribute.detail = `${station.subwayRouteName}\n${station.subwayStationName}`;

              setLoadedWidget(temp);
              setAttributeVisible(!attributeVisible);
              setSettingVisible(!settingVisible);
              saveWidgetWithServer(temp);
            },
          },
        ]
      );
    }
  };

  const saveGoogleAPI = () => {
    if (!gmail) {
      Alert.alert("g-mail 입력 오류", "g-mail이 입력되지 않았습니다!", [
        {
          text: "OK",
        },
      ]);
      return;
    } else if (
      !gmail.includes("@") ||
      !gmail.includes(".") ||
      !gmail.includes("gmail.com")
    ) {
      Alert.alert(
        "g-mail 입력 오류",
        "옳바른 g-email 형식이 아닙니다.\n@gmail.com을 사용해 주세요",
        [
          {
            text: "OK",
          },
        ]
      );
      return;
    } else {
      Alert.alert(
        `${gmail}\n님의 계정`,
        "해당 계정의 Calendar를 연동하시겠습니까?",
        [
          {
            text: "cancel",
          },
          {
            text: "OK",
            onPress: () => {
              Alert.alert("완료", "Google Calendar가 연동되었습니다.", [
                {
                  text: "OK",
                },
              ]);
              const temp = { ...loadedWidget };
              temp[editWidget.current.key].attribute.attr_member.gmail = gmail;
              temp[
                editWidget.current.key
              ].attribute.detail = `${gmail}\n님의 Calendar`;

              setLoadedWidget(temp);
              setAttributeVisible(!attributeVisible);
              setSettingVisible(!settingVisible);
              saveWidgetWithServer(temp);
            },
          },
        ]
      );
    }
  };

  const deleteGoogleAPI = () => {
    const temp = { ...loadedWidget };
    const currentGmail =
      temp[editWidget.current.key].attribute.attr_member.gmail;

    if (!currentGmail) {
      Alert.alert(
        "Google Calendar 연동 오류",
        "연동된 Google Calendar가 존재하지 않습니다!",
        [
          {
            text: "OK",
          },
        ]
      );
      return;
    } else {
      Alert.alert(
        "Google Calendar 연결 해제",
        `${currentGmail}\n해당 계정과의 연결을 해제하시겠습니까?`,
        [
          {
            text: "cancel",
          },
          {
            text: "OK",
            onPress: () => {
              Alert.alert(
                "연결 해제",
                "Google Calendar 연결이 해제되었습니다.",
                [
                  {
                    text: "OK",
                  },
                ]
              );
              const temp = { ...loadedWidget };
              temp[editWidget.current.key].attribute.attr_member.gmail = "";
              temp[editWidget.current.key].attribute.detail = "";

              setLoadedWidget(temp);
              setAttributeVisible(!attributeVisible);
              setSettingVisible(!settingVisible);
              saveWidgetWithServer(temp);
            },
          },
        ]
      );
    }
  };

  const saveNewsCategory = () => {
    if (!newsCategory.text) {
      Alert.alert("카테고리 선택 오류", "카테고리가 선택되지 않았습니다!", [
        {
          text: "OK",
        },
      ]);
      return;
    } else {
      Alert.alert(
        `${newsCategory.text} 뉴스`,
        "해당 카테고리로 설정하시겠습니까?",
        [
          {
            text: "cancel",
          },
          {
            text: "OK",
            onPress: () => {
              Alert.alert("완료", "뉴스 카데고리가 설정되었습니다.", [
                {
                  text: "OK",
                },
              ]);
              const temp = { ...loadedWidget };
              temp[editWidget.current.key].attribute.attr_member.category.name =
                newsCategory.name;
              temp[editWidget.current.key].attribute.attr_member.category.text =
                newsCategory.text;
              temp[
                editWidget.current.key
              ].attribute.detail = `${newsCategory.text} 카테고리`;

              setLoadedWidget(temp);
              setAttributeVisible(!attributeVisible);
              setSettingVisible(!settingVisible);
              saveWidgetWithServer(temp);
            },
          },
        ]
      );
    }
  };

  const getAPIKey = async () => {
    let url = IP_ADDRESS + "/api/select";
    url += `?name=seoulSubwayStationInfo`;
    const res = await fetch(url);
    const json = await res.json();
    return json.api_key;
  };

  const setWidgetSize = (width, height) => {
    setSelectedWidget((selectedWidget) => {
      selectedWidget.size.width = width;
      selectedWidget.size.height = height;
      return selectedWidget;
    });
  };

  const wrapWidgets = () => {
    const widgetWrapper = [[]];
    Object.keys(widgets).forEach((key, idx) => {
      let lastIdx = widgetWrapper.length - 1;
      if (widgetWrapper[lastIdx].length === 2) {
        widgetWrapper.push([]);
        lastIdx += 1;
      }
      widgetWrapper[lastIdx].push(widgets[key]);
    });
    setWidgetWrapper(widgetWrapper);
  };

  const selectWidgetSetting = (widget) => {
    const tempWidget = { ...widget };
    tempWidget.key = tempWidget.key.toString();
    editWidget.current = tempWidget;
    !isWidgetSelected ? setIsWidgetSelected(true) : null;
    console.log("editWidget.current:", editWidget.current);
  };

  const deleteWidget = (key) => {
    /**
     * 객체 삭제 -> 키값 0 ~ length - 1로 재설정 -> value의 key값 "0" ~ "length - 1"로 재설정
     */
    const newWidgetList = {};
    const widgetList = { ...loadedWidget };
    console.log("widgetList", widgetList);
    console.log("====================");
    console.log("삭제되는 위젯");
    console.log(widgetList[key]);
    console.log("====================");
    delete widgetList[key];
    const arrayWidgetList = Object.values(widgetList);
    arrayWidgetList.forEach((value, idx) => {
      const keyIdx = idx + 1;
      value.key = keyIdx.toString();
      newWidgetList[keyIdx.toString()] = value;
    });
    setIsWidgetSelected(isWidgetSelected ? false : null);
    setLoadedWidget(newWidgetList);
    saveWidgetWithServer(newWidgetList);
  };

  const saveWidgetWithServer = async (saveWidget) => {
    let url = IP_ADDRESS + "/user/template";
    url += `?accountIdx=${accountIdx}&userIdx=${userIdx}&userTemplate=${JSON.stringify(
      saveWidget
    )}`;
    // await fetch(url, {
    //   method: "PUT",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({
    //     saveWidget,
    //   }),
    // });
    await axios.put(url, {
      accountIdx,
      userIdx,
      user_template: JSON.stringify(saveWidget),
    });
  };

  const loadWidgetFromServer = async () => {
    let url = IP_ADDRESS + "/user/select";
    url += `?accountIdx=${accountIdx}&userIdx=${userIdx}`;
    const res = await fetch(url);
    const json = await res.json();
    let loadedWidget;
    if (json.status === 500) {
      loadedWidget = {};
    } else {
      loadedWidget = JSON.parse(json.user_template);
    }
    console.log("====================");
    console.log("key list");
    console.log(Object.keys(loadedWidget));
    console.log("====================");
    console.log("====================");
    console.log("attribute key list");
    Object.values(loadedWidget).forEach((value) => console.log(value.key));
    console.log("====================");

    setLoadedWidget(loadedWidget);
  };

  const keyboardShow = () => setIsKeyboardShow((prev) => !prev);
  const keyboradHide = () => setIsKeyboardShow((prev) => !prev);

  const setDefault = () => {
    setSubwayStationName("");
    setSubwayStationList([]);
    setStation({
      subwayStationName: "",
      subwayRouteName: "",
      subwayStationId: "",
    });
    setNewsCategory({
      name: "",
      text: "",
    });
  };

  useEffect(() => {
    if (attributeVisible === false) {
      setDefault();
    }
  }, [attributeVisible]);

  useEffect(() => {
    loadWidgetFromServer();
  }, [isFocused]);

  useEffect(() => {
    Keyboard.addListener("keyboardDidShow", keyboardShow);
    Keyboard.addListener("keyboardDidHide", keyboradHide);
    wrapWidgets();
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
        if (gesture.dy < 0) {
          return;
        }
        detailPosition.setValue({ x: 0, y: gesture.dy });
      },
      onPanResponderRelease: (event, gesture) => {
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
                  {selectedWidget.module_name}
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
                  {selectedWidget.module_name !== "" &&
                    moduleSize[selectedWidget.module_name].map(
                      (widgetSize, idx) => {
                        return (
                          <View
                            key={idx}
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
                                width: 90 * widgetSize.x,
                                height: 90 * widgetSize.y,
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                              onPress={() => {
                                setWidgetListVisible(!widgetListVisible);
                                setWidgetDetailVisible(!widgetDetailVisible);
                                setWidgetSize(widgetSize.x, widgetSize.y);
                                navigation.navigate("PlaceWidgets", {
                                  widget: selectedWidget,
                                  accountIdx,
                                  userIdx,
                                  username,
                                });
                              }}
                            >
                              {selectedWidget.app.theme === "Ionicons" ? (
                                <Ionicons
                                  name={selectedWidget.app.icon}
                                  size={60}
                                  color="white"
                                />
                              ) : selectedWidget.app.theme === "Feather" ? (
                                <Feather
                                  name={selectedWidget.app.icon}
                                  size={60}
                                  color="white"
                                />
                              ) : (
                                <MaterialCommunityIcons
                                  name={selectedWidget.app.icon}
                                  size={60}
                                  color="white"
                                />
                              )}
                            </TouchableOpacity>
                            <Text style={{ color: "white", fontSize: 28 }}>
                              {selectedWidget.module_name === ""
                                ? null
                                : `${widgetSize.x} X ${widgetSize.y}`}
                            </Text>
                          </View>
                        );
                      }
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
            {widgetWrapper.map((wrapper, idx) => (
              <View
                key={idx}
                style={{
                  flexDirection: "row",
                  width: "100%",
                  justifyContent: "center",
                }}
              >
                {wrapper.map((widget, idx) => (
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
                      {widget.app.theme === "Ionicons" ? (
                        <Ionicons
                          name={widget.app.icon}
                          size={80}
                          color="white"
                        />
                      ) : widget.app.theme === "Feather" ? (
                        <Feather
                          name={widget.app.icon}
                          size={80}
                          color="white"
                        />
                      ) : (
                        <MaterialCommunityIcons
                          name={widget.app.icon}
                          size={80}
                          color="white"
                        />
                      )}
                    </View>
                    <Text style={{ color: "white" }}>{widget.module_name}</Text>
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
                {/**
                 * attr_name에 따라 화면 표시 - 지하철 역 선택
                 */}
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
                      placeholderTextColor="#C0C0C0"
                      style={{
                        marginTop: 20,
                        marginBottom: 10,
                      }}
                    />
                    <View
                      style={{
                        ...styles.textContainer,
                        marginBottom: 5,
                        justifyContent: "center",
                        borderColor: station.subwayStationId
                          ? subwayOption[station.subwayRouteName].color
                          : "black",
                      }}
                    >
                      {/**
                       * attr_name: 지하철 - station을 선택했는지 확인 - start
                       */}
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
                    {/**
                     * attr_name: 지하철 - station을 선택했는지 확인 - end
                     */}
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
                      {/**
                       * attr_name: 지하철 - station 검색 결과 - start
                       */}
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
                                  ...styles.textContainer,
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
                    {/**
                     * attr_name: 지하철 - station 검색 결과 - end
                     */}
                    <MyButton
                      onPress={saveStation}
                      text="저장"
                      style={{
                        marginTop: 20,
                      }}
                    />
                  </View>
                ) : /**
                 * attr_name에 따라 화면 표시 - 날씨
                 */
                isWidgetSelected &&
                  editWidget.current.attribute.attr_name === "위치 설정" ? (
                  <View
                    style={{ justifyContent: "center", alignItems: "center" }}
                  >
                    {/**
                     * attr_name: 날씨 - gps 검색 - start
                     */}
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
                      <View style={{ marginBottom: 16 }}>
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
                          onPress={() => setAttributeVisible(!attributeVisible)}
                          text="닫기"
                        />
                      </View>
                    )}
                  </View>
                ) : /**
                 * attr_name: 날씨 - gps 검색 - end
                 */
                /**
                 * attr_name: 카테고리 선택 - 뉴스 카테고리 선택 start
                 */
                isWidgetSelected &&
                  editWidget.current.attribute.attr_name === "카테고리 선택" ? (
                  <View
                    style={{
                      flex: 1,
                      width: "100%",
                      paddingTop: 15,
                      paddingHorizontal: 15,
                      // borderColor: "alice",
                      // backgroundColor: "tomato",
                    }}
                  >
                    <View
                      style={{
                        ...styles.textContainer,
                        justifyContent: "center",
                        alignItems: "center",
                        borderColor: "skyblue",
                        backgroundColor: "aliceblue",
                      }}
                    >
                      <Text style={{ fontSize: 22 }}>
                        {newsCategory.text === ""
                          ? "카테고리를 선택해주세요"
                          : newsCategory.text}
                      </Text>
                    </View>
                    <ScrollView
                      showsVerticalScrollIndicator={false}
                      style={{ flex: 1 }}
                    >
                      {newsCategories.map((category, idx) => {
                        return (
                          <TouchableOpacity
                            key={idx}
                            onPress={() => setNewsCategory(category)}
                          >
                            <View
                              style={{
                                ...styles.textContainer,
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                            >
                              <Text style={{ fontSize: 24 }}>
                                {category.text}
                              </Text>
                            </View>
                          </TouchableOpacity>
                        );
                      })}
                    </ScrollView>
                    <MyButton
                      style={{
                        borderColor: "skyblue",
                        borderWidth: 3,
                        backgroundColor: "aliceblue",
                      }}
                      text={"저장"}
                      onPress={saveNewsCategory}
                    />
                  </View>
                ) : /**
                 * attr_name: Google Calendar 연동 - 달력 Google Calendar 연동 start
                 */
                isWidgetSelected &&
                  editWidget.current.attribute.attr_name ===
                    "Google Calendar 연동" ? (
                  <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View
                      style={{
                        flex: 1,
                        width: "100%",
                        paddingVertical: 20,
                        paddingHorizontal: 20,
                      }}
                    >
                      <MyTextInput
                        placeholder={"Google mail 입력"}
                        placeholderTextColor="#C0C0C0"
                        value={gmail}
                        onChangeText={setGmail}
                        returnKeyType="done"
                        keyboardType="email-address"
                        onSubmitEditing={saveGoogleAPI}
                      />
                      <View>
                        <Text style={{ color: "white", marginBottom: 10 }}>
                          1. 웹에서 Google 로그인 후에 Google Calendar 앱 접속
                          후
                        </Text>
                        <Text style={{ color: "white", marginBottom: 10 }}>
                          우측 상단 톱니바퀴를 눌러 설정에 들어갑니다.
                        </Text>
                        <Text style={{ color: "white", marginBottom: 10 }}>
                          2. "좌측의 내 캘린더의 설정"에서 공유할 캘린더를
                          선택합니다.
                        </Text>
                        <Text style={{ color: "white", marginBottom: 10 }}>
                          3. 선택된 캘린더의 "일정의 액세스 권한"에서 "공개 사용
                          설정"을 체크하시고, 모든 일정 세부사항 보기를
                          선택합니다.
                        </Text>
                      </View>
                      <MyButton
                        style={{
                          borderColor: "skyblue",
                          borderWidth: 3,
                          backgroundColor: "aliceblue",
                        }}
                        text={"Google Calendar API 연동"}
                        onPress={saveGoogleAPI}
                      />
                      <MyButton
                        style={{
                          borderColor: "#FF9090",
                          borderWidth: 3,
                          backgroundColor: "#FFDFDF",
                        }}
                        text={"Google Calendar 연동 해제"}
                        onPress={deleteGoogleAPI}
                      />
                    </View>
                  </TouchableWithoutFeedback>
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
              {isWidgetSelected && editWidget.current.attribute.detail ? (
                <Text
                  style={{
                    color: "white",
                    fontSize: 16,
                    fontWeight: "bold",
                    marginBottom: 20,
                  }}
                >
                  {editWidget.current.attribute.detail}
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
                        username,
                        accountIdx,
                        userIdx,
                        widgetKey: editWidget.current.key,
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
                  navigation.navigate("PlaceWidgets", {
                    widget: editWidget.current,
                    accountIdx,
                    userIdx,
                    username,
                    edit: true,
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
          <Text style={styles.username}>{username}</Text>
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

  textContainer: {
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
