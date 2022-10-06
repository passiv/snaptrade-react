module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.ts?$': 'ts-jest',
  },
  transformIgnorePatterns: ['<rootDir>/node_modules/'],
  collectCoverageFrom: ['**/src/**/*.tsx'],
  coverageThreshold: {
    global: {
      statements: 50,
      functions: 50,
      lines: 50,
    },
  },
};
