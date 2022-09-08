# Error Report

## about ScrollView error

```
about error: You specified `onScroll` on a <ScrollView> but not `scrollEventThrottle`. You will only receive one event. Using `16` you get all the events but be aware that it may cause frame drops, use a bigger number if you don't need as much precision.
```

### scrollEventThrottle란

스크롤하는 동안 스크롤 이벤트가 발생하는 빈도를 제어한다.(단위 시간: ms)

숫자가 낮을수록 스크롤 위치를 추적하는 코드의 정확도가 향상되지만 bridge를 통해 전송되는 정보의 양으로 인해 스크롤 성능 문제가 발생할 수 있다. 정확한 위치 추적이 필요하지 않은 경우에는 값을 더 높게 설정한다.

default: 0 ==> 스크롤 될 때마다 이벤트가 한번 실행

scrollEventThrottle={0}: 스크롤을 하려고 터치하고 드래그를 하는 순간 이벤트가 단 한 번 실행.
scrollEventThrottle={1}: 드래그를 하는 동안 계속 실행.

[출처](https://talkwithcode.tistory.com/62)

## about React Navigation - Navigating Between Screens

```
npm install @react-navigation/native @react-navigation/native-stack
```

```
expo install react-native-screens react-native-safe-area-context
```

다른 패키지, 즉 독립된 파일로 존재하는 패키지를 App.js의 stack으로 사용하려면 해당 패키지 파일의 main function을 아래와 같이 고쳐야 한다.

> 잘못된 예

```JS
function Login() { ... }
...
export default Login;
```

> 바른 예

```JS
function Login() { ... }
...
export{ Login };
```

```JS
export default Login; (X)
export{ Login }; (O)
```

[출처](https://stackoverflow.com/questions/60663805/couldnt-find-a-component-or-children-prop-for-the-screen-home-this-can-h)

### React Native Navigation header 숨기기

방법 1. headerMode
방법 2. headerShown

1. headerMode
   float: 헤더가 상단에 유지되며 하나의 헤더를 사용 -> 무조건 헤더 사용
   screen: 각 화면마다 헤더를 가지며 화면 벼경과 함께 나타나거나 사라짐 -> 화면에 따라서 있거나 없거나!
   none: 헤더가 아예 렌더링되지 않음

사용 방법

```JS
<Stack.Navigator
    initialRouteName='Home'
    screenOptions = {{
        ...
        headerMode: 'none',
        }}
    >
```

2. headerShown
   <Stack.Navigator>에 적용할 경우, 해당 컴포넌트 아래의 모든 <Stack.Screen>에 적용된다.
   <Stack.Screen>에 적용할 경우, 해당 화면에만 적용된다.

사용방법

```JS
<Stack.Navigator
    name='Home'
    component={Home}
    options={{ headerShown: false}}
    />
    <Stack.Screen>
        ...
```

또는

```JS
<Stack.Screen
    name='Home'
    component={Home}
    options={{ headerShown: false}}
    />
```

[출처](https://eunbin00.tistory.com/41)

## TextInput 키보드 가리기

일반 앱에서는 빈 공간 터치 시 키보드가 사라진다. 이를 구현하기 위해

```JS
<TouchableWithoutFeedback onPress={Keyboard.dismiss}></TouchableWithoutFeedback>
```

으로 전체 View를 감싸면 해당 기능을 활성화시킬 수 있다.

## git push error

```
$ git push -u origin main
```

에러

```
remote: Permission to dldudals0728/mirrocle.git denied to ahrwjdgus.
fatal: unable to access 'https://github.com/dldudals0728/mirrocle.git/': The requested URL returned error: 403
```

github 소유자가 상대방을 초대(권한 부여)해야 상대방이 write 권한을 얻을 수 있다!

## react-native-permissions

react-native-permissions은 expo와 연결되지 않는다...

## expo error?

```
info Launching Dev Tools...
node:events:505
      throw er; // Unhandled 'error' event
      ^

Error: spawn cmd ENOENT
    at Process.ChildProcess._handle.onexit (node:internal/child_process:283:19)
    at onErrorNT (node:internal/child_process:478:16)
    at processTicksAndRejections (node:internal/process/task_queues:83:21)
Emitted 'error' event on ChildProcess instance at:
    at Process.ChildProcess._handle.onexit (node:internal/child_process:289:12)
    at onErrorNT (node:internal/child_process:478:16)
    at processTicksAndRejections (node:internal/process/task_queues:83:21) {
  errno: -4058,
  code: 'ENOENT',
  syscall: 'spawn cmd',
  path: 'cmd',
  spawnargs: [ '/c', 'start', '""', '/b', 'http://localhost:19000/debugger-ui' ]
}
```

이 오류는 앱을 삭제했다가 다시 설치해서 해결했는데, 원인과 해결방법을 정확히 모르겠다..

## JS arrow function (=>)

JavaScript의 화살표 함수는 두가지로 사용된다.

```JS
const func = () => { ... }
```

```JS
const func = () => ( ... )
```

이 두가지의 모습인데, 우측 함수를 감싸고 있는 괄호가 중괄호인지 소괄호인지 나뉜다.<br>
함수를 감싸는 괄호가 중괄호일 경우, return을 따로 하지 않는다. 따라서 해당 함수 안에 return문을 넣어주어야 한다.<br>
그러나 소괄호일 경우, 괄호로 감싼 부분을 return하는 것이다.<br>

따라서 ScrollView에 map을 이용하여 리스트 안의 내용을 모두 보여주려면 화살표 함수 후에 중괄호가 아닌 소괄호로 감싸야 한다.

> 이 차이 때문에 이틀을 고생했다.. [AddUser.js]

## JSDoc

JSDoc을 이용하여 JavaScript에서 함수에 대한 설명이나 파라미터 타입, 설명 등을 제공할 수 있다.

1. 함수 및 파라미터 설명

```JS
/**
 * 함수에 대한 설명
 * @param {type} arg1 첫번째 인자에 대한 설명
 * @param {type} arg2 두번째 인자에 대한 설명
 */
function func(arg1, arg2) {
    return arg1 + arg2
}
```

2. 함수 부가 정보

```JS
/**
 * @version 1.2.3
 * @see https://github.com/dldudals0728/mirrocle
 */
function func(arg1, arg2) {
    return arg1 + arg2
}
```

3. 변수 또는 오브젝트에 대한 설명(readonly는 강제성을 갖지 않음. 힌드일 뿐)

```JS
/**
 * @readonly
 * @const {type}
 */
const num = 1;
```

4. 메모

```JS
/**
 * @todo 할 일 메모
 */
function func(arg1, arg2) {
    return arg1 + arg2
}
```

5. deprecated(함수 사용 시 가로줄이 쳐짐.)

```JS
/**
 * @deprecated 다른 함수를 사용하세요.
 */
function func(arg1, arg2) {
    return arg1 + arg2
}
```

6. type 힌트 제공(typescript와 같지만 강제성이 없다.)

```JS
/** @type {String | number} */
var name = "Lee";

/** @type {number[]} */
var num = [1, 2, 3]
```

### React Native Layout에서의 display 속성

```
display:absolute
```

React Native에서 지원하는 display 속성은 'flex'와 'none'밖에 없다. 기본값은 flex이다.
display:absolute는 존재하지 않는다. -> 아마 css속성을 억지로 구현하여 에러난 것으로 예상

## Modal from react-native

```JS
import { Modal } from "react-native";
```

RN에서 제공하는 Modal 컴포넌트는, 한번에 두개 이상의 모달창을 띄우는 것을 권장하지 않는다.(IOS에서는 아에 안되는데 android에서는 잘 모르겠다.)
따라서 하나의 Screen에 두개 이상의 Modal을 사용하려면 먼저 하나를 닫아주고, 나머지를 띄운다.

### Modal 외부를 터치하여 모달 창 종료하기

```JS
<Modal>
<Pressable
    style={{
    flex: 1,
    // "transparent"는 backgroundColor의 default값으로, 배경색이 없다.
    backgroundColor: "transparent",
    }}
    onPress={() => setMenuVisible(!menuVisible)}
/>
</Modal>
```

위와 같이 Modal Component 안에 Press Component를 추가하면 모달을 제외한 곳을 터치하면 사라진다. 원리를 모르겠다...

> 추가적으로, Modal 바깥의 Component를 터치할 수 있는지, Modal animation 속도 조절 가능한지(혹은 비동기) 알아봐야됨!

## useRef().current

PanResponder 객체에 정확히 셋팅했음에도 정보를 받아오지 못하는 상황이 있었다.

```JS
const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      ...
    })
  )
```

코드를 위와 같이, 모든 props를 넘겨주었는데 작동이 안됐다.<br>
결론은, useRef()를 이용하여 객체를 사용할 때는, useRef().current;를 붙여서 사용해야 제대로 작동하는 것 같다.
(처음에는 .current를 사용하지 않았음)
<br>
또, Animated를 사용할 때도 useRef를 사용하는데 이때도 .current를 해주어야 된다.

> useRef에 대해 좀 더 공부해야봐야 겠다 ...!

## Warning: Animated.event now requires a second argument for options

Animated, PanResponder를 이용하여 드래그로 움직이는 View를 만들었는데, 정확히 동작 하지만 위와 같은 경고문이 나왔다.
이는 stackoverflow에서 검색을 통해 얻어냈다.

```JS
onPanResponderMove: Animated.event(
    [null, { dx: position.x, dy: position.y }],
    { useNativeDriver: false }
),
```

위 코드는 드래그에 따라 뷰가 움직이도록 한 것인데, 아래에 { useNativeDriver: false }를 추가해줌으로써 경고가 사라졌다.
