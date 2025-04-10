module.exports = {
    preset: 'ts-jest',           // Soporte para TypeScript
    testEnvironment: 'jsdom',    // Simula un navegador para React
    roots: ['<rootDir>/'],       // Busca pruebas en todo el proyecto
    testMatch: [                 // Patrón para encontrar archivos de prueba
      '**/?(*.)+(spec|test).[jt]s?(x)'
    ],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    transform: {
        '^.+\\.(ts|tsx)$': 'ts-jest', // Asegura que ts-jest maneje .ts y .tsx
    },
    moduleNameMapper: {          // Soporte para imports de Next.js
      '^@/(.*)$': '<rootDir>/$1',
      '\\.(png|jpg|jpeg|gif|svg)$': '<rootDir>/__mocks__/fileMock.js',
    },
    setupFilesAfterEnv: ['<rootDir>/tests/setupTests.ts'],
  };