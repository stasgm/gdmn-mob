module.exports = {
  env: {
    node: true,
  },
  extends: ["@config/eslint-config", "@config/eslint-config-typescript"],
  // ...require('@config/eslint-config'),
  // ...require('@config/eslint-config-typescript'),
  parserOptions: {
    project: ["/packages/*/tsconfig.eslint.json"],
    sourceType: "module",
  },
};
