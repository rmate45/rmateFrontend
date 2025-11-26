import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import Pages from "vite-plugin-pages";
import { createHtmlPlugin } from "vite-plugin-html";
import Sitemap from "vite-plugin-sitemap";

const NGROK_HOST =  "jovanni-sighlike-nonoptimistically.ngrok-free.dev";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    Pages({ extensions: ["jsx", "js"] }),
    createHtmlPlugin({ minify: true }),
    Sitemap({ hostname: "https://dev.retiremate.com" }),
  ],
   server: {
    host: true, // listen on network interfaces
    // allow this specific ngrok hostname (or use array of hostnames)
    allowedHosts: [NGROK_HOST, ".ngrok-free.dev"],
    // HMR settings so websocket connects from the public ngrok host
    hmr: {
      protocol: "wss",
      host: NGROK_HOST,
      port: 443,
    },
  },
})
