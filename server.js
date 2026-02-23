// api/prerender.js
import fs from "fs";
import path from "path";
import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL;
const WEBSITE_URL = import.meta.env.VITE_WEBSITE_URL || "https://www.retiremate.com";

function slugify(text) {
  return (text || "")
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");
}

async function getPageMetadata(url, queryParams) {
  // Determine if this is a dev environment
  const isDev = WEBSITE_URL.includes('dev.retiremate.com') || WEBSITE_URL.includes('dev-');
  const robotsContent = isDev ? 'noindex, nofollow' : 'index, follow';
  
  const defaultMeta = {
   title :"RetireMate: Instant Retirement Guidance, Every Step of the Way",
    description: "See what your retirement could look like. Get clear, personalized guidance on savings, timing, and where you might retire — in minutes",
    image: `${WEBSITE_URL}/retiremate.jpg`,
    url: `${WEBSITE_URL}${url === "/" ? "" : url}`,
    robots: robotsContent,
  };

  try {
    if (url === "/") return defaultMeta;

    const slug = url.split("/").pop();
    const id = queryParams?.id;

    async function fetchList(endpoint, matchField) {
      const listRes = await axios.get(`${API_BASE_URL}/${endpoint}`);
      const items = listRes.data.data || [];
      return items.find(
        (it) =>
          slugify(it[matchField] || it.title || it.name) ===
          decodeURIComponent(slug)
      );
    }

    async function fetchItem(endpoint, id) {
      const res = await axios.get(`${API_BASE_URL}/${endpoint}/${id}`);
      return res.data.data || res.data;
    }

    if (url.includes("/q/Top-Explore-Questions/general/")) {
      const pathId = url.split("/").pop();
      const data = pathId
        ? await fetchItem("get-explore-question", pathId)
        : null;
      if (data)
        return {
          title: data.question,
          description: (data.answer || "").replace(/<[^>]*>/g, "").slice(0, 160),
          image: defaultMeta.image,
          url: defaultMeta.url,
          robots: defaultMeta.robots,
        };
      return defaultMeta;
    }

    if (url.includes("/q/Top-Explore-Questions/roth-conversions/")) {
      // Extract id from URL path (last segment)
      const pathId = url.split("/").pop();
      const data = pathId
        ? await fetchItem("get-roth-question", pathId)
        : null;
      if (data)
        return {
          title: data.question,
          description: (data.answer || "").replace(/<[^>]*>/g, "").slice(0, 160),
          image: defaultMeta.image,
          url: defaultMeta.url,
          robots: defaultMeta.robots,
        };
      return defaultMeta;
    }

    if (url.includes("/q/Top-Explore-Questions/financial-planning/")) {
      const pathId = url.split("/").pop();
      const data = pathId
        ? await fetchItem("get-financial-planning", pathId)
        : null;
      if (data)
        return {
          title: data.question,
          description: (data.answer || "").slice(0, 160),
          image: defaultMeta.image,
          url: defaultMeta.url,
          robots: defaultMeta.robots,
        };
      return defaultMeta;
    }

    if (url.includes("/q/Top-Explore-Questions/medicare/")) {
      const pathId = url.split("/").pop();
      const data = pathId
        ? await fetchItem("get-medicare-question", pathId)
        : null;
      if (data)
        return {
          title: data.question,
          description: (data.answer || "").slice(0, 160),
          image: defaultMeta.image,
          url: defaultMeta.url,
          robots: defaultMeta.robots,
        };
      return defaultMeta;
    }

    if (url.includes("/q/Top-Explore-Questions/persona/")) {
      const pathId = url.split("/").pop();
      const data = pathId
        ? await fetchItem("get-persona", pathId)
        : null;
      if (data)
        return {
          title: data.persona_question,
          description: (data.persona_description || "").slice(0, 160),
          image: defaultMeta.image,
          url: defaultMeta.url,
          robots: defaultMeta.robots,
        };
      return defaultMeta;
    }

    // New persona URL pattern: /p/[name-age-career]/[persona-id]
    if (url.includes("/p/")) {
      const pathSegments = url.split("/");
      const pathId = pathSegments[pathSegments.length - 1];
      const data = pathId
        ? await fetchItem("get-persona", pathId)
        : null;
      if (data)
        return {
          title: data.persona_question,
          description: (data.persona_description || "").slice(0, 160),
          image: defaultMeta.image,
          url: defaultMeta.url,
          robots: defaultMeta.robots,
        };
      return defaultMeta;
    }

    return defaultMeta;
  } catch (err) {
    return defaultMeta;
  }
}

export default async function handler(req, res) {
  try {
    const pathParam = req.query.path || req.url || "/";
    const indexPath = path.resolve(process.cwd(), "dist", "index.html");

    const htmlData = await fs.promises.readFile(indexPath, "utf8");
    const meta = await getPageMetadata(pathParam, req.query || {});

    let finalHtml = htmlData
      .replace(/__META_TITLE__/g, meta.title)
      .replace(/__META_DESCRIPTION__/g, meta.description)
      .replace(/__META_OG_TITLE__/g, meta.title)
      .replace(/__META_OG_DESCRIPTION__/g, meta.description)
      .replace(/__META_OG_IMAGE__/g, meta.image)
      .replace(/__META_OG_URL__/g, meta.url)
      .replace(/__META_ROBOTS__/g, meta.robots);

    finalHtml = finalHtml.replace(/__META_[A-Z0-9_]+__/g, "");

    res.setHeader("Content-Type", "text/html; charset=utf-8");

   res.setHeader("X-Prerender", "true");
res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");

    res.status(200).send(finalHtml);
  } catch (err) {
    res.status(500).send("Server error");
  }
}
