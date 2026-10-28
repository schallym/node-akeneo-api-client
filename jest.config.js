// nock >= 15 and its dependencies are published as ESM only
const esmOnlyModules = ['nock', '@mswjs/interceptors', '@open-draft/until', 'rettime'].join('|');

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src', '<rootDir>/tests'],
  testMatch: ['**/tests/?(*.)+(e2e-spec).ts', '**/?(*.)+(spec).ts'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
    [`/node_modules/(${esmOnlyModules})/.+\\.m?js$`]: '<rootDir>/jest.esm-transformer.js',
  },
  transformIgnorePatterns: [`/node_modules/(?!(${esmOnlyModules})/)`],
  collectCoverageFrom: ['src/**/*.ts', '!src/**/*.d.ts', '!src/types/**/*.ts'],
  collectCoverage: true,
  coverageThreshold: {
    global: {
      lines: 100,
      functions: 100,
      branches: 100,
      statements: 100,
    },
  },
};
