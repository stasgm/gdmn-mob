module.exports = {
  parser: "@typescript-eslint/parser",
  extends: ["@config/eslint-config-react"],
  plugins: ["react-native"],
  env: {
    es6: true,
    node: true,
    "react-native/react-native": true,
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true, // Allows for the parsing of JSX
    },
  },
  rules: {
    "react-native/no-unused-styles": 2,
    "react-native/split-platform-components": 2,
    "react-native/no-inline-styles": 2,
    "react-native/no-color-literals": "off",
    "react-native/no-raw-text": 2,
    // "react-native/no-single-element-style-arrays": 2,
  },
  globals: {
    fetch: false,
  },
  settings: {
    "import/resolver": {
      node: {
        extensions: [".ts", ".tsx", ".json", ".native.js"],
      },
    },
  },
};
