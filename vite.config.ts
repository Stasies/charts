/// <reference types="vitest" />

import { defineConfig } from "vite";

export default defineConfig({
  test: {
    globals: true,
    environment: "happy-dom",
  },
  build: {
    emptyOutDir: false,
    lib: {
      entry: "src/texteditor.ts",
      name: "texteditor",
      fileName: (format) => `texteditor.${format}.js`,
    },
  },
});