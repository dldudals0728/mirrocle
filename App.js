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
import { PlaceWidgets } from "./src/routes/PlaceWidgets";
import { UserEdit } from "./src/routes/UserEdit";
import { FindAccount } from "./src/routes/FindAccount";

export {
  Loading,
  Login,
  SignIn,
  ConnectMirrocle,
  UserList,
  MainScreen,
  UserEdit,
};

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* <Stack.Screen name="Loading" component={Loading} /> */}
        {/* <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="FindAccount" component={FindAccount} />
        <Stack.Screen name="Connection" component={ConnectMirrocle} />
        <Stack.Screen name="SignIn" component={SignIn} />
        <Stack.Screen name="UserList" component={UserList} />
        <Stack.Screen name="MirrocleSettings" component={MirrocleSettings} />
        <Stack.Screen name="AddUser" component={AddUser} /> */}
        <Stack.Screen name="MainScreen" component={MainScreen} />
        <Stack.Screen
          name="PlaceWidgets"
          component={PlaceWidgets}
          options={() => ({
            gestureEnabled: false,
          })}
        />
        <Stack.Screen name="UserEdit" component={UserEdit} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
