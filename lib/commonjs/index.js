"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireWildcard(require("react"));
var _reactNative = require("react-native");
var _styles = _interopRequireDefault(require("./styles"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const defaultSliderMaxHeight = _reactNative.Dimensions.get("window").height * 0.5;
const BottomSheet = ({
  children = /*#__PURE__*/_react.default.createElement(_reactNative.View, null),
  headerComponent = /*#__PURE__*/_react.default.createElement(_reactNative.View, null),
  isOpen = true,
  sliderMaxHeight = defaultSliderMaxHeight,
  sliderMinHeight = 50,
  animation = _reactNative.Easing.quad,
  animationDuration = 200,
  onOpen = () => {},
  onClose = () => {},
  wrapperStyle = {},
  outerContentStyle = {},
  innerContentStyle = {},
  lineContainerStyle = {},
  lineStyle = {}
}) => {
  const [isPanelVisible, setIsPanelVisible] = (0, _react.useState)(isOpen);
  const [isPanelOpened, setIsPanelOpened] = (0, _react.useState)(isOpen);
  const [contentHeight, setContentHeight] = (0, _react.useState)();
  const panelHeightValue = (0, _react.useRef)(new _reactNative.Animated.Value(0)).current;
  const panelOpenedRef = (0, _react.useRef)(isPanelOpened);
  panelOpenedRef.current = isPanelOpened;
  const contentHeightRef = (0, _react.useRef)(contentHeight);
  contentHeightRef.current = contentHeight;
  const togglePanel = (0, _react.useCallback)(() => {
    if (contentHeight === undefined) return;
    const toValue = panelHeightValue["_value"] === 0 ? contentHeight - sliderMinHeight : 0;
    _reactNative.Animated.timing(panelHeightValue, {
      toValue,
      duration: animationDuration,
      easing: animation,
      useNativeDriver: false
    }).start(() => {
      setIsPanelOpened(prev => {
        const toOpened = !prev;
        if (toOpened) {
          onOpen();
        } else {
          onClose();
          _reactNative.Keyboard.dismiss();
        }
        return toOpened;
      });
    });
  }, [animation, animationDuration, sliderMinHeight, contentHeight, onOpen, onClose, panelHeightValue]);
  (0, _react.useEffect)(() => {
    const onBackPress = () => {
      if (panelOpenedRef.current) {
        togglePanel();
        return true;
      }
      return panelOpenedRef.current;
    };
    _reactNative.BackHandler.addEventListener("hardwareBackPress", onBackPress);
    return () => {
      _reactNative.BackHandler.removeEventListener("hardwareBackPress", onBackPress);
    };
  }, [togglePanel]);
  const parentPanResponder = (0, _react.useRef)(_reactNative.PanResponder.create({
    onMoveShouldSetPanResponderCapture: () => !panelOpenedRef.current,
    onPanResponderRelease: () => togglePanel()
  })).current;
  const childPanResponder = (0, _react.useRef)(_reactNative.PanResponder.create({
    onMoveShouldSetPanResponderCapture: (e, gestureState) => gestureState.dy > 15,
    onPanResponderRelease: (e, gestureState) => gestureState.dy > 0 && togglePanel()
  })).current;
  const _setSize = event => {
    const height = event.nativeEvent.layout.height;
    setContentHeight(height);
    if (!isOpen && height) {
      panelHeightValue.setValue(height - sliderMinHeight);
      setIsPanelVisible(true);
    }
  };
  const _handleScrollEndDrag = (0, _react.useCallback)(({
    nativeEvent
  }) => {
    if (nativeEvent.contentOffset.y === 0) {
      togglePanel();
    }
  }, [togglePanel]);
  (0, _react.useEffect)(() => {
    setIsPanelVisible(isOpen);
    setIsPanelOpened(isOpen);
    if (isOpen && contentHeight !== undefined) {
      _reactNative.Animated.timing(panelHeightValue, {
        toValue: 0,
        duration: animationDuration,
        easing: animation,
        useNativeDriver: false
      }).start();
    } else if (contentHeight !== undefined) {
      panelHeightValue.setValue(contentHeight - sliderMinHeight);
    }
  }, [isOpen, contentHeight]);
  if (sliderMinHeight !== undefined && sliderMaxHeight !== undefined && sliderMinHeight > sliderMaxHeight) {
    throw new Error("sliderMinHeight cannot exceed sliderMaxHeight.");
  }
  return /*#__PURE__*/_react.default.createElement(_reactNative.View, null, headerComponent, /*#__PURE__*/_react.default.createElement(_reactNative.Animated.View, _extends({
    onLayout: _setSize
  }, parentPanResponder.panHandlers, {
    style: [_styles.default.container, wrapperStyle, {
      maxHeight: sliderMaxHeight
    }, {
      transform: [{
        translateY: panelHeightValue
      }, {
        scale: isPanelVisible ? 1 : 0
      }]
    }]
  }), /*#__PURE__*/_react.default.createElement(_reactNative.View, _extends({
    style: [_styles.default.outerContent, outerContentStyle]
  }, childPanResponder.panHandlers), /*#__PURE__*/_react.default.createElement(_reactNative.TouchableOpacity, {
    onPress: togglePanel,
    activeOpacity: 1
  }, /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: [_styles.default.lineContainer, lineContainerStyle]
  }, /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: [_styles.default.line, lineStyle]
  }))), /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: [_styles.default.innerContent, innerContentStyle]
  }, typeof children === "function" ? children(_handleScrollEndDrag) : children))));
};
var _default = exports.default = BottomSheet;
//# sourceMappingURL=index.js.map