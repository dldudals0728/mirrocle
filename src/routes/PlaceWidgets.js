import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  BackHandler,
  Dimensions,
  Modal,
  PanResponder,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { theme } from "../../colors";
import { Feather } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { MyButton } from "../components/MyButton";
import { IP_ADDRESS } from "../../temp/IPAddress";

const AnimatedBox = Animated.createAnimatedComponent(View);
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const GRID_MARGIN_TOP = 40;
const GRID_MARGIN_BOTTOM = 120;

function PlaceWidgets({ navigation, route }) {
  const { accountIdx, userIdx, username, widget } = route.params;
  console.log("Place Widgets => widget:", widget);
  const isEdit = route.params.edit === true ? true : false;
  const widgetSizeRef = useRef({ width: 0, height: 0 });
  const [loading, setLoading] = useState(true);
  const [DBLoading, setDBLoading] = useState(false);
  const [widgetList, setWidgetList] = useState({});
  /**
   * @todo PanResponder에서 widgetList를 이용하려 했으나, 비동기로 인해 state가 바뀌기 전에 panResponder에서 참조하여
   *      값이 바뀌지 않은 상태로 저장됨. 이를 해결하기 위해 widgetListRef로 조작
   */
  const widgetListRef = useRef([]);

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

    if (isEdit) {
      delete loadedWidget[widget.key];
    }
    setWidgetList(loadedWidget);
  };

  const saveWidgetWithServer = async (saveWidget) => {
    console.log("===========================");
    console.log("저장될 위젯 정보");
    console.log(saveWidget);
    console.log("===========================");
    let url = IP_ADDRESS + "/user/template";
    url += `?accountIdx=${accountIdx}&userIdx=${userIdx}&userTemplate=${JSON.stringify(
      saveWidget
    )}`;
    await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        saveWidget,
      }),
    })
      .then(() => console.log("fetch then"))
      .catch((error) => console.log("error:", error));
    console.log("save widget end");
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => true
    );
    loadWidgetFromServer();
    setDBLoading((prev) => !prev);
    return () => {
      console.log("화면 닫힘!");
      setLoading((prev) => !prev);
      backHandler.remove();
    };
  }, []);

  const widgetRowCnt = widget.size.width;
  const widgetColCnt = widget.size.height;

  const gridWidth = Math.round(SCREEN_WIDTH / 5);
  const gridHeight = Math.round(
    (SCREEN_HEIGHT - (GRID_MARGIN_TOP + GRID_MARGIN_BOTTOM)) / 10
  );
  const gridStartWidth = 0;
  const gridStartHeight = 0;
  // 위젯 별 크기에 따른 최대 범위 제한: 검은색 배경 바깥쪽에 배치되지 않도록 제어
  const gridEndWidth = SCREEN_WIDTH - gridWidth * widgetRowCnt;
  const gridEndHeight =
    SCREEN_HEIGHT -
    (GRID_MARGIN_TOP + GRID_MARGIN_BOTTOM) -
    gridHeight * widgetColCnt;

  const onLayoutGrid = (e) => {
    const layoutInfo = e.nativeEvent.layout;

    widgetSizeRef.current.width = (layoutInfo.width / 5) * widget.size.width;
    widgetSizeRef.current.height =
      (layoutInfo.height / 10) * widget.size.height;

    setLoading((prev) => !prev);
  };

  const onLayout = () => {
    /**
     * @todo Animated가 언젠 되고 언젠 안되네
     */
    const x =
      (widgetSizeRef.current.width / widget.size.width) * widget.coordinate.x;
    const y =
      (widgetSizeRef.current.height / widget.size.height) * widget.coordinate.y;
    Animated.spring(position, {
      toValue: { x: x, y: y },
      useNativeDriver: false,
    }).start();
    // position.setValue({ x: x, y: y });
  };

  const position = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
      onPanResponderGrant: (event, gesture) => {
        // 하... 튀는 문제 해결
        position.stopAnimation();
        position.setOffset({
          x: position.x._value,
          y: position.y._value,
        });
      },
      onPanResponderMove: Animated.event(
        [null, { dx: position.x, dy: position.y }],
        {
          useNativeDriver: false,
          listener: (event, gesture) => {},
        }
      ),
      /**
       * @todo grid 2~4열에서 "터치" 시 position.x._value의 값이 확 튀어버리는 현상 발생: stopAnimation()으로 해결
       */
      onPanResponderRelease: (event, gesture) => {
        let currentPosition = 0;
        // 터치 시 튀는 문제를 해결하니, 터치를 해제할 때 튀는 문제 발생 ==> 해결(원인: flattenOffset())
        if (gesture.dx === 0 && gesture.dy === 0) {
          return;
        }
        position.flattenOffset();
        currentX = Math.round(position.x._value);
        currentY = Math.round(position.y._value);
        let moveX = NaN;
        let moveY = NaN;
        const setting = [false, false];
        // 각 위젯의 크기별로 positioning
        const gridX = widgetSizeRef.current.width / widgetRowCnt;
        const gridY = widgetSizeRef.current.height / widgetColCnt;
        const widgetCellWidth = Math.floor(gridX);
        const widgetCellHeight = Math.floor(gridY);
        // const setting = [false, false];
        while (true) {
          /**
           * @param currentPosition grid의 위치를 계산. 4X4까지는 더 큰 거리만큼 움직이지만, Y축으로 4 이상 움직일 경우 그 이상으로 넘어감
           */
          if (currentX <= gridStartWidth) {
            moveX = gridStartWidth;
          } else if (currentX >= gridEndWidth) {
            moveX = gridX * (5 - widgetRowCnt);
          } else if (
            currentX >= gridX * currentPosition - Math.round(gridX / 2) &&
            currentX < gridX * (currentPosition + 1) - Math.round(gridX / 2)
          ) {
            moveX = gridX * currentPosition;
          }

          if (currentY <= gridStartHeight) {
            moveY = gridStartHeight;
          } else if (currentY >= gridEndHeight) {
            moveY = gridY * (10 - widgetColCnt);
          } else if (
            currentY >= gridY * currentPosition - Math.round(gridY / 2) &&
            currentY < gridY * (currentPosition + 1) - Math.round(gridY / 2)
          ) {
            moveY = gridY * currentPosition;
          }
          if (!isNaN(moveX)) {
            /**
             * @todo location.row(column).setting 변경을 저장버튼을 눌렀을 때 좌표를 받아서 저장하도록 해야 함
             */
            setting[0] = true;
          }
          if (!isNaN(moveY)) {
            setting[1] = true;
          }
          if (setting[0] && setting[1]) {
            break;
          }
          currentPosition += 1;

          if (currentPosition === 50) {
            /**
             * @todo 예외처리
             */
            break;
          }
        }
        Animated.spring(position, {
          toValue: { x: moveX, y: moveY },
          useNativeDriver: false,
        }).start();
      },
    })
  ).current;
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

  const savewidgetList = () => {
    const widgetCellWidth = Math.floor(
      widgetSizeRef.current.width / widgetRowCnt
    );
    const widgetCellHeight = Math.floor(
      widgetSizeRef.current.height / widgetColCnt
    );

    const positionX = Math.ceil(position.x._value);
    const positionY = Math.ceil(position.y._value);

    const coordinate = {
      x: parseInt(positionX / widgetCellWidth),
      y: parseInt(positionY / widgetCellHeight),
    };

    /**
     * @todo 서버로 좌표 전달 => 위젯이 겹친다 ? 오류 코드 및 위젯 재배치 : 위젯 스타일 적용
     */
    let isStack = false;
    Object.keys(widgetList).map((key, idx) => {
      const widget = widgetList[key];
      const loadedWidget = {
        width: widget.size.width,
        height: widget.size.height,
        // left top x, y
        x: widget.coordinate.x,
        y: widget.coordinate.y,
      };

      const currentWidget = {
        width: widgetRowCnt,
        height: widgetColCnt,
        // left top x, y
        x: coordinate.x,
        y: coordinate.y,
      };

      if (
        loadedWidget.x >= currentWidget.x + currentWidget.width ||
        loadedWidget.x + loadedWidget.width <= currentWidget.x ||
        loadedWidget.y >= currentWidget.y + currentWidget.height ||
        loadedWidget.y + loadedWidget.height <= currentWidget.y
      ) {
      } else {
        isStack = true;
      }
    });
    if (isStack) {
      Alert.alert("위치 오류", "위젯은 서로 겹칠 수 없습니다!", [
        {
          text: "OK",
        },
      ]);
    } else {
      Alert.alert("위젯 정보 저장", "위젯 정보를 저장하시겠습니까?", [
        {
          text: "cancel",
        },
        {
          text: "OK",
          onPress: () => {
            if (isEdit) {
              const newWidget = { ...widget };
              const widgetKey = widget.key;
              newWidget.coordinate.x = coordinate.x;
              newWidget.coordinate.y = coordinate.y;
              const editedWidget = { ...widgetList };
              delete editedWidget[widget.key];
              const saveWidget = { ...editedWidget, [widgetKey]: newWidget };
              saveWidgetWithServer(saveWidget);
            } else {
              const newWidget = { ...widget };
              const newKey = Object.keys(widgetList).length + 1;
              newWidget.coordinate.x = coordinate.x;
              newWidget.coordinate.y = coordinate.y;
              newWidget.key = newKey;
              const saveWidget = { ...widgetList, [newKey]: newWidget };
              saveWidgetWithServer(saveWidget);
              console.log(
                "현재 widget list 길이:",
                Object.keys(widgetList).length
              );
              console.log("현재 widget key list:", Object.keys(widgetList));
              console.log("새로 들어갈 widget의 key값:", newKey);
            }
            Alert.alert("완료", "위젯이 성공적으로 배치되었습니다.", [
              {
                text: "OK",
              },
            ]);
            navigation.navigate("MainScreen", {
              accountIdx,
              userIdx,
              username,
            });
          },
        },
      ]);
    }
  };
  return (
    <View style={{ flex: 1, backgroundColor: "black" }}>
      <View style={styles.gridContainer} onLayout={onLayoutGrid}>
        {grid.map((row, idx) => (
          <View key={idx} style={{ flexDirection: "row", height: "10%" }}>
            {row.map((col, idx) => (
              <View key={idx} style={styles.gridStyle} />
            ))}
          </View>
        ))}
        {loading
          ? null
          : Object.keys(widgetList).map((key, idx) => {
              const widget = widgetList[key];
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
        {DBLoading ? (
          <AnimatedBox
            style={{
              ...styles.widgetStyle,
              left: 0,
              top: 0,
              width: `${widget.size.width * 20}%`,
              height: `${widget.size.height * 10}%`,
              // backgroundColor: "transparent" 하면 애니메이션이 제대로 되네...? => 테두리를 transparent로!
              borderColor: "transparent",
              transform: [
                { translateX: position.x },
                { translateY: position.y },
              ],
            }}
            {...panResponder.panHandlers}
            onLayout={onLayout}
          >
            <Text style={{ color: "white" }}>{widget.module_name}</Text>
            {widget.app.theme === "Ionicons" ? (
              <Ionicons name={widget.app.icon} size={36} color="white" />
            ) : widget.app.theme === "Feather" ? (
              <Feather name={widget.app.icon} size={36} color="white" />
            ) : (
              <MaterialCommunityIcons
                name={widget.app.icon}
                size={36}
                color="white"
              />
            )}
          </AnimatedBox>
        ) : null}
      </View>
      <View
        style={{
          position: "absolute",
          flexDirection: "row",
          justifyContent: "space-around",
          width: SCREEN_WIDTH,
          bottom: SCREEN_WIDTH * 0.05,
        }}
      >
        <MyButton
          text="저장"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.3)",
            marginTop: 20,
            width: SCREEN_WIDTH * 0.4,
            borderColor: "white",
          }}
          textStyle={{
            color: "white",
          }}
          onPress={savewidgetList}
        />
        <MyButton
          text="돌아가기"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.3)",
            marginTop: 20,
            width: SCREEN_WIDTH * 0.4,
            borderColor: "white",
          }}
          textStyle={{
            color: "white",
          }}
          onPress={() => {
            Alert.alert(
              "돌아가기",
              "위젯 배치를 취소하고\n 메인 화면으로 돌아가시겠습니까?",
              [
                {
                  text: "cancel",
                },
                {
                  text: "OK",
                  onPress: () => {
                    navigation.pop();
                  },
                },
              ]
            );
          }}
        />
      </View>
      <StatusBar barStyle="light-content" />
    </View>
  );
}

const styles = StyleSheet.create({
  gridContainer: {
    flex: 1,
    backgroundColor: "black",
    justifyContent: "center",
    marginTop: GRID_MARGIN_TOP,
    marginBottom: GRID_MARGIN_BOTTOM,
    borderColor: theme.grey,
  },

  gridStyle: {
    flexDirection: "row",
    width: "20%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 0.3,
    borderColor: "rgba(128, 128, 128, 0.3)",
    borderStyle: "solid",
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

export { PlaceWidgets };
