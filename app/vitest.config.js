import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // Переменные тестовой базы, раньше это делал jest.setupFiles
    setupFiles: ["dotenv/config"],
  },
});
