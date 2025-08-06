// vite.config.ts

import { defineConfig } from 'vite'  // Helper to define a Vite configuration with type safety

export default defineConfig({
  server: {
    proxy: {
      // Proxy any request beginning with "/api" to our backend server
      '/api': {
        target: 'http://localhost:3000', // The address of the backend
        changeOrigin: true,              // Rewrite the Origin header to match the target URL
        secure: false                    // Allow self-signed or invalid SSL certificates (for local dev)
      }
    }
  }
})
