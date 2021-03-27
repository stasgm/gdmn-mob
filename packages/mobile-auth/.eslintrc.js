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
};
