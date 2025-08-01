"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireWildcard(require("react"));
var _reactNative = require("react-native");
var _reactNativeReanimated = _interopRequireWildcard(require("react-native-reanimated"));
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const BottomSheetModal = /*#__PURE__*/(0, _react.forwardRef)(({
  children = /*#__PURE__*/_react.default.createElement(_reactNative.View, null),
  initialState = "closed",
  maxHeight = _reactNative.Dimensions.get("window").height * 0.5,
  minHeight = 50,
  animationDuration = 500,
  onOpen = () => null,
  onClose = () => null,
  containerStyle = {},
  contentWrapperStyle = {},
  innerContentStyle = {},
  handleContainerStyle = {},
  handleStyle = {},
  headerComponent
}, ref) => {
  var _parentPanResponder$c, _childPanResponder$cu;
  const isInitiallyOpen = initialState === "closed";
  const [isSheetExpanded, setIsSheetExpanded] = (0, _react.useState)(isInitiallyOpen);
  const [sheetContentHeight, setSheetContentHeight] = (0, _react.useState)(undefined);
  const sheetAnimationValue = (0, _reactNativeReanimated.useSharedValue)(isInitiallyOpen ? 1 : 0);
  const parentPanResponder = (0, _react.useRef)(null);
  const childPanResponder = (0, _react.useRef)(null);
  if (minHeight > maxHeight) {
    console.warn("minHeight value cannot be greater than maxHeight");
  }
  const dismissKeyboard = (0, _react.useCallback)(() => {
    _reactNative.Keyboard.dismiss();
  }, []);
  const updateSheetState = (0, _react.useCallback)(newState => {
    setIsSheetExpanded(newState);
    if (newState) {
      onOpen();
    } else {
      onClose();
      dismissKeyboard();
    }
  }, [onOpen, onClose, dismissKeyboard]);
  const handleAnimationComplete = (0, _react.useCallback)(newState => {
    "worklet";

    (0, _reactNativeReanimated.runOnJS)(updateSheetState)(newState);
  }, [updateSheetState]);
  const toggleSheetVisibility = (0, _react.useCallback)(() => {
    if (!sheetContentHeight) return;
    const targetValue = sheetAnimationValue.value === 0 ? 1 : 0;
    sheetAnimationValue.value = (0, _reactNativeReanimated.withTiming)(targetValue, {
      duration: animationDuration
    }, finished => {
      "worklet";

      if (finished) {
        const newState = targetValue === 1;
        handleAnimationComplete(newState);
      }
    });
  }, [sheetContentHeight, animationDuration, sheetAnimationValue, handleAnimationComplete]);
  const openSheet = (0, _react.useCallback)(() => {
    if (!isSheetExpanded && sheetContentHeight) {
      sheetAnimationValue.value = (0, _reactNativeReanimated.withTiming)(1, {
        duration: animationDuration
      }, finished => {
        "worklet";

        if (finished) {
          handleAnimationComplete(true);
        }
      });
    }
  }, [isSheetExpanded, sheetContentHeight, animationDuration, sheetAnimationValue, handleAnimationComplete]);
  const closeSheet = (0, _react.useCallback)(() => {
    if (isSheetExpanded) {
      sheetAnimationValue.value = (0, _reactNativeReanimated.withTiming)(0, {
        duration: animationDuration
      }, finished => {
        "worklet";

        if (finished) {
          handleAnimationComplete(false);
        }
      });
    }
  }, [isSheetExpanded, animationDuration, sheetAnimationValue, handleAnimationComplete]);
  (0, _react.useImperativeHandle)(ref, () => ({
    open: openSheet,
    close: closeSheet,
    toggle: toggleSheetVisibility,
    isExpanded: () => isSheetExpanded
  }), [openSheet, closeSheet, toggleSheetVisibility, isSheetExpanded]);
  const handleBackPress = (0, _react.useCallback)(() => {
    if (isSheetExpanded) {
      closeSheet();
    }
    return isSheetExpanded;
  }, [isSheetExpanded, closeSheet]);
  const initializePanResponders = (0, _react.useCallback)(() => {
    parentPanResponder.current = _reactNative.PanResponder.create({
      onMoveShouldSetPanResponderCapture: () => !isSheetExpanded,
      onPanResponderRelease: () => toggleSheetVisibility()
    });
    childPanResponder.current = _reactNative.PanResponder.create({
      onMoveShouldSetPanResponderCapture: (_, gestureState) => gestureState.dy > 15,
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 0) {
          toggleSheetVisibility();
        }
      }
    });
  }, [isSheetExpanded, toggleSheetVisibility]);
  const handleScrollEndDrag = (0, _react.useCallback)(({
    nativeEvent
  }) => {
    if (nativeEvent.contentOffset.y === 0) {
      toggleSheetVisibility();
    }
  }, [toggleSheetVisibility]);
  const handleLayoutChange = (0, _react.useCallback)(({
    nativeEvent
  }) => {
    const {
      height
    } = nativeEvent.layout;
    setSheetContentHeight(height);
    if (isInitiallyOpen && height) {
      sheetAnimationValue.value = 1;
      setIsSheetExpanded(true);
    } else if (height) {
      sheetAnimationValue.value = 0;
      setIsSheetExpanded(false);
    }
  }, [isInitiallyOpen, sheetAnimationValue]);
  const animatedContainerStyle = (0, _reactNativeReanimated.useAnimatedStyle)(() => {
    const translateY = sheetContentHeight ? (0, _reactNativeReanimated.interpolate)(sheetAnimationValue.value, [0, 1], [0, sheetContentHeight - minHeight], _reactNativeReanimated.Extrapolate.CLAMP) : 0;
    return {
      transform: [{
        translateY
      }]
    };
  }, [sheetContentHeight, minHeight]);
  (0, _react.useEffect)(() => {
    initializePanResponders();
  }, [initializePanResponders]);
  (0, _react.useEffect)(() => {
    const backHandler = _reactNative.BackHandler.addEventListener("hardwareBackPress", handleBackPress);
    return () => backHandler.remove();
  }, [handleBackPress]);
  return /*#__PURE__*/_react.default.createElement(_reactNativeReanimated.default.View, _extends({
    onLayout: handleLayoutChange
  }, ((_parentPanResponder$c = parentPanResponder.current) === null || _parentPanResponder$c === void 0 ? void 0 : _parentPanResponder$c.panHandlers) || {}, {
    style: [styles.container, containerStyle, {
      maxHeight
    }, animatedContainerStyle]
  }), /*#__PURE__*/_react.default.createElement(_reactNative.View, _extends({
    style: [styles.contentWrapper, contentWrapperStyle]
  }, ((_childPanResponder$cu = childPanResponder.current) === null || _childPanResponder$cu === void 0 ? void 0 : _childPanResponder$cu.panHandlers) || {}), typeof headerComponent === "function" && headerComponent(), /*#__PURE__*/_react.default.createElement(_reactNative.TouchableOpacity, {
    onPress: toggleSheetVisibility,
    activeOpacity: 1
  }, /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: [styles.handleContainer, handleContainerStyle]
  }, /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: [styles.handle, handleStyle]
  }))), /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: [styles.innerContent, innerContentStyle]
  }, typeof children === "function" ? children(handleScrollEndDrag) : children)));
});
const styles = {
  container: {
    flex: 1,
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 6
    },
    shadowOpacity: 0.37,
    shadowRadius: 7.49,
    elevation: 12,
    paddingHorizontal: 21,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    position: "absolute",
    bottom: 0,
    right: 0,
    left: 0,
    backgroundColor: "#ffffff"
  },
  handleContainer: {
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    justifyContent: "center",
    alignItems: "center"
  },
  handle: {
    width: 60,
    height: 4,
    borderRadius: 2,
    marginTop: 18,
    marginBottom: 30,
    backgroundColor: "#D5DDE0"
  },
  contentWrapper: {
    flex: -1
  },
  innerContent: {
    flex: -1
  }
};
var _default = exports.default = BottomSheetModal;
//# sourceMappingURL=index.js.map