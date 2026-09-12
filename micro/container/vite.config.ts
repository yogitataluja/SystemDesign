import react from '@vitejs/plugin-react'
import { federation } from '@module-federation/vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'containerPage',
      filename: 'remoteEntry.js',
      remotes: {
        mainPage: {
          type: 'module',
          name: 'mainPage',
          entry: 'http://localhost:5174/remoteEntry.js',
        },
        coursePage: {
          type: 'module',
          name: 'coursePage',
          entry: 'http://localhost:5175/remoteEntry.js',
        },
      },
      exposes: {},
      dts: false,
      shared: {
        react: { singleton: true },
        'react-dom': { singleton: true },
      },
    }),
  ],
  server: {
    port: 5173,
    strictPort: true,
    cors: true,
    origin: 'http://localhost:5173',
  },
  preview: {
    port: 5173,
    strictPort: true,
    cors: true,
  },
  build: {
    target: 'esnext',
  },
})
