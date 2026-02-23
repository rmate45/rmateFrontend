// api/prerender.js
import fs from "fs";
import path from "path";
import axios from "axios";

const API_BASE_URL =
  process.env.VITE_API_BASE_URL ||
  "https://quiz-api.retiremate.com/api/v1";

const WEBSITE_URL = process.env.VITE_WEBSITE_URL || "https://www.retiremate.com";

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
    title: "RetireMate: Instant Retirement Guidance, Every Step of the Way",
    description: "See what your retirement could look like. Get instant, personalized retirement guidance and test-drive retirement plans for people like you.",
    image: `${WEBSITE_URL}/retiremate.jpg`,
    url: `${WEBSITE_URL}${url === "/" ? "" : url}`,
    robots: robotsContent,
  };

  try {
    // Always return default meta for root route
    if (url === "/" || url === "/index.html" || !url) {
      console.log("Returning default meta for root route:", url);
      return defaultMeta;
    }

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
          image: data?.image,
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
         image: data?.image,
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
          image: data?.image,
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
         image: data?.image,
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
          image: data?.image,
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
    const userAgent = req.headers['user-agent'] || '';
    const isTeamsBot = userAgent.includes('MicrosoftPreview') || userAgent.includes('Teams') || userAgent.includes('SkypeUriPreview');
    
    console.log("Prerender called for path:", pathParam);
    console.log("User Agent:", userAgent);
    console.log("Is Teams Bot:", isTeamsBot);
    
    const indexPath = path.resolve(process.cwd(), "dist", "_index.html");
    const fallbackPath = path.resolve(process.cwd(), "dist", "index.html");

    // Try _index.html first, fallback to index.html
    let htmlPath = indexPath;
    if (!fs.existsSync(indexPath)) {
      console.log("_index.html not found, using index.html");
      htmlPath = fallbackPath;
    }

    if (!fs.existsSync(htmlPath)) {
      console.error("No HTML template found at:", htmlPath);
      return res.status(404).send("HTML template not found");
    }

    const htmlData = await fs.promises.readFile(htmlPath, "utf8");
    const meta = await getPageMetadata(pathParam, req.query || {});
    
    console.log("Meta data:", meta);

    let finalHtml = htmlData
      .replace(/__META_TITLE__/g, meta.title)
      .replace(/__META_DESCRIPTION__/g, meta.description)
      .replace(/__META_OG_TITLE__/g, meta.title)
      .replace(/__META_OG_DESCRIPTION__/g, meta.description)
      .replace(/__META_OG_IMAGE__/g, meta.image)
      .replace(/__META_OG_URL__/g, meta.url)
      .replace(/__META_ROBOTS__/g, meta.robots)
      .replace(/<!--app-html-->/g, "")
      .replace(/<!--app-head-->/g, "")
      .replace(/<!--app-scripts-->/g, "");

    // Clean up any remaining placeholders
    finalHtml = finalHtml.replace(/__META_[A-Z0-9_]+__/g, "");

    console.log("Prerender successful for:", pathParam);

    // Set headers - Teams is picky about these
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("X-Prerender", "true");
    
    if (isTeamsBot) {
      // Teams-specific headers
      res.setHeader("Cache-Control", "public, max-age=300"); // 5 minutes cache for Teams
      res.setHeader("X-Robots-Tag", "index, follow");
    } else {
      res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    }

    res.status(200).send(finalHtml);
  } catch (err) {
    console.error("Prerender error:", err);
    res.status(500).send(`Server error: ${err.message}`);
  }
}
