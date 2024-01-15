/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": "ts-jest",
    '^.+\\.vue$': '@vue/vue3-jest',
  },
  testPathIgnorePatterns: [
    "<rootDir>/node_modules/"
  ],
  testEnvironmentOptions: {
    customExportConditions: ["node", "node-addons"],
  },
  moduleNameMapper: {
    '\\.(svg)$': '<rootDir>/jest-svg-transformer.js',
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@assets/(.*)$': '<rootDir>/src/assets/$1',
    '^@components/(.*)$': '<rootDir>/src/components/$1',
    '^@views/(.*)$': '<rootDir>/src/views/$1',
    '^@store/(.*)$': '<rootDir>/src/store/$1',
    '^@typescript/(.*)$': '<rootDir>/src/typescript/$1',
    '^@plugins/(.*)$': '<rootDir>/src/plugins/$1',
  },
  moduleFileExtensions: ['json', 'js', 'jsx', 'ts', 'tsx', 'vue']
};