import { loadEnvFile, env } from "node:process";
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

loadEnvFile('../.env');

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: `${env.BACKEND_URL}:${env.BACKEND_PORT || 3000}`,
        changeOrigin: true
      }
    }
  }
});