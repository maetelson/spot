import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'node:path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      manifest: {
        name: 'spot.',
        short_name: 'spot.',
        description: '동네 기반 장소 큐레이션 PWA',
        lang: 'ko',
        theme_color: '#FF6B5E',
        background_color: '#FBFAFB',
        display: 'standalone',
        start_url: '/',
        icons: [
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        // PRD §19.1 cache strategy
        // app shell (html/css/js) is precached automatically by globPatterns
        globPatterns: ['**/*.{js,css,html,svg,woff2}'],
        runtimeCaching: [
          {
            // place data → StaleWhileRevalidate (offline read, background refresh)
            urlPattern: /https:\/\/.*\.supabase\.co\/.*/i,
            handler: 'StaleWhileRevalidate',
            options: { cacheName: 'spot-data' },
          },
          {
            // kakao map tiles/sdk → NetworkFirst (online preferred, cache fallback)
            urlPattern: /https:\/\/.*\.(kakao|daumcdn)\.(com|net)\/.*/i,
            handler: 'NetworkFirst',
            options: { cacheName: 'kakao-map' },
          },
        ],
      },
      devOptions: { enabled: false },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
});
