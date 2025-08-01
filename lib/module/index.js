function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import React, { useState, useRef, useEffect, useCallback } from "react";
import { Animated, BackHandler, Dimensions, Easing, Keyboard, PanResponder, TouchableOpacity, View } from "react-native";
import styles from "./styles";
const defaultSliderMaxHeight = Dimensions.get("window").height * 0.5;
const BottomSheet = ({
  children = /*#__PURE__*/React.createElement(View, null),
  headerComponent = /*#__PURE__*/React.createElement(View, null),
  isOpen = true,
  sliderMaxHeight = defaultSliderMaxHeight,
  sliderMinHeight = 50,
  animation = Easing.quad,
  animationDuration = 200,
  onOpen = () => {},
  onClose = () => {},
  wrapperStyle = {},
  outerContentStyle = {},
  innerContentStyle = {},
  lineContainerStyle = {},
  lineStyle = {}
}) => {
  const [isPanelVisible, setIsPanelVisible] = useState(isOpen);
  const [isPanelOpened, setIsPanelOpened] = useState(isOpen);
  const [contentHeight, setContentHeight] = useState();
  const panelHeightValue = useRef(new Animated.Value(0)).current;
  const panelOpenedRef = useRef(isPanelOpened);
  panelOpenedRef.current = isPanelOpened;
  const contentHeightRef = useRef(contentHeight);
  contentHeightRef.current = contentHeight;
  const togglePanel = useCallback(() => {
    if (contentHeight === undefined) return;
    const toValue = panelHeightValue["_value"] === 0 ? contentHeight - sliderMinHeight : 0;
    Animated.timing(panelHeightValue, {
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
          Keyboard.dismiss();
        }
        return toOpened;
      });
    });
  }, [animation, animationDuration, sliderMinHeight, contentHeight, onOpen, onClose, panelHeightValue]);
  useEffect(() => {
    const onBackPress = () => {
      if (panelOpenedRef.current) {
        togglePanel();
        return true;
      }
      return panelOpenedRef.current;
    };
    BackHandler.addEventListener("hardwareBackPress", onBackPress);
    return () => {
      BackHandler.removeEventListener("hardwareBackPress", onBackPress);
    };
  }, [togglePanel]);
  const parentPanResponder = useRef(PanResponder.create({
    onMoveShouldSetPanResponderCapture: () => !panelOpenedRef.current,
    onPanResponderRelease: () => togglePanel()
  })).current;
  const childPanResponder = useRef(PanResponder.create({
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
  const _handleScrollEndDrag = useCallback(({
    nativeEvent
  }) => {
    if (nativeEvent.contentOffset.y === 0) {
      togglePanel();
    }
  }, [togglePanel]);
  useEffect(() => {
    setIsPanelVisible(isOpen);
    setIsPanelOpened(isOpen);
    if (isOpen && contentHeight !== undefined) {
      Animated.timing(panelHeightValue, {
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
  return /*#__PURE__*/React.createElement(View, null, headerComponent, /*#__PURE__*/React.createElement(Animated.View, _extends({
    onLayout: _setSize
  }, parentPanResponder.panHandlers, {
    style: [styles.container, wrapperStyle, {
      maxHeight: sliderMaxHeight
    }, {
      transform: [{
        translateY: panelHeightValue
      }, {
        scale: isPanelVisible ? 1 : 0
      }]
    }]
  }), /*#__PURE__*/React.createElement(View, _extends({
    style: [styles.outerContent, outerContentStyle]
  }, childPanResponder.panHandlers), /*#__PURE__*/React.createElement(TouchableOpacity, {
    onPress: togglePanel,
    activeOpacity: 1
  }, /*#__PURE__*/React.createElement(View, {
    style: [styles.lineContainer, lineContainerStyle]
  }, /*#__PURE__*/React.createElement(View, {
    style: [styles.line, lineStyle]
  }))), /*#__PURE__*/React.createElement(View, {
    style: [styles.innerContent, innerContentStyle]
  }, typeof children === "function" ? children(_handleScrollEndDrag) : children))));
};
export default BottomSheet;
//# sourceMappingURL=index.js.map