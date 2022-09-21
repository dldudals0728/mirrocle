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

## Animated.ValueXY의 값(PlaceWidgets.js)

위젯의 위치를 설정하는 화면에서, if문을 통과하지 못하는 경우가 발생했다.

```JS
const position = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
...
onPanResponderRelease: (event, gesture) => {
    position.flattenOffset();
    currentX = position.x;
    // log를 확인했을 때는 부동소수 값으로 출력되었다.
    console.log(currentX);
    ...
    // rows: 스크린의 넓이를 10등분 하여 배열에 저장
    if (currentX > rows[idx] && currentX < rows[idx + 1]) {
        position.setValue({ x: rows[idx], y: 0 });
        ...
    }
```

위 코드의 if문을 통과하지 않았다. log를 출력했을 때는 191.33334350585938로 잘 나왔다.<br>
그래서 typeof를 통해 position.x의 타입을 확인해 보니 Object 타입으로 나오는 것을 확인했다.
그래서 parseInt()를 이용하여 Int형으로 변환하려 했지만, 처음에는 number형으로 나오지만 그 이후로는 NaN가 확인되었다.
<br>
내가 찾아낸 해결책은, position.x을 사용하지 않고, position.x.\_value를 사용하니 제대로 전달되어 if문에 들어가는 것을 확인했다.

## Component의 크기를 가져오는 방법

작업을 하다가 아이패드로 접속을 해보니 컴포넌트의 크기가 부자연스럽게 나오는 것을 확인했다. 이를 수정하기 위해 동적 화면을 제작해야 했다.

```JS
Dimensions.get("window")


const onLayout = (e) => {
    const layoutInfo = e.nativeEvent.layout;
    setViewHeight(layoutInfo.height);
    setViewWidth(layoutInfo.width);
  };
<View onLayout={onLayout} />
```

> 기기의 크기별 컴포넌트의 크기를 알아내어 적용시키는 방법
> 방법은 위의 두가지 방법이 있다. Dimensions은 진작에 알고 있었지만, onLayout함수가 실행될 때 콜백으로 뷰의 크기를 따로 가져올 수 있는 방법이 있었다.
> [출처](https://honeystorage.tistory.com/282)

## Animated와 PanRsponder를 이용하여 위젯 옮기기 중 튀는 현상 fix

사용자가 위젯의 위치를 드래그로 결정하는데, 위젯을 터치하면 이상한 곳으로 위치가 튀는 경우가 있었다. 이를 고치기 위해 별걸 다 해봤다. 그리고 답을 찾았다 ^^

```JS
onPanResponderGrant: (event, gesture) => {
    position.stopAnimation();
    position.setOffset({
        x: position.x._value,
        y: position.y._value,
    });
},
```

위의 코드처럼 Animated 객체인 position에게 stopAnimation()함수를 사용하니 튀는 현상이 사라졌다.
아마 위젯을 그리드의 올바를 위치로 옮기는데 spring 애니메이션을 사용했는데, 이때 애니메이션이 끝나지 않은 상태에서 터치를 다시 하니 위치가 이상하게 반환된 것 같다. ^^

## Animated와 PanRsponder를 이용하여 위젯 옮기기 중 튀는 현상 fix(2)

위의 버그를 해결하니, 다시 위젯이 튀는 현상이 발생했다.
위젯을 드래그할 때는 위젯이 튀지 않았지만, 드래그 없이 터치할 경우 이상한 좌표로 이동하게 되는 현상이 나타났다.
이를 해결하기 위해 onPanResponderRelease를 아래와 같이 변경했다.

```JS
onPanResponderRelease: (event, gesture) => {
    if (gesture.dx === 0 && gesture.dy === 0) {
        return;
    }
    position.flattenOffset();
    ...
}
```

결과적으로, 드래그가 일어나지 않았는데 Animated.ValueXY()객체인 position의 flattenOffset() 함수가 문제였다.<br>
flattenOffset() 때문에 offset이 병합되고 0으로 초기화되어, 아래에 위치를 잡아주는 함수에 영향을 미친 것 같다.<br>
그래서 나는 두번째 매개변수를 gesture로 받아, dx와 dy가 모두 0이면, 즉 이동한 거리가 존재하지 않으면 return하여 함수가 실행되지 않도록 하였다.

## ScrollView onResponderMove error

```
Expected `onResponderMove` listener to be a function, instead got a value of `object` type.
```

ScrollView의 onResponderMove에 함수를 이용하여 넘겨주어야 하는데, obj형식으로 넘겨주어 발생하는 에러이다.

wrong code

```JS
<ScrollView
    onResponderMove={listPanResponder.current.panHandlers}
>
```

correct code

```JS
<ScrollView
    onResponderMove={() => listPanResponder.current.panHandlers}
>
```

## screen에서 android의 back button, ios의 back gesture를 막는 방법

지금까지 해당 방법을 사용하기 위해서 아래와 같은 코드를 사용했다.

```JS
navigation.reset({ routes: [{ name: "Login" }] });
```

> 위의 코드는 해당 component로 이동하면서, 현재의 화면을 스택에서 지움으로 Login 화면이 스택의 가장 아래에 있도록 하는 코드이다.

그런데 MainScreen이 말 그대로 메인화면이기 때문에 스택에서 지우고 싶지 않았다.

> 추가적으로, ios는 back gesture이기 때문에 왼쪽 끝에 있는 위젯을 끌어 옮기다가 뒤로가기가 되는 경우도 있었다.
> 그래서 navigation.reset()을 사용하기 보다, android의 back button과 ios의 back gesture를 못하게 하는게 더 좋다 생각했다.

ios와 android는 뒤로가기를 막는 방법이 다르다.
IN IOS

```JS
<Stack.Screen
    name="PlaceWidgets"
    component={PlaceWidgets}
    options={() => ({
    gestureEnabled: false,
    })}
/>
```

> IOS 에서는 navigation screen을 지정할 때 option값으로 gestureEnabled를 false로 하면 된다.

IN android

```JS
BackHandler.addEventListener("hardwareBackPress", () => true);
```

> android 에서는 해당 컴포넌트(PlaceWidgets) 안에 해당 코드를 입력하면 된다. (import {BackHandler} from "react-native")

추가적으로! navigation.navigate()로 이동 시 parameter를 옮기는 방법 말고, navigation.reset()으로 이동 시 parameter를 옮기는 방법이다.

```JS
navigation.reset({
    routes: [
    {
        name: "PlaceWidgets",
        params: {
        name: selectedWidget.message,
        widthSize: width,
        heightSize: height,
        theme: selectedWidget.theme,
        icon: selectedWidget.icon,
        },
    },
    ],
});
```
