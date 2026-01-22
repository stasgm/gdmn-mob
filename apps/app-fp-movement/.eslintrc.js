module.exports = {
  root: true,
  env: {
    browser: true,
  },
  extends: ['@config/eslint-config', '@config/eslint-config-react', '@config/eslint-config-react-native'],
  parserOptions: {
    project: ['./tsconfig.eslint.json'],
    tsconfigRootDir: __dirname,
  },
  ignorePatterns: ['node_modules/'],
};
