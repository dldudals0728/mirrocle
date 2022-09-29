import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  BackHandler,
  Dimensions,
  PanResponder,
  StatusBar,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  Vibration,
  View,
} from "react-native";
import { theme } from "../../colors";
import { Feather } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { MyButton } from "../components/MyButton";
import { IP_ADDRESS } from "../../temp/IPAddress";

const AnimatedBox = Animated.createAnimatedComponent(View);
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const GRID_MARGIN_TOP = 40;
const GRID_MARGIN_BOTTOM = 120;

function PlaceWidgets({ navigation, route }) {
  BackHandler.addEventListener("hardwareBackPress", () => true);
  const gridSizeRef = useRef({ width: 0, height: 0 });
  const widgetSizeRef = useRef({ width: 0, height: 0 });
  const widgetLocRef = useRef({ left: 0, top: 0, width: 0, height: 0 });
  const [loading, setLoading] = useState(true);
  const [DBLoading, setDBLoading] = useState(true);
  const [widgetList, setWidgetList] = useState([]);
  /**
   * @todo PanResponder에서 widgetList를 이용하려 했으나, 비동기로 인해 state가 바뀌기 전에 panResponder에서 참조하여
   *      값이 바뀌지 않은 상태로 저장됨. 이를 해결하기 위해 widgetListRef로 조작
   */
  const widgetListRef = useRef([]);

  const loadWidgetFromDB = () => {
    let url = "http://" + IP_ADDRESS + ":8080/mirrocle/template";
    fetch(url)
      .then((response) => {
        response.json().then((result) => {
          setWidgetList((prev) => {
            return result;
          });

          console.log(result);
          console.log(typeof result);
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    loadWidgetFromDB();

    setDBLoading((prev) => !prev);
    console.log(widgetLocRef);
    return () => setLoading((prev) => !prev);
  }, []);

  const widgetRowCnt =
    parseInt(
      route.params.widthSize.length === 3
        ? route.params.widthSize[0]
        : route.params.widthSize.slice(0, 2)
    ) / 2;
  const widgetColCnt = parseInt(
    route.params.heightSize.length === 3
      ? route.params.heightSize[0]
      : route.params.heightSize.slice(0, 2)
  );

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
    gridSizeRef.current.width = layoutInfo.width;
    gridSizeRef.current.height = layoutInfo.height;
  };
  const onLayoutwidget = (e) => {
    const layoutInfo = e.nativeEvent.layout;
    widgetSizeRef.current.width = layoutInfo.width;
    widgetSizeRef.current.height = layoutInfo.height;
    setLoading((prev) => !prev);

    /**
     * @todo 왜 onPanResponderRelease보다 leftTopX, leftTopY가 1씩 더 크지 ?????
     */
    const gridX = widgetSizeRef.current.width / widgetRowCnt;
    const gridY = widgetSizeRef.current.height / widgetColCnt;
    const widgetCellWidth = Math.floor(gridX);
    const widgetCellHeight = Math.floor(gridY);
    const leftTopX = parseInt(Math.ceil(gridX) / widgetCellWidth) - 1;
    const leftTopY = parseInt(Math.ceil(gridY) / widgetCellHeight) - 1;

    console.log("========== onLayout ==========");
    console.log("leftTopX", leftTopX);
    console.log("leftTopY", leftTopY);
    console.log("width", widgetRowCnt);
    console.log("height", widgetColCnt);
    console.log("========== onLayout ==========");
    widgetLocRef.current.left = leftTopX;
    widgetLocRef.current.top = leftTopY;
    widgetLocRef.current.width = widgetRowCnt;
    widgetLocRef.current.height = widgetColCnt;
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
      // onPanResponderMove: (event, gesture) => {
      //   let { dx, dy } = gesture;
      //   let { moveX, moveY } = gesture;
      //   const { x0, y0 } = gesture;
      //   if (moveY >= gridSizeRef.current.height) {
      //     position.setValue({ x: dx, y: gridSizeRef.current.height });
      //     position.flattenOffset();
      //     return;
      //   } else {
      //     position.setValue({ x: 0, y: 0 });
      //     position.setValue({ x: dx, y: dy });
      //   }
      // },
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
        console.log(gesture);
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
          console.log(currentPosition);
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
        console.log(widgetList);
        console.log(widgetListRef.current);
        widgetListRef.current.map((widget, idx) => {
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
            x: parseInt(Math.ceil(moveX) / widgetCellWidth),
            y: parseInt(Math.ceil(moveY) / widgetCellHeight),
          };

          console.log("=============== start ================");
          console.log("loadedWidget.x:", loadedWidget.x);
          console.log("currentWidget.x:", currentWidget.x);
          console.log("loadedWidget.y:", loadedWidget.y);
          console.log("currentWidget.y:", currentWidget.y);
          console.log("===============================");
          console.log("loadedWidget.width:", loadedWidget.width);
          console.log("currentWidget.width:", currentWidget.width);
          console.log("loadedWidget.height:", loadedWidget.height);
          console.log("currentWidget.height:", currentWidget.height);
          console.log("=============== end ================");

          if (
            loadedWidget.x >= currentWidget.x + currentWidget.width ||
            loadedWidget.x + loadedWidget.width <= currentWidget.x ||
            loadedWidget.y >= currentWidget.y + currentWidget.height ||
            loadedWidget.y + loadedWidget.height <= currentWidget.y
          ) {
            console.log(`${widget.module_name} 위젯과 겹치지 않습니다.`);
          } else {
            console.log(`${widget.module_name} 위젯과 겹칩니다.`);
          }
        });
        Animated.spring(position, {
          toValue: { x: moveX, y: moveY },
          useNativeDriver: false,
        }).start(() => {
          const leftTopX = parseInt(Math.ceil(moveX) / widgetCellWidth);
          const leftTopY = parseInt(Math.ceil(moveY) / widgetCellHeight);
          const rightBottomX = leftTopX + (widgetRowCnt - 1);
          const rightBottomY = leftTopY + (widgetColCnt - 1);
          console.log("========== move end ==========");
          console.log("leftTopX", leftTopX);
          console.log("leftTopY", leftTopY);
          console.log("rightBottomX", rightBottomX);
          console.log("rightBottomY", rightBottomY);
          console.log("moveX:", moveX);
          console.log("moveY:", moveY);
          console.log("========== move end ==========");
          /*
          위의 로그로 알게된 것(best): 모든 위젯의 위치는 "좌측 상단" 기준이다 !!!!!!!!!!!!!!!!!!!!!!!!!!!
          */
        });
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
    console.log("=========================");
    console.log("x:", coordinate.x);
    console.log("y:", coordinate.y);
    console.log("=========================");
    console.log(widgetList);
    let isStack = false;
    widgetList.map((widget, idx) => {
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
        console.log(`${widget.module_name} 위젯과 겹치지 않습니다.`);
      } else {
        console.log(`${widget.module_name} 위젯과 겹칩니다.`);
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
            Alert.alert("완료", "위젯이 성공적으로 배치되었습니다.", [
              {
                text: "OK",
              },
            ]);
            // navigation.navigate("MainScreen");
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
          : widgetList.map((widget, idx) => {
              const rowPosition = widgetSizeRef.current.width / widgetRowCnt;
              const columnPosition =
                widgetSizeRef.current.height / widgetColCnt;
              return (
                <TouchableWithoutFeedback
                  key={idx}
                  onLongPress={() => {
                    Vibration.vibrate();
                  }}
                >
                  <View
                    style={{
                      ...styles.widgetStyle,
                      top: columnPosition * widget.coordinate.y,
                      left: rowPosition * widget.coordinate.x,
                      width: `${widget.size.width * 20}%`,
                      height: `${widget.size.height * 10}%`,
                    }}
                  >
                    <Text style={{ color: "white" }}>{widget.module_name}</Text>
                  </View>
                </TouchableWithoutFeedback>
              );
            })}
        {DBLoading ? null : (
          <AnimatedBox
            style={{
              ...styles.widgetStyle,
              top: 0,
              left: 0,
              width: route.params.widthSize,
              height: route.params.heightSize,
              transform: [
                { translateX: position.x },
                { translateY: position.y },
              ],
            }}
            {...panResponder.panHandlers}
            onLayout={onLayoutwidget}
          >
            <Text style={{ color: "white" }}>{route.params.name}</Text>
            {route.params.theme == "Ionicons" ? (
              <Ionicons name={route.params.icon} size={36} color="white" />
            ) : (
              <Feather name={route.params.icon} size={36} color="white" />
            )}
          </AnimatedBox>
        )}
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
                    // reset으로 하니까 화면이 오른쪽에서 나와서 뒤로가기의 느낌이 안산다...
                    // navigation.reset({ routes: [{ name: "MainScreen" }] });
                    navigation.navigate("MainScreen");
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
