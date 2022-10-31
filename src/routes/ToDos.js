import { useRef, useState, useEffect } from "react";
import {
  Alert,
  Animated,
  Keyboard,
  Modal,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { MyButton } from "../components/MyButton";
import { IP_ADDRESS } from "../../temp/IPAddress";

const OS = Platform.OS;
const AnimatedBox = Animated.createAnimatedComponent(View);

function ToDos({ navigation, route }) {
  const { accountIdx, userIdx, username, widgetKey } = route.params;
  const [loadedWidget, setLoadedWidget] = useState({});
  const [text, setText] = useState("");
  const [toDos, setToDos] = useState({});
  const [calendarVisible, setCalendarVisible] = useState(false);
  const AnimRef = useRef([]);

  const saveToDosWithServer = async () => {
    const tempWidget = { ...loadedWidget };
    tempWidget[widgetKey].attribute.attr_member.toDos = toDos;
    let url = IP_ADDRESS + "/user/template";
    url += `?accountIdx=${accountIdx}&userIdx=${userIdx}&userTemplate=${JSON.stringify(
      tempWidget
    )}`;
    await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tempWidget,
      }),
    });
  };

  const getWidgetFromServer = async () => {
    let url = IP_ADDRESS + "/user/select";
    url += `?accountIdx=${accountIdx}&userIdx=${userIdx}`;
    const res = await fetch(url);
    const json = await res.json();
    let loadedWidget;
    if (json.status === 500) {
      loadedWidget = {};
    } else {
      loadedWidget = JSON.parse(json.user_template);
    }
    setLoadedWidget(loadedWidget);
    loadToDos(loadedWidget);
  };

  const loadToDos = (widget) => {
    const loadedToDos = widget[widgetKey].attribute.attr_member.toDos;
    setToDos(loadedToDos);
  };

  const urgentToDo = (key) => {
    const newToDos = { ...toDos };
    newToDos[key].isUrgent = !newToDos[key].isUrgent;
    /**
     * 모두 긴급 모드로 하는 도중 마지막꺼를 했을 때 에러
     */
    // if (key !== Object.keys(toDos)[0]) {
    //   let minKey = 0;
    //   for (toDoKey in newToDos) {
    //     if (!newToDos[toDoKey].isUrgent) {
    //       minKey = toDoKey;
    //       break;
    //     }
    //   }
    //   const tempToDo = newToDos[minKey];
    //   newToDos[minKey] = newToDos[key];
    //   newToDos[key] = tempToDo;

    //   console.log(tempToDo);
    // }

    setToDos(newToDos);
  };

  const completeToDo = (key) => {
    const newToDos = { ...toDos };
    newToDos[key].isCompleted = !newToDos[key].isCompleted;
    setToDos(newToDos);
  };

  const addToDo = () => {
    if (!text) {
      return;
    }
    setText("");

    AnimRef.current.push(new Animated.Value(1));
    const newToDos = {
      ...toDos,
      [Date.now()]: {
        text,
        isCompleted: false,
        isUrgent: false,
        dueDate: Object.keys(toDos).length % 2 === 0 ? null : "2020년",
      },
    };
    setToDos(newToDos);
  };

  const deleteToDos = (key, idx) => {
    Animated.timing(AnimRef.current[idx], {
      toValue: 0,
      duration: 500,
      useNativeDriver: false,
    }).start(() => {
      /**
       * 사라지는 애니메이션이 끝난 후, 애니메이션 배열을 조작해주고 toDos를 수정해 준다.
       */
      deleteAnim(idx);
      const newToDos = { ...toDos };
      delete newToDos[key];
      setToDos(newToDos);
    });
  };

  const deleteAnim = (index) => {
    const newList = AnimRef.current.filter((value, idx) => idx !== index);
    AnimRef.current = newList;
  };

  const saveToDos = () => {
    Alert.alert("ToDo list 저장", "ToDo list를 저장하시겠습니까?", [
      {
        text: "cancel",
      },
      {
        text: "OK",
        onPress: () => {
          Alert.alert("저장 완료", "ToDo list가 저장되었습니다.", [
            {
              text: "OK",
            },
          ]);
          saveToDosWithServer();
          navigation.pop();
        },
      },
    ]);
  };

  useEffect(() => {
    getWidgetFromServer();
  }, []);
  return (
    <View style={styles.container}>
      <Modal
        visible={calendarVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => console.log("close")}
      >
        <View style={styles.calendarContainer}>
          <TouchableOpacity
            onPress={() => setCalendarVisible(!calendarVisible)}
          >
            <Text>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
      <View style={styles.header}>
        <Text style={styles.headerText}>{username}</Text>
        <Text style={{ fontSize: 24, fontWeight: "600", color: "#808080" }}>
          ToDo List
        </Text>
      </View>
      <View>
        <TextInput
          style={styles.input}
          placeholder="To Do 입력"
          returnKeyType="done"
          onSubmitEditing={addToDo}
          value={text}
          onChangeText={setText}
        />
      </View>
      <ScrollView
        onScrollBeginDrag={() => Keyboard.dismiss()}
        scrollEventThrottle={0}
      >
        {Object.keys(toDos).map((key, idx) => {
          return (
            <AnimatedBox key={key} style={{ opacity: AnimRef.current[idx] }}>
              <View
                style={{
                  ...styles.toDo,
                  borderWidth: 1,
                  borderColor: toDos[key].isUrgent ? "red" : null,
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <TouchableOpacity onPress={() => completeToDo(key)}>
                    <MaterialCommunityIcons
                      name={
                        toDos[key].isCompleted
                          ? "checkbox-marked-outline"
                          : "checkbox-blank-outline"
                      }
                      style={{
                        ...styles.toDoText,
                        fontSize: 28,
                        marginRight: 12,
                      }}
                    />
                  </TouchableOpacity>
                  <Text
                    style={{
                      ...styles.toDoText,
                      textDecorationLine: toDos[key].isCompleted
                        ? "line-through"
                        : "none",
                      color: toDos[key].isCompleted ? "#808080" : "white",
                    }}
                  >
                    {toDos[key].text}
                  </Text>
                </View>
                <View style={{ flexDirection: "row" }}>
                  <TouchableOpacity onPress={() => urgentToDo(key)}>
                    <MaterialCommunityIcons
                      name={
                        toDos[key].isUrgent
                          ? "alarm-light"
                          : "alarm-light-outline"
                      }
                      style={{
                        ...styles.toDoText,
                        fontSize: 28,
                        marginRight: 12,
                        color: toDos[key].isUrgent ? "red" : "#808080",
                      }}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setCalendarVisible(!calendarVisible)}
                  >
                    {/**
                     * @todo datepicker, 또는 calendar가 되면 넣자
                     */}
                    {/* <MaterialCommunityIcons
                      name="calendar-clock"
                      style={{ ...styles.toDoText, fontSize: 28 }}
                    /> */}
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => deleteToDos(key, idx)}>
                    <MaterialCommunityIcons
                      name="trash-can-outline"
                      style={{ ...styles.toDoText, fontSize: 28 }}
                    />
                  </TouchableOpacity>
                </View>
              </View>
              {/**
               * @todo datepicker, 또는 calendar가 되면 넣자
               */}
              {/* {toDos[key].dueDate !== null ? (
                <View
                  style={{
                    ...styles.toDo,
                    alignItems: "flex-end",
                    backgroundColor: "teal",
                    position: "relative",
                    bottom: 20,
                    zIndex: -1,
                  }}
                >
                  <Text style={styles.toDoText}>2020년</Text>
                </View>
              ) : null} */}
            </AnimatedBox>
          );
        })}
      </ScrollView>
      <MyButton
        text="저장 & 돌아가기"
        style={{
          borderColor: "white",
          backgroundColor: "transparent",
          marginTop: 12,
        }}
        textStyle={{ color: "white" }}
        onPress={saveToDos}
      />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    paddingHorizontal: 20,
  },

  header: {
    marginTop: 60,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  headerText: {
    color: "white",
    fontSize: 32,
    fontWeight: "600",
  },

  input: {
    backgroundColor: "white",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginVertical: 20,
    fontSize: 18,
  },

  toDo: {
    backgroundColor: "#1A1C20",
    marginBottom: 10,
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  toDoText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },

  calendarContainer: {
    flex: 1,
    backgroundColor: "teal",
    marginHorizontal: 20,
    marginVertical: 40,
  },
});

export { ToDos };
