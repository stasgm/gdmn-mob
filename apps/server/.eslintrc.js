module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    "@config/eslint-config",
    "plugin:promise/recommended",
    "plugin:sonarjs/recommended",
    // "plugin:@typescript-eslint/recommended-requiring-type-checking",
  ],
  plugins: ["promise", "sonarjs"],
  parserOptions: {
    // project: ["apps/server/tsconfig.eslint.json"],
  },
  rules: {
    "sonarjs/no-duplicate-string": "off",
    "padded-blocks": ["error", "never"],
    "no-await-in-loop": "error",
  },
};
