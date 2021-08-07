const transformIgnorePatterns = [
  "node_modules/(?!(jest-)?react-native|unimodules-permissions-interface|react-clone-referenced-element|@react-native-picker|@react-native-community|expo(nent)?|@expo(nent)?/.*|react-navigation|@react-navigation/.*|@unimodules/.*|sentry-expo|native-base|@storybook)",
]

module.exports = {
  preset: "jest-expo",
  cacheDirectory: ".jest-cache",
  setupFiles: ["<rootDir>/node_modules/react-native/jest/setup.js", "<rootDir>/test/setup.ts"],
  testPathIgnorePatterns: ["/node_modules/", "/e2e"],
  transformIgnorePatterns: [
    "node_modules/(?!(jest-)?react-native|@react-navigation|@storybook|@react-native-community|expo-localization|@unimodules)",
  ],
  projects: [
    {
      preset: "jest-expo/ios",
      transformIgnorePatterns,
      testPathIgnorePatterns: ["/node_modules/", "/e2e"],
    },
    // {
    //   preset: "jest-expo/android",
    //   transformIgnorePatterns,
    //   testPathIgnorePatterns: ["/node_modules/", "/e2e"],
    // },
  ],
}
