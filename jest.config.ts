export default {
  clearMocks: true,

  collectCoverage: true,
  collectCoverageFrom: ['<rootDir>/src/modules/**/useCases/**/implementation/**/*.ts'],
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',

  coverageReporters: ['text', 'lcov'],

  moduleNameMapper: {
    '^@modules/(.*)$': ['<rootDir>/src/modules/$1'],
    '^@errors/(.*)$': ['<rootDir>/src/shared/errors/$1'],
    '^@shared/(.*)$': ['<rootDir>/src/shared/$1'],
  },

  preset: 'ts-jest',

  testMatch: ['**/*.spec.ts'],
};
