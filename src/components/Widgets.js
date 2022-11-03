export const widgets = {
  analogClock: {
    key: 0,
    app: {
      theme: "Feather",
      icon: "clock",
    },
    coordinate: { x: 0, y: 0 },
    module_name: "아날로그 시계",
    size: { height: 0, width: 0 },
    attribute: {
      detail: "",
      attr_name: "",
      attr_member: {},
    },
  },
  digitalClock: {
    key: 0,
    app: {
      theme: "MaterialCommunityIcons",
      icon: "clock-digital",
    },
    coordinate: { x: 0, y: 0 },
    module_name: "디지털 시계",
    size: { height: 0, width: 0 },
    attribute: {
      detail: "",
      attr_name: "",
      attr_member: {},
    },
  },
  weather: {
    key: 0,
    app: {
      theme: "Ionicons",
      icon: "ios-sunny",
    },
    coordinate: { x: 0, y: 0 },
    module_name: "날씨",
    size: { height: 0, width: 0 },
    attribute: {
      detail: "",
      attr_name: "위치 설정",
      attr_member: {
        latitude: 0,
        longitude: 0,
        city: "",
      },
    },
  },
  subway: {
    key: 0,
    app: {
      theme: "Ionicons",
      icon: "subway",
    },
    coordinate: { x: 0, y: 0 },
    module_name: "지하철",
    size: { height: 0, width: 0 },
    attribute: {
      detail: "",
      attr_name: "지하철 역 선택",
      attr_member: {
        subwayStationName: "",
        subwayRouteName: "",
        subwayStationId: "",
      },
    },
  },
  toDo: {
    key: 0,
    app: {
      theme: "Ionicons",
      icon: "list",
    },
    coordinate: { x: 0, y: 0 },
    module_name: "ToDo",
    size: { height: 0, width: 0 },
    attribute: {
      detail: "",
      attr_name: "ToDo list 편집",
      attr_member: {
        toDos: {},
      },
    },
  },
  news: {
    key: 0,
    app: {
      theme: "Ionicons",
      icon: "newspaper",
    },
    coordinate: { x: 0, y: 0 },
    module_name: "뉴스",
    size: { height: 0, width: 0 },
    attribute: {
      detail: "",
      attr_name: "카테고리 선택",
      attr_member: {
        category: {
          name: "",
          text: "",
        },
      },
    },
  },
  calendar: {
    key: 0,
    app: {
      theme: "Ionicons",
      icon: "calendar",
    },
    coordinate: { x: 0, y: 0 },
    module_name: "달력",
    size: { height: 0, width: 0 },
    attribute: {
      detail: "",
      attr_name: "Google Calendar 연동",
      attr_member: {
        gMail: "",
      },
    },
  },
  // bus: {
  //   key: 0,
  //   app: {
  //     theme: "Ionicons",
  //     icon: "bus",
  //   },
  //   coordinate: { x: 0, y: 0 },
  //   module_name: "교통정보(버스)",
  //   size: { height: 0, width: 0 },
  //   attribute: {
  //     detail: "",
  //     attr_name: "내 주변 정류소 찾기",
  //     attr_member: {
  //       subwayStationName: "",
  //       subwayRouteName: "",
  //       subwayStationId: "",
  //     },
  //   },
  // },
};
