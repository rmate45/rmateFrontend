import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { ViteSitemap } from 'vite-plugin-sitemap';
import { createHtmlPlugin } from 'vite-plugin-html';
import { viteSSG } from 'vite-ssg/serialized-data';

const routes = [
  { path: '/', name: 'Home' },
  { path: '/intro', name: 'Intro' },
  { path: '/quiz', name: 'Quiz' },
  { path: '/plans/:phone/:id', name: 'Plan' },
  { path: '/Top-Roth-Conversion-Retirement-Questions/:slug', name: 'Roth' },
];

export default defineConfig({
  plugins: [
    react(),
    viteSSG({ includedRoutes: () => routes }),
    ViteSitemap({
      baseUrl: 'https://dev.retiremate.com',
      routes,
      generateRobotsTxt: true,
    }),
    createHtmlPlugin({
      minify: true,
      inject: {
        data: {
          title: 'Default Title',
          description: 'Default Description',
        },
      },
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom'],
        },
      },
    },
  },
});