module.exports = {
  root: true,
  env: {
    // node: true,
    browser: true,
  },
  extends: ['@config/eslint-config', '@config/eslint-config-react'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: ['./tsconfig.eslint.json'],
    tsconfigRootDir: __dirname,
    ecmaFeatures: {
      jsx: true,
    },
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.ts', '.tsx', '.json'],
      },
    },
  },
  globals: {
    JSX: true,
  },
};
