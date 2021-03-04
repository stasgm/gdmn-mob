module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es6: true,
    node: true,
  },
  plugins: ["react", "react-hooks"],
  parserOptions: {
    ecmaFeatures: {
      jsx: true, // Allows for the parsing of JSX
    },
  },
  extends: [
    "plugin:react/recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
  ],
  settings: {
    react: {
      version: "detect",
    },
  },
  rules: {
    "no-use-before-define": "off",
    "react/jsx-filename-extension": "off",
    // "react/prop-types": "off",
    "comma-dangle": "off",
    "padded-blocks": "off",
    "arrow-body-style": "off",
    "react-hooks/exhaustive-deps": "warn",
    "react-hooks/exhaustive-deps": "warn",
  },
  overrides: [
    {
      files: ["**/*.tsx"],
      rules: {
        "react/prop-types": "off",
      },
    },
  ],
};
