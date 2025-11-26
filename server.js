// server.js
import express from 'express';
import path from 'path';
import fs from 'fs';
import axios from 'axios';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const app = express();

// Listening port (use PORT env or fallback)
const PORT = process.env.PORT || 3000;

// __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const indexPath = path.resolve(__dirname, 'dist', 'index.html');

// API base (set via env for different environments)
const API_BASE_URL = process.env.VITE_PRERENDER_API_BASE || "https://dev-api.retiremate.com/api/v1";

// Serve static assets from dist but don't auto-serve index.html
app.use(express.static(path.resolve(__dirname, 'dist'), { index: false }));

function slugify(text) {
  if (!text) return "";
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
}

async function getPageMetadata(url, queryParams) {
  let meta = {
    title: "RetireMate",
    description: "Expert-curated retirement and Medicare insights.",
    image: "https://retiremate.com/assets/logo-D1t2XXia.png",
    url: `https://retiremate.com${url}`
  };

  try {
    const slug = url.split('/').pop();
    const id = queryParams?.id;

    // Top-Explore-Questions
    if (url.includes('/Top-Explore-Questions/')) {
      let data = null;
      if (id) {
        const res = await axios.get(`${API_BASE_URL}/get-explore-question/${id}`);
        data = res.data.data || res.data;
      } else {
        const res = await axios.get(`${API_BASE_URL}/get-explore-questions`);
        const items = res.data.data || [];
        data = items.find(it => slugify(it.question || it.title || it.name) === decodeURIComponent(slug));
      }
      if (data) {
        meta.title = data.question || data.title || "Explore Question";
        meta.description = (data.answer || "").replace(/<[^>]*>/g, '').slice(0, 160);
      }
      return meta;
    }

    // Financial Planning
    if (url.includes('/Top-Financial-Planning-Questions/')) {
      let data = null;
      if (id) {
        const res = await axios.get(`${API_BASE_URL}/get-financial-planning/${id}`);
        data = res.data.data || res.data;
      } else {
        const res = await axios.get(`${API_BASE_URL}/get-financial-planning`);
        const items = res.data.data || [];
        data = items.find(it => slugify(it.question || it.title || it.name) === decodeURIComponent(slug));
      }
      if (data) {
        meta.title = data.question || data.title || "Financial Planning";
        meta.description = (data.answer || "").replace(/<[^>]*>/g, '').slice(0, 160);
      }
      return meta;
    }

    // Medicare
    if (url.includes('/Top-Medicare-Questions/')) {
      let data = null;
      if (id) {
        const res = await axios.get(`${API_BASE_URL}/get-medicare-question/${id}`);
        data = res.data.data || res.data;
      } else {
        const res = await axios.get(`${API_BASE_URL}/get-medicare-question`);
        const items = res.data.data || [];
        data = items.find(it => slugify(it.question || it.title || it.name) === decodeURIComponent(slug));
      }
      if (data) {
        meta.title = data.question || data.title || "Medicare Question";
        meta.description = (data.answer || "").replace(/<[^>]*>/g, '').slice(0, 160);
      }
      return meta;
    }

    // Persona
    if (url.includes('/Persona/')) {
      let data = null;
      if (id) {
        const res = await axios.get(`${API_BASE_URL}/get-persona/${id}`);
        data = res.data.data || res.data;
      } else {
        const res = await axios.get(`${API_BASE_URL}/get-personas`);
        const items = res.data.data || [];
        data = items.find(it => slugify(it.question || it.title || it.name) === decodeURIComponent(slug));
      }
      if (data) {
        meta.title = data.persona_question || data.title || "Retirement Persona";
        meta.description = (data.persona_description || "").replace(/<[^>]*>/g, '').slice(0, 160);
      }
      return meta;
    }
  } catch (err) {
    console.error('getPageMetadata error:', err?.message || err);
  }

  return meta;
}

// CATCH-ALL using app.use -> avoids path-to-regexp parsing of route strings
app.use(async (req, res, next) => {
  // Only handle GET requests for pages (static assets already served above)
  if (req.method !== 'GET') return next();

  // Ensure index exists
  if (!fs.existsSync(indexPath)) {
    console.error('dist/index.html not found at', indexPath);
    return res.status(500).send('Build not found. Run your build step first.');
  }

  try {
    const htmlData = await fs.promises.readFile(indexPath, 'utf8');
    const meta = await getPageMetadata(req.path, req.query || {});

    // Replace tokens if present. If you don't have tokens in index.html, consider injecting into <head> instead.
    const finalHtml = htmlData
      .replace(/__META_TITLE__/g, meta.title)
      .replace(/__META_DESCRIPTION__/g, meta.description)
      .replace(/__META_OG_TITLE__/g, meta.title)
      .replace(/__META_OG_DESCRIPTION__/g, meta.description)
      .replace(/__META_OG_IMAGE__/g, meta.image)
      .replace(/__META_OG_URL__/g, meta.url);

    res.send(finalHtml);
  } catch (err) {
    console.error('Error handling request:', err);
    res.status(500).send('Server error');
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Prerender server listening on port ${PORT} — API_BASE_URL=${API_BASE_URL}`);
});
