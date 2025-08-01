# react-native-bottom-panel

## Demo

<img src="./docs/demo.gif" alt="Demo" width="200" />

A customizable bottom sheet modal component for React Native with smooth animations and gesture support.

## Installation

```bash
npm install react-native-bottom-panel
```

### Dependencies

This package requires the following peer dependencies:

```bash
npm install react-native-reanimated
```

Follow the [react-native-reanimated installation guide](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/installation) to complete the setup.

## Usage

### Basic Usage

```tsx
import React, { useRef } from "react";
import { View, Text, Button } from "react-native";
import BottomSheetModal, {
  BottomSheetModalRef,
} from "react-native-bottom-panel";

const App = () => {
  const bottomSheetRef = useRef<BottomSheetModalRef>(null);

  return (
    <View style={{ flex: 1 }}>
      <Button
        title="Open Sheet"
        onPress={() => bottomSheetRef.current?.open()}
      />

      <BottomSheetModal ref={bottomSheetRef}>
        <View style={{ padding: 20 }}>
          <Text>Bottom Sheet Content</Text>
        </View>
      </BottomSheetModal>
    </View>
  );
};
```

### With ScrollView

```tsx
import React, { useRef } from "react";
import { ScrollView, Text } from "react-native";
import BottomSheetModal, {
  BottomSheetModalRef,
} from "react-native-bottom-panel";

const App = () => {
  const bottomSheetRef = useRef<BottomSheetModalRef>(null);

  return (
    <BottomSheetModal ref={bottomSheetRef}>
      {(onScrollEndDrag) => (
        <ScrollView onScrollEndDrag={onScrollEndDrag}>
          <Text>Scrollable content...</Text>
        </ScrollView>
      )}
    </BottomSheetModal>
  );
};
```

## Props

| Prop                   | Type                                                                  | Default                | Description                                       |
| ---------------------- | --------------------------------------------------------------------- | ---------------------- | ------------------------------------------------- |
| `children`             | `React.ReactNode \| ((onScrollEndDrag: Function) => React.ReactNode)` | ``                     | Content to render inside the bottom sheet         |
| `initialState`         | `'open' \| 'closed'`                                                  | `'closed'`             | Initial state of the bottom sheet                 |
| `maxHeight`            | `number`                                                              | `50% of screen height` | Maximum height of the bottom sheet                |
| `minHeight`            | `number`                                                              | `50`                   | Minimum height of the bottom sheet when collapsed |
| `animationDuration`    | `number`                                                              | `500`                  | Animation duration in milliseconds                |
| `onOpen`               | `() => void`                                                          | `() => null`           | Callback fired when the sheet opens               |
| `onClose`              | `() => void`                                                          | `() => null`           | Callback fired when the sheet closes              |
| `containerStyle`       | `ViewStyle`                                                           | `{}`                   | Style for the main container                      |
| `contentWrapperStyle`  | `ViewStyle`                                                           | `{}`                   | Style for the content wrapper                     |
| `innerContentStyle`    | `ViewStyle`                                                           | `{}`                   | Style for the inner content                       |
| `handleContainerStyle` | `ViewStyle`                                                           | `{}`                   | Style for the handle container                    |
| `handleStyle`          | `ViewStyle`                                                           | `{}`                   | Style for the drag handle                         |
| `headerComponent`      | `() => React.ReactNode`                                               | `undefined`            | Custom header component                           |

## Ref Methods

The component exposes the following methods through ref:

| Method         | Description                        |
| -------------- | ---------------------------------- |
| `open()`       | Opens the bottom sheet             |
| `close()`      | Closes the bottom sheet            |
| `toggle()`     | Toggles the bottom sheet state     |
| `isExpanded()` | Returns the current expanded state |

## Features

- Smooth animations using Reanimated
- Gesture support for opening/closing
- Keyboard handling
- Android back button support
- Customizable styling
- ScrollView integration
- TypeScript support

## License

MIT
