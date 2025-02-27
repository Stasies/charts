import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    dir: './src/tests/',
    setupFiles: ['__setups__/canvas.ts'],
    environment: 'happy-dom', // Simulates a browser
    globals: true,
  }
})