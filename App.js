import { Button, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Loading } from "./Loading";
import { Login } from "./Login";
import { SignIn } from "./SignIn";
import { ConnectMirrocle } from "./ConnectMirrocle";
import { UserList } from "./UserList";
import { AddUser } from "./AddUser";
import { MainScreen } from "./MainScreen";

export { Loading, Login, SignIn, ConnectMirrocle, UserList, MainScreen };

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="AddUser" component={AddUser} />
        <Stack.Screen name="Loading" component={Loading} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Connection" component={ConnectMirrocle} />
        <Stack.Screen name="SignIn" component={SignIn} />
        <Stack.Screen name="UserList" component={UserList} />
        <Stack.Screen name="MainScreen" component={MainScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
