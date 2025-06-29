import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path" 

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  assetsInclude: ["**/*.PNG"],
  
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: '0.0.0.0',  // Allows access from any device in the network
    port: 5173,        // Ensure correct port
    strictPort: true,  // Prevents port change
  }
})
