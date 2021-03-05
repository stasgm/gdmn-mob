module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: ['@config/eslint-config', '@config/eslint-config-react-native'],
  parserOptions: {
    project: ['./tsconfig.eslint.json'],
    tsconfigRootDir: __dirname,
  },
};
