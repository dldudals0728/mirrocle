import { PanResponder, StyleSheet, Text, View } from "react-native";
import { theme } from "../../colors";

function PlaceWidgets({ navigation, route }) {
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
  });
  console.log(panResponder.panHandlers);
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
      <View
        style={{
          position: "absolute",
          width: "20%",
          height: "10%",
          top: 38,
          left: 36,
          borderColor: "tomato",
          borderWidth: 1,
        }}
      ></View>
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
