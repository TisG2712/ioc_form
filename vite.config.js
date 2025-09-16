import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  define: {
    'process.env': {}
  },
  envPrefix: 'VITE_',
  server: {
    port: 5173,
    // host: true, 
    host: 'localhost',
    proxy: {
      '/api': {
        // target: 'http://10.6.8.9:8082',
        target: 'http://localhost:8082',
        changeOrigin: true,
        secure: false,
      }
    }
  }
});
