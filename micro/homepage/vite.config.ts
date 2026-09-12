import react from '@vitejs/plugin-react'
import { federation } from '@module-federation/vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'mainPage',
      filename: 'remoteEntry.js',
      exposes: {
        './HomePage': './src/components/HomePage.tsx',
      },
      dts: false,
      shared: {
        react: { singleton: true },
        'react-dom': { singleton: true },
      },
    }),
  ],
  server: {
    port: 5174,
    strictPort: true,
    cors: true,
    origin: 'http://localhost:5174',
  },
  preview: {
    port: 5174,
    strictPort: true,
    cors: true,
  },
  build: {
    target: 'esnext',
  },
})
