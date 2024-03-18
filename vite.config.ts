import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    https: {
      key: './public/ssl/server.key',
      cert: './public/ssl/server.crt'
    }
  },
  resolve: {
    alias: {
      "@": "/src",
      //"@admin": "/src/modules/admin",
    },
  },
  plugins: [
    react(),
  ],
  build: {
    //outDir: "", // this line place index.html in the public folder
    assetsDir: "./chunks", // this line place your assets in the public/dist folder
    chunkSizeWarningLimit: 1600,

  }, 
})
