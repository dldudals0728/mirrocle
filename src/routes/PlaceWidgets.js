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

const AnimatedBox = Animated.createAnimatedComponent(View);
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

function PlaceWidgets({ navigation, route }) {
  const gridWidth = Math.round(SCREEN_WIDTH / 5);
  const gridHeight = Math.round((SCREEN_HEIGHT - 160) / 10);
  const gridStartWidth = 0;
  const gridStartHeight = 0;
  // 위젯 별 크기에 따른 최대 범위 제한: 검은색 배경 바깥쪽에 배치되지 않도록 제어
  const gridEndWidth =
    SCREEN_WIDTH - gridWidth * (parseInt(route.params.widthSize[0]) / 2 + 1);
  const gridEndHeight =
    SCREEN_HEIGHT -
    160 -
    gridHeight * (parseInt(route.params.heightSize[0]) + 1);
  const position = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
      onPanResponderGrant: (event, gesture) => {
        position.setOffset({
          x: position.x._value,
          y: position.y._value,
        });
      },
      onPanResponderMove: Animated.event(
        [null, { dx: position.x, dy: position.y }],
        {
          useNativeDriver: false,
        }
      ),
      /**
       * @todo grid 2~4열에서 "터치" 시 position.x._value의 값이 확 튀어버리는 현상 발생.
       */
      onPanResponderRelease: (event, gesture) => {
        let currentPosition = 0;
        position.flattenOffset();
        currentX = Math.round(position.x._value);
        currentY = Math.round(position.y._value);
        let moveX = NaN;
        let moveY = NaN;
        const setting = [false, false];
        while (true) {
          if (currentPosition >= 50) {
            // 무한루프 방지. Animated가 튀는 경우가 있음.
            break;
          }

          if (currentX <= gridStartWidth) {
            moveX = gridStartWidth;
          } else if (currentX >= gridEndWidth) {
            moveX = gridEndWidth;
          } else if (
            currentX >=
              gridWidth * currentPosition - Math.round(gridWidth / 2) &&
            currentX <
              gridWidth * (currentPosition + 1) - Math.round(gridWidth / 2)
          ) {
            moveX = gridWidth * currentPosition;
          }

          if (currentY <= gridStartHeight) {
            moveY = gridStartHeight;
          } else if (currentY >= gridEndHeight) {
            moveY = gridEndHeight;
          } else if (
            currentY >=
              gridHeight * currentPosition - Math.round(gridHeight / 2) &&
            currentY <
              gridHeight * (currentPosition + 1) - Math.round(gridHeight / 2)
          ) {
            moveY = gridHeight * currentPosition;
          }
          if (!isNaN(moveX)) {
            setting[0] = true;
          }
          if (!isNaN(moveY)) {
            setting[1] = true;
          }
          if (setting[0] === true && setting[1] === true) {
            break;
          }
          currentPosition += 1;
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
  return (
    <View style={styles.container}>
      {grid.map((row, idx) => (
        <View key={idx} style={{ flexDirection: "row", height: "10%" }}>
          {row.map((col, idx) => (
            <View key={idx} style={styles.gridStyle}>
              <Text style={{ color: "white", fontSize: 18 }}>{col}</Text>
            </View>
          ))}
        </View>
      ))}
      <AnimatedBox
        style={{
          position: "absolute",
          width: route.params.widthSize,
          height: route.params.heightSize,
          top: 39,
          left: 39,
          backgroundColor: "tomato",
          borderWidth: 1,
          transform: [{ translateX: position.x }, { translateY: position.y }],
        }}
        {...panResponder.panHandlers}
      >
        <Text>{route.params.name}</Text>
      </AnimatedBox>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    justifyContent: "center",
    marginTop: 40,
    marginBottom: 120,
    borderWidth: 2,
    borderColor: theme.grey,
  },

  gridStyle: {
    flexDirection: "row",
    width: "20%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    // borderWidth: 1,
    // borderColor: "white",
  },
});

export { PlaceWidgets };
