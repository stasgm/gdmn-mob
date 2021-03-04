module.exports = {
  ...require('@config/eslint-config'),
  ...require('@config/eslint-config-typescript'),
  // ...require('@config/eslint-config-react'),
  parserOptions: {
    ecmaFeatures: {
      jsx: true, // Allows for the parsing of JSX
    },
    project: ['/apps/*/tsconfig.eslint.json'],
  },
};
