import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  // Load env from ./config folder
  const env = loadEnv(mode, process.cwd() + "/env");

  // Stringify all env values for Vite define
  const envWithQuotes = Object.keys(env).reduce((prev, key) => {
    prev[key] = JSON.stringify(env[key]);
    return prev;
  }, {});

  return {
    plugins: [react()],
    define: {
      'process.env': envWithQuotes,
    },
  };
});
