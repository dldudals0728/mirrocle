import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { theme } from "../../colors";
import { Feather } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";

function Widgets({ navigation, setVisible }) {
  const [selectedWidget, setSelectedWidget] = useState({});
  const [touch, setTouch] = useState(false);
  const widgetList = [
    [
      [
        { theme: "Ionicons", icon: "ios-sunny", message: "날씨 위젯" },
        { theme: "Feather", icon: "clock", message: "시계" },
      ],
      [
        { theme: "Ionicons", icon: "bus", message: "교통정보" },
        {
          theme: "Ionicons",
          icon: "navigate",
          message: "네비게이션(도착 예상시간)",
        },
      ],
      [
        { theme: "Ionicons", icon: "newspaper", message: "뉴스" },
        { theme: "Feather", icon: "dollar-sign", message: "주식" },
      ],
    ],
    [
      [
        { theme: "Ionicons", icon: "list", message: "ToDo" },
        { theme: "Ionicons", icon: "calendar", message: "달력" },
      ],
      ["", ""],
      ["", ""],
    ],
    [
      [
        { theme: "Ionicons", icon: "logo-youtube", message: "유튜브 위젯" },
        { theme: "Ionicons", icon: "logo-google", message: "구글 어시스턴트" },
      ],
      [
        { theme: "Feather", icon: "message-square", message: "카카오톡 알림" },
        { theme: "Ionicons", icon: "logo-facebook", message: "페이스북 알림" },
      ],
      [
        {
          theme: "Ionicons",
          icon: "logo-instagram",
          message: "인스타그램 알림",
        },
        { theme: "Feather", icon: "book-open", message: "코스모스" },
      ],
    ],
  ];
  return (
    <View>
      <Modal visible={touch} animationType="animated" transparent={true}>
        <View
          style={{
            ...styles.widgetContainer,
            marginTop: 80,
            justifyContent: "flex-start",
          }}
        >
          <TouchableOpacity
            style={styles.widgetController}
            onPress={() => setTouch(!touch)}
          />
          <View
            style={{
              height: "80%",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text style={{ color: "white" }}>{selectedWidget.message}</Text>
            <TouchableOpacity
              onPress={() => {
                setTouch(!touch);
                setVisible(!touch);
                navigation.navigate("PlaceWidgets");
              }}
            >
              {selectedWidget.theme == "Ionicons" ? (
                <Ionicons name={selectedWidget.icon} size={80} color="white" />
              ) : (
                <Feather name={selectedWidget.icon} size={80} color="white" />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scrollContainer}
      >
        {widgetList.map((widgetPage, idx) => (
          <View key={idx} style={{ justifyContent: "space-between" }}>
            {widgetPage.map((widgets, idx) => (
              <View key={idx} style={styles.rowStyle}>
                {widgets.map((widget, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => {
                      setSelectedWidget(widget);
                      setTouch(!touch);
                    }}
                    style={styles.widgetStyle}
                  >
                    <View>
                      {widget.theme == "Ionicons" ? (
                        <Ionicons name={widget.icon} size={80} color="white" />
                      ) : (
                        <Feather name={widget.icon} size={80} color="white" />
                      )}
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
  scrollContainer: {
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
    // borderWidth: 2,
    borderColor: "white",
    width: "45%",
    height: 140,
    justifyContent: "center",
    alignItems: "center",
  },

  widgetContainer: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    marginTop: 60,
    backgroundColor: "rgba(40, 40, 40, 0.9)",
    borderRadius: 25,
  },
  widgetController: {
    backgroundColor: "grey",
    width: "20%",
    height: 5,
    borderRadius: 20,
    marginVertical: 10,
  },
});

export { Widgets };
