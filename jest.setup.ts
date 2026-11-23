jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock")
);

jest.mock("expo-haptics", () => ({
  impactAsync: jest.fn(() => Promise.resolve()),
  selectionAsync: jest.fn(() => Promise.resolve()),
  notificationAsync: jest.fn(() => Promise.resolve()),
  ImpactFeedbackStyle: {
    Light: "light",
    Medium: "medium",
    Heavy: "heavy"
  },
  NotificationFeedbackType: {
    Success: "success",
    Warning: "warning",
    Error: "error"
  }
}));

jest.mock("expo-router", () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn()
  })),
  usePathname: jest.fn(() => "/home"),
  Stack: Object.assign(({ children }: { children?: React.ReactNode }) => children ?? null, {
    Screen: () => null
  })
}));

jest.mock("react-native-safe-area-context", () => {
  const React = require("react");
  const { View } = require("react-native");
  return {
    SafeAreaProvider: ({ children }: { children?: React.ReactNode }) =>
      React.createElement(View, null, children),
    SafeAreaView: ({ children, ...rest }: { children?: React.ReactNode }) =>
      React.createElement(View, rest, children),
    useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 0, left: 0 })
  };
});

jest.mock("react-native-svg", () => {
  const React = require("react");
  const { View } = require("react-native");
  const createSvgMock =
    (name: string) =>
    ({ children, ...rest }: { children?: React.ReactNode; onPress?: () => void; "aria-label"?: string }) =>
      React.createElement(View, { accessibilityLabel: rest["aria-label"], ...rest, testID: name }, children);

  return {
    __esModule: true,
    default: createSvgMock("Svg"),
    Svg: createSvgMock("Svg"),
    Circle: createSvgMock("Circle"),
    Defs: createSvgMock("Defs"),
    Ellipse: createSvgMock("Ellipse"),
    G: createSvgMock("G"),
    Line: createSvgMock("Line"),
    Path: createSvgMock("Path"),
    Pattern: createSvgMock("Pattern"),
    Polygon: createSvgMock("Polygon"),
    Rect: createSvgMock("Rect"),
    Text: createSvgMock("SvgText")
  };
});

jest.mock("@react-native-community/slider", () => {
  const React = require("react");
  const { View } = require("react-native");
  return {
    __esModule: true,
    default: (props: Record<string, unknown>) => React.createElement(View, props)
  };
});

const rn = require("react-native") as typeof import("react-native");
const noopAnim = () => ({
  start: (cb?: (result: { finished: boolean }) => void) => cb?.({ finished: true }),
  stop: () => undefined,
  reset: () => undefined
});
Object.assign(rn.Animated, {
  timing: () => noopAnim(),
  spring: () => noopAnim(),
  loop: () => noopAnim()
});
