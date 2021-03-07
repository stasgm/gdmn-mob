module.exports = {
  parser: '@typescript-eslint/parser',
  extends: ['@react-native-community'],
  plugins: ['react-native'],
  env: {
    es6: true,
    node: true,
    'react-native/react-native': true,
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true, // Allows for the parsing of JSX
    },
  },
  rules: {
    'react-native/no-unused-styles': 2,
    'react-native/split-platform-components': 2,
    'react-native/no-inline-styles': 2,
    'react-native/no-color-literals': 'off',
    'react-native/no-raw-text': 2,
    '@typescript-eslint/no-unused-vars': 'off',
  },
  globals: {
    fetch: false,
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.ts', '.tsx', '.json', '.native.js'],
      },
    },
  },
};
