// const eslintConfig = require("@config/eslint-config");
// const eslintConfigTypescript = require("@config/eslint-config-typescript");

module.exports = {
  // ...eslintConfig,
  // ...eslintConfigTypescript,
  extends: [
    "@config/eslint-config",
    "@config/eslint-config-typescript",
    "plugin:promise/recommended",
    "plugin:sonarjs/recommended",
    // "plugin:@typescript-eslint/recommended-requiring-type-checking",
  ],
  /* parser: "@typescript-eslint/parser", */
  plugins: ["promise", "sonarjs"],
  parserOptions: {
    parserOptions: {
      sourceType: "module", // Allows for the use of imports
      project: ["tsconfig.eslint.json"],
    },
    ecmaFeatures: {
      jsx: true, // Allows for the parsing of JSX
    },
  },
  rules: {
    // ...eslintConfig.rules,
    // ...eslintConfigTypescript.rules,
    "sonarjs/no-duplicate-string": "off",
    "padded-blocks": ["error", "never"],
    "no-await-in-loop": "error",
  },
};
