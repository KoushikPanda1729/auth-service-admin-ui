import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/__tests__/setup.ts"],
    css: true,
    reporters: ["verbose"],
    testTimeout: 10000, // Increase timeout for CI environments
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      all: false,
      exclude: [
        "node_modules/",
        "src/__tests__/",
        "**/*.test.{ts,tsx}",
        "**/*.config.{ts,js}",
        "**/types.ts",
        "**/index.ts",
      ],
    },
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
});
