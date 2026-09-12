import react from '@vitejs/plugin-react'
import { federation } from '@module-federation/vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'coursePage',
      filename: 'remoteEntry.js',
      exposes: {
        './Course': './src/components/Coures.tsx',
      },
      dts: false,
      shared: {
        react: { singleton: true },
        'react-dom': { singleton: true },
      },
    }),
  ],
  server: {
    port: 5175,
    strictPort: true,
    cors: true,
    origin: 'http://localhost:5175',
  },
  preview: {
    port: 5175,
    strictPort: true,
    cors: true,
  },
  build: {
    target: 'esnext',
  },
})
