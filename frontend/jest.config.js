module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/'],
  testMatch: ['**/?(*.)+(spec|test).[jt]s?(x)'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
    '^.+\\.(js|jsx)$': 'babel-jest', // Transforma .js y .jsx con babel-jest
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(png|jpg|jpeg|gif|svg)$': '<rootDir>/__mocks__/next/fileMock.js',
    '\\.(css|less|scss)$': 'identity-obj-proxy',
    '^next/image$': '<rootDir>/__mocks__/next/image.js',
    '^next/link$': '<rootDir>/__mocks__/next/link.js',
    '^@/app/components/ui/button$': '<rootDir>/__mocks__/ui/button.js',
    '^lucide-react$': '<rootDir>/__mocks__/lucide-react.js',
  },
  setupFilesAfterEnv: ['<rootDir>/tests/setupTests.ts'],
};