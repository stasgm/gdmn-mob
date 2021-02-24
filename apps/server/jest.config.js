module.exports = {
  "roots": [
    "<rootDir>/test"
  ],
  "transform": {
    ".(ts|tsx)": "ts-jest"
  },
  testEnvironment: 'node',
  testRegex: '/test/index.test.ts',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
};
