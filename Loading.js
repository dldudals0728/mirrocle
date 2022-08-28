import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useEffect } from "react";

function Loading({ navigation }) {
  const goToLogin = () => {
    // logo fade in out 추가
    setTimeout(() => {
      navigation.navigate("Login");
    }, 3000);
  };
  useEffect(goToLogin, []);
  return (
    <View style={styles.container}>
      <View style={styles.banner}>
        <MaterialCommunityIcons
          name="mirror-rectangle"
          size={150}
          color="black"
        />
        <View>
          <Text style={styles.bannerText}>Smart Mirror</Text>
          <Text style={styles.bannerTitle}>Mirrocle</Text>
        </View>
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2AC1BC",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },

  banner: {
    flexDirection: "row",
    alignItems: "flex-end",
  },

  bannerText: {
    color: "white",
    fontSize: 25,
    fontWeight: "600",
  },

  bannerTitle: {
    fontSize: 50,
    fontWeight: "700",
  },
});

export { Loading };
