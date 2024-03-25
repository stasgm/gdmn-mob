module.exports = {
  env: {
    node: true,
  },
  extends: ['@config/eslint-config', '@config/eslint-config-react', '@config/eslint-config-react-native'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: ['./tsconfig.eslint.json'],
    tsconfigRootDir: __dirname,
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.ts', '.tsx', '.json'],
      },
    },
  },
  rules: {
    'import/first': 'error',
    'import/order': [
      'error',
      {
        groups: ['index', 'sibling', 'parent', 'internal', 'external', 'builtin', 'object', 'type'],
      },
    ],
    'import/newline-after-import': 'error',
  },
};
