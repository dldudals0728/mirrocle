import { useRef } from "react";
import { Animated, PanResponder, StyleSheet, Text, View } from "react-native";
import { theme } from "../../colors";

const AnimatedBox = Animated.createAnimatedComponent(View);

function PlaceWidgets({ navigation, route }) {
  const position = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: (event, gesture) => {
        position.setOffset({
          x: position.x._value,
          y: position.y._value,
        });
      },
      onPanResponderMove: Animated.event(
        [null, { dx: position.x, dy: position.y }],
        { useNativeDriver: false }
      ),
      onPanResponderRelease: () => {
        position.flattenOffset();
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
              <Text style={{ color: "white" }}>{col}</Text>
            </View>
          ))}
        </View>
      ))}
      <AnimatedBox
        style={{
          position: "absolute",
          width: "20%",
          height: "10%",
          top: 38,
          left: 36,
          backgroundColor: "tomato",
          borderWidth: 1,
          transform: [{ translateX: position.x }, { translateY: position.y }],
        }}
        {...panResponder.panHandlers}
      ></AnimatedBox>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    justifyContent: "center",
    marginHorizontal: 10,
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
  },
});

export { PlaceWidgets };
