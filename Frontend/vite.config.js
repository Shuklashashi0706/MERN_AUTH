import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server:{
    port:3000,
    proxy:{
      '/api':{
        target:'https://auth-3i6i.onrender.com',
        changeOrigin:true
      }
    }
  }
})
