import { useRef } from "react";
import {
  Alert,
  Animated,
  BackHandler,
  Dimensions,
  PanResponder,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { theme } from "../../colors";
import { Feather } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { MyButton } from "../components/MyButton";

const AnimatedBox = Animated.createAnimatedComponent(View);
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const GRID_MARGIN_TOP = 40;
const GRID_MARGIN_BOTTOM = 120;

function PlaceWidgets({ navigation, route }) {
  BackHandler.addEventListener("hardwareBackPress", () => true);
  const gridSizeRef = useRef({ width: 0, height: 0 });
  const widgetSizeRef = useRef({ width: 0, height: 0 });

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
        }).start(() => {
          const leftTopX = parseInt(Math.ceil(moveX) / widgetCellWidth);
          const leftTopY = parseInt(Math.ceil(moveY) / widgetCellHeight);
          const rightBottomX = leftTopX + (widgetRowCnt - 1);
          const rightBottomY = leftTopY + (widgetColCnt - 1);
          console.log("leftTopX", leftTopX);
          console.log("leftTopY", leftTopY);
          console.log("rightBottomX", rightBottomX);
          console.log("rightBottomY", rightBottomY);
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

  const saveWidgetInfo = () => {
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
        <AnimatedBox
          style={{
            position: "absolute",
            width: route.params.widthSize,
            height: route.params.heightSize,
            top: 0,
            left: 0,
            backgroundColor: "rgba(128, 128, 128, 0.3)",
            borderRadius: 15,
            borderWidth: 1,
            transform: [{ translateX: position.x }, { translateY: position.y }],
            justifyContent: "center",
            alignItems: "center",
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
          onPress={saveWidgetInfo}
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
            Alert.alert("돌아가기", "위젯 배치를 취소하시겠습니까?", [
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
            ]);
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
});

export { PlaceWidgets };
