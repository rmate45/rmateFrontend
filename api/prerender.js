// --- start patch (insert/replace in your prerender.js) ---
/* eslint-disable no-console */
import fs from "fs";
import path from "path";
import axios from "axios";

const API_BASE_URL = process.env.VITE_PRERENDER_API_BASE || "https://dev-api.retiremate.com/api/v1";

function slugify(text) {
  if (!text) return "";
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");
}

async function getPageMetadata(url, queryParams) {
  // default meta (fallback)
  const defaultMeta = {
    title: "RetireMate",
    description: "Expert-curated retirement and Medicare insights.",
    image: "https://dev.retiremate.com/assets/meta-image-DYDKTIzA.png",
    url: `https://dev.retiremate.com${url === "/" ? "" : url}`,
  };

  try {
    // LOG for debugging (visible in Vercel function logs)
    console.log("[prerender] getPageMetadata called for:", url, "query:", queryParams);

    // EXPLICIT: handle only the exact root path "/" with a deterministic meta
    if (url === "/") {
      return {
        title: defaultMeta.title,
        description: defaultMeta.description,
        image: defaultMeta.image,
        url: "https://dev.retiremate.com",
      };
    }

    // proceed with existing dynamic rules for slug pages
    const slug = url.split("/").pop();
    const id = queryParams?.id;

    // Top-Explore-Questions
    if (url.includes("/Top-Explore-Questions/")) {
      let data = null;
      if (id) {
        const res = await axios.get(`${API_BASE_URL}/get-explore-question/${id}`);
        data = res.data.data || res.data;
      } else {
        const res = await axios.get(`${API_BASE_URL}/get-explore-questions`);
        const items = res.data.data || [];
        data = items.find((it) => slugify(it.question || it.title || it.name) === decodeURIComponent(slug));
      }
      if (data) {
        return {
          title: data.question || data.title || "Explore Question",
          description: (data.answer || "").replace(/<[^>]*>/g, "").slice(0, 160),
          image: defaultMeta.image,
          url: `https://dev.retiremate.com${url}`,
        };
      }
      return defaultMeta;
    }

    // Roth Questions
    if (url.includes("/Top-Roth-Conversion-Retirement-Questions/")) {
      let data = null;
      if (id) {
        const res = await axios.get(`${API_BASE_URL}/get-roth-question/${id}`);
        data = res.data.data || res.data;
      } else {
        const res = await axios.get(`${API_BASE_URL}/get-roth-questions`);
        const items = res.data.data || [];
        data = items.find((it) => slugify(it.question || it.title || it.name) === decodeURIComponent(slug));
      }
      if (data) {
        return {
          title: data.question || data.title || "Roth Conversion Retirement Question",
          description: (data.answer || "").replace(/<[^>]*>/g, "").slice(0, 160),
          image: defaultMeta.image,
          url: `https://dev.retiremate.com${url}`,
        };
      }
      return defaultMeta;
    }

    // Financial Planning
    if (url.includes("/Top-Financial-Planning-Questions/")) {
      let data = null;
      if (id) {
        const res = await axios.get(`${API_BASE_URL}/get-financial-planning/${id}`);
        data = res.data.data || res.data;
      } else {
        const res = await axios.get(`${API_BASE_URL}/get-financial-planning`);
        const items = res.data.data || [];
        data = items.find((it) => slugify(it.question || it.title || it.name) === decodeURIComponent(slug));
      }
      if (data) {
        return {
          title: data.question || data.title || "Financial Planning",
          description: (data.answer || "").replace(/<[^>]*>/g, "").slice(0, 160),
          image: defaultMeta.image,
          url: `https://dev.retiremate.com${url}`,
        };
      }
      return defaultMeta;
    }

    // Medicare
    if (url.includes("/Top-Medicare-Questions/")) {
      let data = null;
      if (id) {
        const res = await axios.get(`${API_BASE_URL}/get-medicare-question/${id}`);
        data = res.data.data || res.data;
      } else {
        const res = await axios.get(`${API_BASE_URL}/get-medicare-question`);
        const items = res.data.data || [];
        data = items.find((it) => slugify(it.question || it.title || it.name) === decodeURIComponent(slug));
      }
      if (data) {
        return {
          title: data.question || data.title || "Medicare Question",
          description: (data.answer || "").replace(/<[^>]*>/g, "").slice(0, 160),
          image: defaultMeta.image,
          url: `https://dev.retiremate.com${url}`,
        };
      }
      return defaultMeta;
    }

    // Persona
    if (url.includes("/Persona/")) {
      let data = null;
      if (id) {
        const res = await axios.get(`${API_BASE_URL}/get-persona/${id}`);
        data = res.data.data || res.data;
      } else {
        const res = await axios.get(`${API_BASE_URL}/get-personas`);
        const items = res.data.data || [];
        data = items.find((it) => slugify(it.question || it.title || it.name) === decodeURIComponent(slug));
      }
      if (data) {
        return {
          title: data.persona_question || data.title || "Retirement Persona",
          description: (data.persona_description || "").replace(/<[^>]*>/g, "").slice(0, 160),
          image: defaultMeta.image,
          url: `https://dev.retiremate.com${url}`,
        };
      }
      return defaultMeta;
    }

    // fallback
    return defaultMeta;
  } catch (err) {
    console.error("[prerender] getPageMetadata error:", err?.message || err);
    return {
      title: "RetireMate",
      description: "Expert-curated retirement and Medicare insights.",
      image: "https://dev.retiremate.com/assets/meta-image-DYDKTIzA.png",
      url: `https://dev.retiremate.com${url === "/" ? "" : url}`,
    };
  }
}

export default async function handler(req, res) {
  try {
    const pathParam = req.query.path || req.url || "/";
    const indexPath = path.resolve(process.cwd(), "dist", "index.html");

    console.log("[prerender] handler invoked pathParam:", pathParam);

    if (!fs.existsSync(indexPath)) {
      console.error("[prerender] dist/index.html not found at", indexPath);
      return res.status(500).send("Build not found.");
    }

    const htmlData = await fs.promises.readFile(indexPath, "utf8");
    const meta = await getPageMetadata(pathParam, req.query || {});

    let finalHtml = htmlData
      .replace(/__META_TITLE__/g, meta.title)
      .replace(/__META_DESCRIPTION__/g, meta.description)
      .replace(/__META_OG_TITLE__/g, meta.title)
      .replace(/__META_OG_DESCRIPTION__/g, meta.description)
      .replace(/__META_OG_IMAGE__/g, meta.image)
      .replace(/__META_OG_URL__/g, meta.url);

    // Safety: strip any leftover placeholder tokens so crawlers never see them.
    finalHtml = finalHtml.replace(/__META_[A-Z0-9_]+__/g, "");

    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.status(200).send(finalHtml);
  } catch (err) {
    console.error("[prerender] handler error:", err);
    res.status(500).send("Server error");
  }
}
// --- end patch ---
