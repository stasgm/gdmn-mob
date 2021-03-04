module.exports = {
  env: {
    node: true,
  },
  extends: ["@config/eslint-config"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: ["packages/*/tsconfig.eslint.json"],
    sourceType: "module",
  },
  settings: {
    "import/resolver": {
      node: {
        extensions: [".ts", ".tsx", ".json"],
      },
    },
  },
};
