import { StyleSheet, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

/**
 * @param {number} imageSize default value=100
 * @param {string} imageColor default value="black"
 * @param {number} titleSize
 * @param {string} titleColor default value="black"
 * @param {string} titleWeight default value="700"
 * @param {number} subTextSize
 * @param {string} subTextColor default value="black"
 * @param {string} subTextWeight
 * @param {StyleSheet} style
 */
function Logo({
  imageSize = 100,
  imageColor = "black",
  titleSize,
  titleColor = "black",
  titleWeight = "700",
  subTextSize,
  subTextColor = "black",
  subTextWeight,
  style,
}) {
  return (
    <View
      style={{
        ...style,
        ...styles.container,
      }}
    >
      <MaterialCommunityIcons
        name="mirror-rectangle"
        style={{ fontSize: imageSize, color: imageColor }}
      />
      <View>
        <Text
          style={{
            fontSize: subTextSize,
            color: subTextColor,
            fontWeight: subTextWeight,
          }}
        >
          Smart Mirror
        </Text>
        <Text
          style={{
            fontSize: titleSize,
            color: titleColor,
            fontWeight: titleWeight,
          }}
        >
          Mirrocle
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-end",
  },
});

export { Logo };
