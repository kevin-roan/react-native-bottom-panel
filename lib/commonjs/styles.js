"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _reactNative = require("react-native");
const styles = _reactNative.StyleSheet.create({
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
  lineContainer: {
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    justifyContent: "center",
    alignItems: "center"
  },
  line: {
    width: 35,
    height: 4,
    borderRadius: 2,
    marginTop: 18,
    marginBottom: 30,
    backgroundColor: "#D5DDE0"
  },
  outerContent: {
    flex: -1
  },
  innerContent: {
    flex: -1
  }
});
var _default = exports.default = styles;
//# sourceMappingURL=styles.js.map