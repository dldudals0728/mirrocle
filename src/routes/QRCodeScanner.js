import { useEffect, useState } from "react";
import { BarCodeScanner } from "expo-barcode-scanner";
import { StyleSheet, View } from "react-native";
import { MyButton } from "../components/MyButton";

function QRCodeScanner({ navigation, route }) {
  const { accountIdx, mirrorIdx } = route.params;
  const [hasPermission, setHasPermission] = useState(false);
  useEffect(() => {
    const getPermission = async () => {
      /**
       * result
       * 허용 시: {"canAskAgain": true, "expires": "never", "granted": true, "status": "granted"}
       * 거절 시: {"canAskAgain": true, "expires": "never", "granted": false, "status": "denied"}
       */
      const result = await BarCodeScanner.requestPermissionsAsync();
      console.log(result);
      setHasPermission(result.status === "granted");
    };
    getPermission();
  }),
    [];

  const handleQRCodeScanned = ({ type, data }) => {
    navigation.reset({
      routes: [
        {
          name: "ConnectMirrocle",
          params: {
            Account_idx: accountIdx,
            mirrorIdx,
            SN: data,
          },
        },
      ],
    });
  };

  return (
    <View style={styles.container}>
      <BarCodeScanner
        onBarCodeScanned={handleQRCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />
      <View style={styles.buttonContainer}>
        <MyButton
          text="돌아가기"
          style={{ backgroundColor: "#000" }}
          textStyle={{ color: "white" }}
          onPress={() => navigation.pop()}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },

  buttonContainer: {
    position: "absolute",
    bottom: 20,
    width: "100%",
  },
});
export { QRCodeScanner };
