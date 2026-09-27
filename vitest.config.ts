import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    setupFiles: ['./src/setupTests.ts'],
    include: ['src/__test__/**/*.ts', 'src/**/*.{test,spec}.ts'],
  },
});