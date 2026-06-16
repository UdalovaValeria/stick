import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    environment: 'jsdom', // эмуляция браузера: будет localStorage, нужный хранилищу
    globals: true,        // describe/it/expect доступны без импорта
  },
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') }, // чтобы работали импорты через "@/"
  },
});