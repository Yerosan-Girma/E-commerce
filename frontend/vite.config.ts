import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    port: 3000,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined
          if (id.includes('react') || id.includes('react-router-dom')) return 'react'
          if (id.includes('@reduxjs/toolkit') || id.includes('react-redux')) return 'state'
          if (id.includes('framer-motion') || id.includes('gsap')) return 'animation'
          if (id.includes('three') || id.includes('@react-three')) return 'three'
          return 'vendor'
        },
      },
    },
  },
})
