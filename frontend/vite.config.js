import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3003,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react')) return 'vendor-react';
            if (id.includes('socket.io-client')) return 'vendor-socketio';
            if (id.includes('react-query')) return 'vendor-reactquery';
            return 'vendor';
          }
        }
      }
    }
  }
})
