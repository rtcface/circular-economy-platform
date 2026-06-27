import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    fileParallelism: false,
  },
  resolve: {
    alias: {
      'vinxi/http': path.resolve(__dirname, './__mocks__/vinxi-http.ts'),
    }
  }
});
