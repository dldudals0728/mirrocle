import { useState } from "react";
import {
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

const OS = Platform.OS;

function ToDos({ navigation, route }) {
  const [text, setText] = useState("");
  const [toDos, setToDos] = useState({});
  const [calendarVisible, setCalendarVisible] = useState(false);

  const addToDo = () => {
    if (!text) {
      return;
    }
    setText("");

    const newToDos = {
      ...toDos,
      [Date.now()]: {
        text,
        dueDate: Object.keys(toDos).length % 2 === 0 ? null : "2020년",
      },
    };
    setToDos(newToDos);
  };

  const deleteToDos = (key) => {
    const newToDos = { ...toDos };
    delete newToDos[key];
    setToDos(newToDos);
  };
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
        <Text style={styles.headerText}>{route.params.username}</Text>
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
        {Object.keys(toDos).map((key) => {
          return (
            <View key={key}>
              <View style={styles.toDo}>
                <Text style={styles.toDoText}>{toDos[key].text}</Text>
                <View style={{ flexDirection: "row" }}>
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
                  <TouchableOpacity onPress={() => deleteToDos(key)}>
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
            </View>
          );
        })}
      </ScrollView>
      <StatusBar style="light" />
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
