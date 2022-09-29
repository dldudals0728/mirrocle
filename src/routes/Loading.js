import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import { useEffect } from "react";
import { Logo } from "../components/Logo";
import { theme } from "../../colors";

function Loading({ navigation }) {
  const goToLogin = () => {
    // logo fade in out 추가
    setTimeout(() => {
      navigation.reset({ routes: [{ name: "Login" }] });
    }, 3000);
  };
  useEffect(goToLogin, []);
  return (
    <View style={styles.container}>
      <Logo
        imageSize={150}
        titleSize={50}
        subTextSize={25}
        subTextColor="white"
        subTextWeight="600"
      />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.baeminBg,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
});

export { Loading };
