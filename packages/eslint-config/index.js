module.exports = {
  parser: "@typescript-eslint/parser", // Specifies the ESLint parser
  plugins: ["import"],
  extends: [
    "plugin:@typescript-eslint/recommended", // Uses the recommended rules from @typescript-eslint/eslint-plugin
    "plugin:prettier/recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
  ],
  parserOptions: {
    ecmaVersion: "ESNext", // Allows for the parsing of modern ECMAScript features
    sourceType: "module", // Allows for the use of imports
  },
  rules: {
    // Place to specify ESLint rules. Can be used to overwrite rules specified from the extended configs
    // e.g. '@typescript-eslint/explicit-function-return-type': 'off',
    indent: "off",
    "@typescript-eslint/indent": "off", // conflicts with prettier
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-use-before-define": "off",
    "@typescript-eslint/no-var-requires": "off",
    "@typescript-eslint/interface-name-prefix": "off",
    "@typescript-eslint/explicit-member-accessibility": "off",
    "@typescript-eslint/no-non-null-assertion": "off",
    "import/named": "off",
    quotes: "off",
    "no-console": "error",
    "import/first": "warn",
    "import/namespace": ["error", { allowComputed: true }],
    "import/no-duplicates": "error",
    "import/order": [
      "error",
      { "newlines-between": "always-and-inside-groups" },
    ],
    "import/no-cycle": "error",
    "import/no-self-import": "warn",
    "import/extensions": ["off", "never", { ts: "never" }],
    "@typescript-eslint/camelcase": ["off", { ignoreDestructuring: true }],
  },
  settings: {
    "import/resolver": {
      node: {
        extensions: [".js", ".jsx", ".ts", ".tsx"],
      },
      "eslint-import-resolver-typescript": true,
    },
  },
};
