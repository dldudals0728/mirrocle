import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { theme } from "../../colors";

function Widgets({ navigation }) {
  const widgetList = [
    [
      ["날씨", "시간"],
      ["교통정보", "네비게이션(도착예상시간)"],
      ["뉴스", "주식"],
    ],
    [
      ["ToDo", "달력"],
      ["", ""],
      ["", ""],
    ],
    [
      ["유튜브", "구글 어시스턴트"],
      ["알림(카카오톡)", "알림(페이스북)"],
      ["알림(인스타그램)", "!중요! 알림(코스모스, 과제)"],
    ],
  ];
  return (
    <View style={styles.container}>
      <ScrollView
        pagingEnabled
        style={{
          backgroundColor: "white",
          borderRadius: 20,
          paddingVertical: 20,
          paddingHorizontal: 20,
        }}
      >
        {widgetList.map((widgetPage, idx) => (
          <View key={idx} style={{ justifyContent: "space-between" }}>
            {widgetPage.map((widgets, idx) => (
              <View
                key={idx}
                style={{
                  marginBottom: 50,
                  flexDirection: "row",
                  justifyContent: "space-around",
                }}
              >
                {widgets.map((widget, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => navigation.navigate("PlaceWidgets")}
                    style={{
                      borderWidth: 2,
                      width: "45%",
                      height: 140,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <View>
                      <Text>{widget}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            ))}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.baeminBg,
    justifyContent: "center",
    paddingHorizontal: 10,
    paddingVertical: 40,
  },
});

export { Widgets };
