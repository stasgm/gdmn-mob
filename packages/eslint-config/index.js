module.exports = {
  root: true,
  globals: {
    MyGlobal: true,
  },
  parser: '@typescript-eslint/parser', // Specifies the ESLint parser
  // plugins: ["react", "import", "relay", "react-hooks"],
  extends: [
    'plugin:@typescript-eslint/recommended', // Uses the recommended rules from @typescript-eslint/eslint-plugin
    'plugin:prettier/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
  ],
  parserOptions: {
    ecmaVersion: 2018, // Allows for the parsing of modern ECMAScript features
    sourceType: 'module', // Allows for the use of imports
    ecmaFeatures: {
      jsx: true, // Allows for the parsing of JSX
    },
  },
  rules: {
    // Place to specify ESLint rules. Can be used to overwrite rules specified from the extended configs
    // e.g. '@typescript-eslint/explicit-function-return-type': 'off',
    indent: 'off',
    '@typescript-eslint/indent': 'off', // conflicts with prettier
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-use-before-define': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-member-accessibility': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off', // set return params
    '@typescript-eslint/no-non-null-assertion': 'off',
    'import/named': 'off',
    'no-console': 'error',
    'import/first': 'warn',
    'import/namespace': 'off',
    'import/no-duplicates': 'error',
    'import/order': ['error', { 'newlines-between': 'always-and-inside-groups' }],
    'import/no-cycle': 'error',
    'import/no-self-import': 'warn',
    'import/extensions': ['off', 'never', { ts: 'never' }],
    '@typescript-eslint/camelcase': ['off', { ignoreDestructuring: true }],
  },
};
