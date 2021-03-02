module.exports = {
  ...require('@config/eslint-config'),
  extends: ["@config/eslint-config"],
  env: {
    node: true,
  },
  parserOptions: {
    project: ["packages/*/tsconfig.eslint.json"],
    sourceType: "module",
  },
};
