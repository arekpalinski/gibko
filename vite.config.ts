import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: '/gibko/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: [
        'assets/gibko-logo-transparent.webp',
        'assets/gibko-mascot-stretch-transparent.webp',
        'assets/gibko-hello-transparent.webp',
        'assets/gibko-profile-avatar.webp',
        'assets/gibko-mission-completed-1.webp',
        'assets/gibko-mission-completed-2.webp',
        'assets/gibko-exercise-1.webp',
        'assets/gibko-exercise-2.webp',
        'assets/gibko-exercise-3.webp',
        'assets/gibko-exercise-4.webp',
      ],
      manifest: {
        name: 'Gibko',
        short_name: 'Gibko',
        description: 'A playful stretching mission app for kids with Gibko the gibbon.',
        theme_color: '#020f21',
        background_color: '#020f21',
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
        globPatterns: ['**/*.{js,css,html,svg,png,webp,ico,json}'],
      },
    }),
  ],
  test: {
    environment: 'jsdom',
    globals: true,
  },
})
