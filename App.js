import { Button, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Loading } from "./Loading";
import { Login } from "./Login";
import { ConnectMirrocle } from "./ConnectMirrocle";
import { UserList } from "./UserList";
import { MainScreen } from "./MainScreen";

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Connection" component={ConnectMirrocle} />
        <Stack.Screen name="Loading" component={Loading} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="UserList" component={UserList} />
        <Stack.Screen name="MainScreen" component={MainScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
