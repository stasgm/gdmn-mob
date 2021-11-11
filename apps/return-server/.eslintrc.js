module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: ['@config/eslint-config'],
  parserOptions: {
    project: ['./tsconfig.eslint.json'],
    tsconfigRootDir: __dirname,
  },
};
