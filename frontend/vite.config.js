import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5172, // Specify the port here
  },
  resolve: {
    alias: {
      '@': '/src', // this makes `@` point to `src` directory
      // "@": path.resolve(__dirname, "./src"),
    },
  },
});
