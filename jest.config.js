// jest.config.js
const path = require("path");

module.exports = {
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
};
