import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { createHtmlPlugin } from "vite-plugin-html";
import Sitemap from "vite-plugin-sitemap";


export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    createHtmlPlugin({ minify: true }),
    Sitemap({ hostname: "https://retiremate.com" }),
  ],
   server: {
    host: false, 
  },
})
