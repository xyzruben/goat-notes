// jest.config.js
const path = require("path");
const nextJest = require('next/jest')

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files
  dir: './',
})

// Add any custom config to be passed to Jest
const customJestConfig = {
  testEnvironment: "jsdom",
  moduleDirectories: ["node_modules", "<rootDir>/"],
  moduleNameMapper: {
    "^@/app/styles/ai-response\\.css$": "<rootDir>/__mocks__/ai-response.css.js",
    "^@/(.*)$": "<rootDir>/src/$1",
    "\\.(css|less|scss|sass)$": path.resolve(__dirname, "node_modules/identity-obj-proxy"),
    "^.+\\.(css|less|scss|sass)$": path.resolve(__dirname, "node_modules/identity-obj-proxy"),
  },
  transform: {
    "^.+\\.(ts|tsx|js|jsx)$": "babel-jest",
  },
  transformIgnorePatterns: [
    "/node_modules/(?!identity-obj-proxy)"
  ],
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  testMatch: [
    "**/__tests__/**/*.(ts|tsx|js)",
    "**/*.(test|spec).(ts|tsx|js)"
  ],
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{js,jsx,ts,tsx}',
    '!src/**/*.test.{js,jsx,ts,tsx}',
    '!src/**/__tests__/**',
    '!src/**/__mocks__/**',
    '!src/**/index.{js,jsx,ts,tsx}',
    '!src/**/*.config.{js,jsx,ts,tsx}',
    '!src/**/*.setup.{js,jsx,ts,tsx}',
  ],
  coverageThreshold: {
    global: {
      branches: 20,
      functions: 30,
      lines: 40,
      statements: 40,
    },
  },
  coverageReporters: ['text', 'lcov', 'html'],
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
}

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig)
