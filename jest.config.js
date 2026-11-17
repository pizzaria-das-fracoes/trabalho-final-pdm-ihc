module.exports = {
  preset: "jest-expo",
  testMatch: ["**/*.test.ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "^expo-modules-core$": "<rootDir>/node_modules/expo-modules-core"
  }
};
