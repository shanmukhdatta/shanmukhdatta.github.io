import { defineConfig } from 'vitest/config';
export default defineConfig({
  oxc: { jsx: { runtime: 'automatic' } },
  test: {
    include: ['tests/**/*.spec.ts', 'tests/**/*.spec.tsx'],
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    testTimeout: 15000,
  },
});
