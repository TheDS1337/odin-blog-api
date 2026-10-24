import { loadEnvFile, env } from "node:process";
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

loadEnvFile('../.env');

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: `http://localhost:${env.BACKEND_PORT || 3000}`,
        changeOrigin: true
      }
    }
  }
});