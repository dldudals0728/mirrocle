import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  PanResponder,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { theme } from "../../colors";
import { Feather } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";

const AnimatedBox = Animated.createAnimatedComponent(View);
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const GRID_MARGIN_TOP = 40;
const GRID_MARGIN_BOTTOM = 120;

function PlaceWidgets({ navigation, route }) {
  const gridWidth = Math.round(SCREEN_WIDTH / 5);
  const gridHeight = Math.round(
    (SCREEN_HEIGHT - (GRID_MARGIN_TOP + GRID_MARGIN_BOTTOM)) / 10
  );
  const gridStartWidth = 0;
  const gridStartHeight = 0;
  // 위젯 별 크기에 따른 최대 범위 제한: 검은색 배경 바깥쪽에 배치되지 않도록 제어
  const gridEndWidth =
    SCREEN_WIDTH - gridWidth * (parseInt(route.params.widthSize[0]) / 2);
  const gridEndHeight =
    SCREEN_HEIGHT -
    (GRID_MARGIN_TOP + GRID_MARGIN_BOTTOM) -
    gridHeight * parseInt(route.params.heightSize[0]);

  const widgetSizeRef = useRef({ width: 0, height: 0 });
  const gridSizeRef = useRef({ width: 0, height: 0 });

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
        const location = {
          row: { value: 0, setting: false },
          column: { value: 0, setting: false },
        };
        // 터치 시 튀는 문제를 해결하니, 터치를 해제할 때 튀는 문제 발생 ==> 해결(원인: flattenOffset())
        if (gesture.dx === 0 && gesture.dy === 0) {
          return;
        }
        position.flattenOffset();
        currentX = Math.round(position.x._value);
        currentY = Math.round(position.y._value);
        let moveX = NaN;
        let moveY = NaN;
        // 각 위젯의 크기별로 positioning
        const row =
          widgetSizeRef.current.width /
          (parseInt(route.params.widthSize[0]) / 2);
        const col =
          widgetSizeRef.current.height / parseInt(route.params.heightSize[0]);
        // const setting = [false, false];
        while (true) {
          if (currentX <= gridStartWidth) {
            moveX = gridStartWidth;
          } else if (currentX >= gridEndWidth) {
            moveX = row * (5 - parseInt(route.params.widthSize[0]) / 2);
          } else if (
            currentX >= row * currentPosition - Math.round(row / 2) &&
            currentX < row * (currentPosition + 1) - Math.round(row / 2)
          ) {
            moveX = row * currentPosition;
            location.row.value = currentPosition;
          }

          if (currentY <= gridStartHeight) {
            moveY = gridStartHeight;
          } else if (currentY >= gridEndHeight) {
            moveY = col * (10 - parseInt(route.params.heightSize[0]));
          } else if (
            currentY >= col * currentPosition - Math.round(col / 2) &&
            currentY < col * (currentPosition + 1) - Math.round(col / 2)
          ) {
            moveY = col * currentPosition;
            location.column.value = currentPosition;
          }
          if (!isNaN(moveX)) {
            /**
             * @todo location.row(column).setting 변경을 저장버튼을 눌렀을 때 좌표를 받아서 저장하도록 해야 함
             */
            location.row.setting = true;
          }
          if (!isNaN(moveY)) {
            location.column.setting = true;
          }
          if (
            location.row.setting === true &&
            location.column.setting === true
          ) {
            console.log("location.row.value:", location.row.value);
            console.log("location.column.value:", location.column.value);
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
  const onLayout = (e) => {
    const layoutInfo = e.nativeEvent.layout;
    gridSizeRef.current.width = layoutInfo.width;
    gridSizeRef.current.height = layoutInfo.height;
  };
  const onLayoutwidget = (e) => {
    const layoutInfo = e.nativeEvent.layout;
    widgetSizeRef.current.width = layoutInfo.width;
    widgetSizeRef.current.height = layoutInfo.height;
  };
  return (
    <View style={styles.container} onLayout={onLayout}>
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
  );
}

const styles = StyleSheet.create({
  container: {
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
