module.exports = {
  preset: "jest-expo",
  modulePathIgnorePatterns: ["<rootDir>/\\.kilo/worktrees/"],
  testMatch: [
    "<rootDir>/src/**/*.test.ts",
    "<rootDir>/src/**/*.test.tsx",
    "<rootDir>/__tests__/**/*.test.ts",
    "<rootDir>/__tests__/**/*.test.tsx"
  ],
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  moduleNameMapper: {
    "^expo/src/winter$": "<rootDir>/jest.winter.js",
    "^@/(.*)$": "<rootDir>/src/$1"
  },
  transformIgnorePatterns: [
    "node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg)"
  ],
  collectCoverageFrom: [
    "src/model/**/*.ts",
    "src/usecase/**/*.ts",
    "src/infra/**/*.ts",
    "src/di/**/*.ts",
    "src/viewmodel/**/*.ts",
    "src/view/components/**/*.tsx",
    "src/view/theme.ts",
    "src/view/index.tsx",
    "src/view/home.tsx",
    "src/view/pizza.tsx",
    "src/view/shop.tsx",
    "src/view/progress.tsx",
    "!**/*.test.ts",
    "!**/*.test.tsx",
    "!**/i*.ts"
  ],
  coverageThreshold: {
    global: {
      statements: 80,
      branches: 80,
      functions: 80,
      lines: 80
    }
  }
};
