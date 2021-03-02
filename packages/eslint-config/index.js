module.exports = {
  root: true,
  parser: "@typescript-eslint/parser", // Specifies the ESLint parser
  parserOptions: {
    sourceType: "module", // Allows for the use of imports
    project: ["./tsconfig.eslint.json"],
  },
};
