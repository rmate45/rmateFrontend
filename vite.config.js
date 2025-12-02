import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { createHtmlPlugin } from "vite-plugin-html";
import Sitemap from "vite-plugin-sitemap";


export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      react(),
      tailwindcss(),
      createHtmlPlugin({ minify: true }),
      Sitemap({ hostname: env.VITE_WEBSITE_URL }),
    ],
    server: {
      historyApiFallback: true
    },
    build: {
      manifest: true
    }
  }
})
