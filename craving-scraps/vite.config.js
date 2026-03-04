import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    fs: {
      // Allow serving files from one level up (for food images in Vibethon-1)
      allow: ['..'],
    },
  },
})
