module.exports = {
  ...require("@config/eslint-config"),
  ...require("@config/eslint-config-typescript"),
  extends: [
    "plugin:promise/recommended",
    "plugin:sonarjs/recommended",
    // "plugin:@typescript-eslint/recommended-requiring-type-checking",
  ],
  /* parser: "@typescript-eslint/parser", */
  plugins: ["promise", "sonarjs", "@typescript-eslint", "prettier"],
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
    "prettier/prettier": "error",
    "linebreak-style": ["error", "unix"],
    "max-len": [
      "error",
      {
        code: 120,
      },
    ],
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-unsafe-assignment": "off",
    "@typescript-eslint/no-unsafe-member-access": "off",
    "@typescript-eslint/restrict-template-expressions": "off",
    "sonarjs/no-duplicate-string": "off",
    "no-extra-parens": "off",
    "arrow-parens": "off",
    "no-console": "off",
    "no-trailing-spaces": "error",
    "no-multi-spaces": "error",
    "comma-style": ["error", "last"],
    "padded-blocks": ["error", "never"],
    "no-multiple-empty-lines": [
      "error",
      {
        max: 1,
        maxEOF: 1,
      },
    ],
    "no-await-in-loop": "error",
  },
};
