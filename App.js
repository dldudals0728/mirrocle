import { Button, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Loading } from "./src/routes/Loading";
import { Login } from "./src/routes/Login";
import { SignIn } from "./src/routes/SignIn";
import { ConnectMirrocle } from "./src/routes/ConnectMirrocle";
import { UserList } from "./src/routes/UserList";
import { AddUser } from "./src/routes/AddUser";
import { MainScreen } from "./src/routes/MainScreen";
import { MirrocleSettings } from "./src/routes/MirrocleSettings";

export { Loading, Login, SignIn, ConnectMirrocle, UserList, MainScreen };

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Loading" component={Loading} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Connection" component={ConnectMirrocle} />
        <Stack.Screen name="SignIn" component={SignIn} />
        <Stack.Screen name="UserList" component={UserList} />
        <Stack.Screen name="MirrocleSettings" component={MirrocleSettings} />
        <Stack.Screen name="AddUser" component={AddUser} />
        <Stack.Screen name="MainScreen" component={MainScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
