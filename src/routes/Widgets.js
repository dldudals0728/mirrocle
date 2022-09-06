import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { theme } from "../../colors";

function Widgets({ navigation, setVisible }) {
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
    <ScrollView pagingEnabled style={styles.scrollContainer}>
      {widgetList.map((widgetPage, idx) => (
        <View key={idx} style={{ justifyContent: "space-between" }}>
          {widgetPage.map((widgets, idx) => (
            <View key={idx} style={styles.rowStyle}>
              {widgets.map((widget, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => {
                    setVisible(false);
                    navigation.navigate("PlaceWidgets", { widget: widget });
                  }}
                  style={styles.widgetStyle}
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
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    backgroundColor: "white",
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 20,
  },

  rowStyle: {
    marginBottom: 50,
    flexDirection: "row",
    justifyContent: "space-around",
  },

  widgetStyle: {
    borderWidth: 2,
    width: "45%",
    height: 140,
    justifyContent: "center",
    alignItems: "center",
  },
});

export { Widgets };
