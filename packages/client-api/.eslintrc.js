module.exports = {
  env: {
    node: true,
  },
  extends: ['@config/eslint-config'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: ['./tsconfig.eslint.json'],
    tsconfigRootDir: __dirname,
  },
};
