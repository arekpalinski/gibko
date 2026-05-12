import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: '/gibko/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg'],
      manifest: {
        name: 'Gibko',
        short_name: 'Gibko',
        description: 'A playful stretching mission app for kids.',
        theme_color: '#35b779',
        background_color: '#f7fff8',
        display: 'standalone',
        lang: 'pl',
        orientation: 'portrait',
        scope: '/gibko/',
        start_url: '/gibko/',
        icons: [
          {
            src: 'pwa-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable',
          },
          {
            src: 'pwa-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico,json}'],
      },
    }),
  ],
  test: {
    environment: 'jsdom',
    globals: true,
  },
})
