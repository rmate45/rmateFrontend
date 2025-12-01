import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    createHtmlPlugin({ minify: true }),
    Sitemap({ hostname: "https://dev.retiremate.com" }),
  ],
     server: {
    historyApiFallback: true
  }
   
})
