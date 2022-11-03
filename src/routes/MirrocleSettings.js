import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { theme } from "../../colors";
import { IP_ADDRESS } from "../../temp/IPAddress";
import { Logo } from "../components/Logo";
import { MyButton } from "../components/MyButton";

function MirrocleSettings({ navigation, route }) {
  const { accountIdx } = route.params;
  const [serialNumber, setSirialNumber] = useState("");

  const getConnectedSerialNumber = async () => {
    let url = IP_ADDRESS + "/mirror/serial";
    url += `?accountIndex=${accountIdx}`;

    const res = await fetch(url);
    const json = await res.json();
    if (json.status === 200) {
      setSirialNumber(json.serial_num);
    } else {
      setSirialNumber("연결 오류");
    }
  };

  useEffect(() => {
    getConnectedSerialNumber();
  });

  return (
    <View style={styles.container}>
      <View style={{ alignItems: "flex-start", marginBottom: 20 }}>
        <Logo imageSize={40} titleSize={15} subTextSize={8} />
      </View>
      <ScrollView>
        {/* <MyButton text="버튼 설정" /> */}
        {/**
         * @todo 시간에 따른 디스플레이 자동 변경! 대박
         */}
        {/* <MyButton text="Mirrocle 시간 설정" /> */}
        <MyButton
          text="사용자 관리"
          onPress={() => navigation.navigate("UserEdit", { accountIdx })}
        />
        <View style={styles.setting}>
          <Text style={styles.title}>Mirrocle S/N</Text>
          <View style={styles.setting__option}>
            <Text>{serialNumber}</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.baeminBg,
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingTop: 50,
  },

  title: {},

  setting: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  setting__option: {
    flexDirection: "row",
    justifyContent: "center",
    paddingBottom: 3,
    borderBottomWidth: 1,
    width: "40%",
  },
});

export { MirrocleSettings };
