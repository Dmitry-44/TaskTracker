module.exports = {
    setupFiles: ["<rootDir>/jest.setup.js"],
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    testEnvironmentOptions: {
        customExportConditions: ["node", "node-addons"],
    },
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
        '^~/(.*)$': '<rootDir>/$1',
        // ".*\\.(vue)$": "<rootDir>/node_modules/vue/vue3-jest",
        // '^vue$': 'vue/dist/vue.common.js',
    },
    transform: {
        '^.+\\.vue$': '@vue/vue3-jest',
        '^.+\\js$': 'babel-jest',
        '^.+\\.ts$': 'ts-jest',
    },
    verbose: true,
    testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(js|ts)$',
    moduleFileExtensions: ['vue', 'js', 'ts'],
  }