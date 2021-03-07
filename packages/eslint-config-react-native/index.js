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
    'react-native/no-unused-styles': 'warn',
    'react-native/split-platform-components': 'warn',
    'react-native/no-inline-styles': 'warn',
    'react-native/no-color-literals': 'off',
    'react-native/no-raw-text': 'off',
    '@typescript-eslint/indent': 'off', // conflicts with prettier
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
