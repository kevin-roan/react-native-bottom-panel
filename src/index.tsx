import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from "react";
import {
  BackHandler,
  Dimensions,
  Keyboard,
  PanResponder,
  TouchableOpacity,
  View,
  ViewStyle,
  LayoutChangeEvent,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
  Extrapolate,
  runOnJS,
} from "react-native-reanimated";

interface BottomSheetModalProps {
  children?:
    | React.ReactNode
    | ((
        onScrollEndDrag: (
          event: NativeSyntheticEvent<NativeScrollEvent>,
        ) => void,
      ) => React.ReactNode);
  initialState?: "open" | "closed";
  maxHeight?: number;
  minHeight?: number;
  animationDuration?: number;
  onOpen?: () => void;
  onClose?: () => void;
  containerStyle?: ViewStyle;
  contentWrapperStyle?: ViewStyle;
  innerContentStyle?: ViewStyle;
  handleContainerStyle?: ViewStyle;
  handleStyle?: ViewStyle;
  headerComponent?: () => React.ReactNode;
}

export interface BottomSheetModalRef {
  open: () => void;
  close: () => void;
  toggle: () => void;
  isExpanded: () => boolean;
}

const BottomSheetModal = forwardRef<BottomSheetModalRef, BottomSheetModalProps>(
  (
    {
      children = <View />,
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
      headerComponent,
    },
    ref,
  ) => {
    const isInitiallyOpen = initialState === "closed";

    const [isSheetExpanded, setIsSheetExpanded] =
      useState<boolean>(isInitiallyOpen);
    const [sheetContentHeight, setSheetContentHeight] = useState<
      number | undefined
    >(undefined);

    const sheetAnimationValue = useSharedValue(isInitiallyOpen ? 1 : 0);

    const parentPanResponder = useRef<any>(null);
    const childPanResponder = useRef<any>(null);

    if (minHeight > maxHeight) {
      console.warn("minHeight value cannot be greater than maxHeight");
    }

    const dismissKeyboard = useCallback(() => {
      Keyboard.dismiss();
    }, []);

    const updateSheetState = useCallback(
      (newState: boolean) => {
        setIsSheetExpanded(newState);
        if (newState) {
          onOpen();
        } else {
          onClose();
          dismissKeyboard();
        }
      },
      [onOpen, onClose, dismissKeyboard],
    );

    const handleAnimationComplete = useCallback(
      (newState: boolean) => {
        "worklet";
        runOnJS(updateSheetState)(newState);
      },
      [updateSheetState],
    );

    const toggleSheetVisibility = useCallback(() => {
      if (!sheetContentHeight) return;

      const targetValue = sheetAnimationValue.value === 0 ? 1 : 0;

      sheetAnimationValue.value = withTiming(
        targetValue,
        {
          duration: animationDuration,
        },
        (finished) => {
          "worklet";
          if (finished) {
            const newState = targetValue === 1;
            handleAnimationComplete(newState);
          }
        },
      );
    }, [
      sheetContentHeight,
      animationDuration,
      sheetAnimationValue,
      handleAnimationComplete,
    ]);

    const openSheet = useCallback(() => {
      if (!isSheetExpanded && sheetContentHeight) {
        sheetAnimationValue.value = withTiming(
          1,
          {
            duration: animationDuration,
          },
          (finished) => {
            "worklet";
            if (finished) {
              handleAnimationComplete(true);
            }
          },
        );
      }
    }, [
      isSheetExpanded,
      sheetContentHeight,
      animationDuration,
      sheetAnimationValue,
      handleAnimationComplete,
    ]);

    const closeSheet = useCallback(() => {
      if (isSheetExpanded) {
        sheetAnimationValue.value = withTiming(
          0,
          {
            duration: animationDuration,
          },
          (finished) => {
            "worklet";
            if (finished) {
              handleAnimationComplete(false);
            }
          },
        );
      }
    }, [
      isSheetExpanded,
      animationDuration,
      sheetAnimationValue,
      handleAnimationComplete,
    ]);

    useImperativeHandle(
      ref,
      () => ({
        open: openSheet,
        close: closeSheet,
        toggle: toggleSheetVisibility,
        isExpanded: () => isSheetExpanded,
      }),
      [openSheet, closeSheet, toggleSheetVisibility, isSheetExpanded],
    );

    const handleBackPress = useCallback(() => {
      if (isSheetExpanded) {
        closeSheet();
      }
      return isSheetExpanded;
    }, [isSheetExpanded, closeSheet]);

    const initializePanResponders = useCallback(() => {
      parentPanResponder.current = PanResponder.create({
        onMoveShouldSetPanResponderCapture: () => !isSheetExpanded,
        onPanResponderRelease: () => toggleSheetVisibility(),
      });

      childPanResponder.current = PanResponder.create({
        onMoveShouldSetPanResponderCapture: (_, gestureState) =>
          gestureState.dy > 15,
        onPanResponderRelease: (_, gestureState) => {
          if (gestureState.dy > 0) {
            toggleSheetVisibility();
          }
        },
      });
    }, [isSheetExpanded, toggleSheetVisibility]);

    const handleScrollEndDrag = useCallback(
      ({ nativeEvent }: NativeSyntheticEvent<NativeScrollEvent>) => {
        if (nativeEvent.contentOffset.y === 0) {
          toggleSheetVisibility();
        }
      },
      [toggleSheetVisibility],
    );

    const handleLayoutChange = useCallback(
      ({ nativeEvent }: LayoutChangeEvent) => {
        const { height } = nativeEvent.layout;
        setSheetContentHeight(height);

        if (isInitiallyOpen && height) {
          sheetAnimationValue.value = 1;
          setIsSheetExpanded(true);
        } else if (height) {
          sheetAnimationValue.value = 0;
          setIsSheetExpanded(false);
        }
      },
      [isInitiallyOpen, sheetAnimationValue],
    );

    const animatedContainerStyle = useAnimatedStyle(() => {
      const translateY = sheetContentHeight
        ? interpolate(
            sheetAnimationValue.value,
            [0, 1],
            [0, sheetContentHeight - minHeight],
            Extrapolate.CLAMP,
          )
        : 0;

      return {
        transform: [{ translateY }],
      };
    }, [sheetContentHeight, minHeight]);

    useEffect(() => {
      initializePanResponders();
    }, [initializePanResponders]);

    useEffect(() => {
      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        handleBackPress,
      );
      return () => backHandler.remove();
    }, [handleBackPress]);

    return (
      <Animated.View
        onLayout={handleLayoutChange}
        {...(parentPanResponder.current?.panHandlers || {})}
        style={[
          styles.container,
          containerStyle,
          { maxHeight },
          animatedContainerStyle,
        ]}
      >
        <View
          style={[styles.contentWrapper, contentWrapperStyle]}
          {...(childPanResponder.current?.panHandlers || {})}
        >
          {typeof headerComponent === "function" && headerComponent()}

          <TouchableOpacity onPress={toggleSheetVisibility} activeOpacity={1}>
            <View style={[styles.handleContainer, handleContainerStyle]}>
              <View style={[styles.handle, handleStyle]} />
            </View>
          </TouchableOpacity>

          <View style={[styles.innerContent, innerContentStyle]}>
            {typeof children === "function"
              ? children(handleScrollEndDrag)
              : children}
          </View>
        </View>
      </Animated.View>
    );
  },
);

const styles = {
  container: {
    flex: 1,
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.37,
    shadowRadius: 7.49,
    elevation: 12,
    paddingHorizontal: 21,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    position: "absolute" as const,
    bottom: 0,
    right: 0,
    left: 0,
    backgroundColor: "#ffffff",
  },
  handleContainer: {
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    justifyContent: "center" as const,
    alignItems: "center" as const,
  },
  handle: {
    width: 60,
    height: 4,
    borderRadius: 2,
    marginTop: 18,
    marginBottom: 30,
    backgroundColor: "#D5DDE0",
  },
  contentWrapper: {
    flex: -1,
  },
  innerContent: {
    flex: -1,
  },
};

export default BottomSheetModal;
