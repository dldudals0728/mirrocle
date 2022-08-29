import {
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
// import { PERMISSIONS, request } from "react-native-permissions";
import { theme } from "./colors";

function ConnectMirrocle() {
  // const requectPermissions = async () => {
  //   console.log(Platform.OS);
  //   // error
  //   const result = await request(PERMISSIONS.IOS.CAMERA);
  //   console.log(result);
  // };
  return (
    <View style={styles.container}>
      <View>
        <TextInput
          style={styles.identification}
          placeholder="Mirrocle 고유번호 입력"
        ></TextInput>
      </View>
      <View>
        <TouchableWithoutFeedback>
          <View style={styles.connection}>
            <Text style={styles.connectionText}>연결하기</Text>
          </View>
        </TouchableWithoutFeedback>
        <View style={{ alignItems: "center", marginBottom: 20 }}>
          <Text>또는</Text>
        </View>
        <TouchableWithoutFeedback onPress={requectPermissions}>
          <View style={styles.connection}>
            <Text style={styles.connectionText}>QR Code 촬영</Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.baeminBg,
    justifyContent: "center",
    paddingHorizontal: 40,
  },

  identification: {
    fontSize: 16,
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderRadius: 10,
    marginBottom: 20,
  },

  connection: {
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
  },

  connectionText: {
    fontSize: 16,
    fontWeight: "700",
  },
});

export { ConnectMirrocle };
