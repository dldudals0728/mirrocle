import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { theme } from "../../colors";

function MyButton({ text, onPress, style, textStyle }) {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={{ ...styles.btnStyle, ...style }}>
        <Text style={{ ...styles.btnTextStyle, ...textStyle }}>{text}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btnStyle: {
    textAlign: "center",
    alignItems: "center",
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderRadius: 10,
    marginBottom: 20,
    borderStyle: "solid",
    borderColor: "black",
    borderWidth: 1,
    backgroundColor: theme.baeminBg,
  },

  btnTextStyle: {
    fontSize: 16,
    fontWeight: "700",
  },
});

export { MyButton };
