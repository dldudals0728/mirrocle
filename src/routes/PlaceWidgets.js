import { StyleSheet, Text, View } from "react-native";
import { theme } from "../../colors";

function PlaceWidgets({ navigation, route }) {
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
              <Text>{idx === 0 ? route.params.widget : col}</Text>
            </View>
          ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
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
