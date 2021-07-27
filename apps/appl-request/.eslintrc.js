module.exports = {
  root: true,
  env: {
    // node: true,
    browser: true,
  },
  extends: ['@config/eslint-config', '@config/eslint-config-react', '@config/eslint-config-react-native'],
  parserOptions: {
    project: ['./tsconfig.eslint.json'],
    tsconfigRootDir: __dirname,
  },
};
