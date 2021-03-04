module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: ['@config/eslint-config', '@config/eslint-config-react'],
  parserOptions: {
    ecmaFeatures: {
      jsx: true, // Allows for the parsing of JSX
    },
    project: ['apps/*/tsconfig.eslint.json'],
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.ts', '.tsx', '.json', '.native.js'],
      },
    },
  },
};
