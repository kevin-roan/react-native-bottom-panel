function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import React, { useState, useEffect, useRef, useCallback, forwardRef, useImperativeHandle } from "react";
import { BackHandler, Dimensions, Keyboard, PanResponder, TouchableOpacity, View } from "react-native";
import Animated, { useSharedValue, useAnimatedStyle, withTiming, interpolate, Extrapolate, runOnJS } from "react-native-reanimated";
const BottomSheetModal = /*#__PURE__*/forwardRef(({
  children = /*#__PURE__*/React.createElement(View, null),
  initialState = "closed",
  maxHeight = Dimensions.get("window").height * 0.5,
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
  const [isSheetExpanded, setIsSheetExpanded] = useState(isInitiallyOpen);
  const [sheetContentHeight, setSheetContentHeight] = useState(undefined);
  const sheetAnimationValue = useSharedValue(isInitiallyOpen ? 1 : 0);
  const parentPanResponder = useRef(null);
  const childPanResponder = useRef(null);
  if (minHeight > maxHeight) {
    console.warn("minHeight value cannot be greater than maxHeight");
  }
  const dismissKeyboard = useCallback(() => {
    Keyboard.dismiss();
  }, []);
  const updateSheetState = useCallback(newState => {
    setIsSheetExpanded(newState);
    if (newState) {
      onOpen();
    } else {
      onClose();
      dismissKeyboard();
    }
  }, [onOpen, onClose, dismissKeyboard]);
  const handleAnimationComplete = useCallback(newState => {
    "worklet";

    runOnJS(updateSheetState)(newState);
  }, [updateSheetState]);
  const toggleSheetVisibility = useCallback(() => {
    if (!sheetContentHeight) return;
    const targetValue = sheetAnimationValue.value === 0 ? 1 : 0;
    sheetAnimationValue.value = withTiming(targetValue, {
      duration: animationDuration
    }, finished => {
      "worklet";

      if (finished) {
        const newState = targetValue === 1;
        handleAnimationComplete(newState);
      }
    });
  }, [sheetContentHeight, animationDuration, sheetAnimationValue, handleAnimationComplete]);
  const openSheet = useCallback(() => {
    if (!isSheetExpanded && sheetContentHeight) {
      sheetAnimationValue.value = withTiming(1, {
        duration: animationDuration
      }, finished => {
        "worklet";

        if (finished) {
          handleAnimationComplete(true);
        }
      });
    }
  }, [isSheetExpanded, sheetContentHeight, animationDuration, sheetAnimationValue, handleAnimationComplete]);
  const closeSheet = useCallback(() => {
    if (isSheetExpanded) {
      sheetAnimationValue.value = withTiming(0, {
        duration: animationDuration
      }, finished => {
        "worklet";

        if (finished) {
          handleAnimationComplete(false);
        }
      });
    }
  }, [isSheetExpanded, animationDuration, sheetAnimationValue, handleAnimationComplete]);
  useImperativeHandle(ref, () => ({
    open: openSheet,
    close: closeSheet,
    toggle: toggleSheetVisibility,
    isExpanded: () => isSheetExpanded
  }), [openSheet, closeSheet, toggleSheetVisibility, isSheetExpanded]);
  const handleBackPress = useCallback(() => {
    if (isSheetExpanded) {
      closeSheet();
    }
    return isSheetExpanded;
  }, [isSheetExpanded, closeSheet]);
  const initializePanResponders = useCallback(() => {
    parentPanResponder.current = PanResponder.create({
      onMoveShouldSetPanResponderCapture: () => !isSheetExpanded,
      onPanResponderRelease: () => toggleSheetVisibility()
    });
    childPanResponder.current = PanResponder.create({
      onMoveShouldSetPanResponderCapture: (_, gestureState) => gestureState.dy > 15,
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 0) {
          toggleSheetVisibility();
        }
      }
    });
  }, [isSheetExpanded, toggleSheetVisibility]);
  const handleScrollEndDrag = useCallback(({
    nativeEvent
  }) => {
    if (nativeEvent.contentOffset.y === 0) {
      toggleSheetVisibility();
    }
  }, [toggleSheetVisibility]);
  const handleLayoutChange = useCallback(({
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
  const animatedContainerStyle = useAnimatedStyle(() => {
    const translateY = sheetContentHeight ? interpolate(sheetAnimationValue.value, [0, 1], [0, sheetContentHeight - minHeight], Extrapolate.CLAMP) : 0;
    return {
      transform: [{
        translateY
      }]
    };
  }, [sheetContentHeight, minHeight]);
  useEffect(() => {
    initializePanResponders();
  }, [initializePanResponders]);
  useEffect(() => {
    const backHandler = BackHandler.addEventListener("hardwareBackPress", handleBackPress);
    return () => backHandler.remove();
  }, [handleBackPress]);
  return /*#__PURE__*/React.createElement(Animated.View, _extends({
    onLayout: handleLayoutChange
  }, ((_parentPanResponder$c = parentPanResponder.current) === null || _parentPanResponder$c === void 0 ? void 0 : _parentPanResponder$c.panHandlers) || {}, {
    style: [styles.container, containerStyle, {
      maxHeight
    }, animatedContainerStyle]
  }), /*#__PURE__*/React.createElement(View, _extends({
    style: [styles.contentWrapper, contentWrapperStyle]
  }, ((_childPanResponder$cu = childPanResponder.current) === null || _childPanResponder$cu === void 0 ? void 0 : _childPanResponder$cu.panHandlers) || {}), typeof headerComponent === "function" && headerComponent(), /*#__PURE__*/React.createElement(TouchableOpacity, {
    onPress: toggleSheetVisibility,
    activeOpacity: 1
  }, /*#__PURE__*/React.createElement(View, {
    style: [styles.handleContainer, handleContainerStyle]
  }, /*#__PURE__*/React.createElement(View, {
    style: [styles.handle, handleStyle]
  }))), /*#__PURE__*/React.createElement(View, {
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
export default BottomSheetModal;
//# sourceMappingURL=index.js.map