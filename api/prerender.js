// api/prerender.js
import fs from "fs";
import path from "path";
import axios from "axios";

const API_BASE_URL =
  process.env.VITE_PRERENDER_API_BASE ||
  "https://dev-api.retiremate.com/api/v1";

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
  const defaultMeta = {
    title: "RetireMate",
    description: "Expert-curated retirement and Medicare insights.",
    image: "https://dev.retiremate.com/assets/meta-image-DYDKTIzA.png",
    url: `https://dev.retiremate.com${url === "/" ? "" : url}`,
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

    if (url.includes("/Top-Explore-Questions/")) {
      const data = id
        ? await fetchItem("get-explore-question", id)
        : await fetchList("get-explore-questions", "question");
      if (data)
        return {
          title: data.question,
          description: (data.answer || "").replace(/<[^>]*>/g, "").slice(0, 160),
          image: defaultMeta.image,
          url: defaultMeta.url,
        };
      return defaultMeta;
    }

    if (url.includes("/Top-Roth-Conversion-Retirement-Questions/")) {
      const data = id
        ? await fetchItem("get-roth-question", id)
        : await fetchList("get-roth-questions", "question");
      if (data)
        return {
          title: data.question,
          description: (data.answer || "").replace(/<[^>]*>/g, "").slice(0, 160),
          image: data?.image,
          url: defaultMeta.url,
        };
      return defaultMeta;
    }

    if (url.includes("/Top-Financial-Planning-Questions/")) {
      const data = id
        ? await fetchItem("get-financial-planning", id)
        : await fetchList("get-financial-planning", "question");
      if (data)
        return {
          title: data.question,
          description: (data.answer || "").slice(0, 160),
         image: data?.image,
          url: defaultMeta.url,
        };
      return defaultMeta;
    }

    if (url.includes("/Top-Medicare-Questions/")) {
      const data = id
        ? await fetchItem("get-medicare-question", id)
        : await fetchList("get-medicare-question", "question");
      if (data)
        return {
          title: data.question,
          description: (data.answer || "").slice(0, 160),
          image: data?.image,
          url: defaultMeta.url,
        };
      return defaultMeta;
    }

    if (url.includes("/Persona/")) {
      const data = id
        ? await fetchItem("get-persona", id)
        : await fetchList("get-personas", "persona_question");
      if (data)
        return {
          title: data.persona_question,
          description: (data.persona_description || "").slice(0, 160),
         image: data?.image,
          url: defaultMeta.url,
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
    // Extract path from query param - this is the most reliable way
    let pathParam = req.query?.path;
    
    // Handle root route explicitly
    if (!pathParam || pathParam === '' || pathParam === undefined || pathParam === null) {
      pathParam = "/";
    }
    
    // Normalize path - ensure it starts with /
    if (!pathParam.startsWith("/")) {
      pathParam = "/" + pathParam;
    }
    
    // Ensure root route is exactly "/"
    if (pathParam === "" || pathParam === "//") {
      pathParam = "/";
    }
    
    // Debug logging (remove in production if needed)
    console.log('[Prerender] Path:', pathParam, 'Query:', req.query, 'URL:', req.url);
    
    const indexPath = path.resolve(process.cwd(), "dist", "index.html");

    const htmlData = await fs.promises.readFile(indexPath, "utf8");
    const meta = await getPageMetadata(pathParam, req.query || {});
    
    // Ensure we have valid meta values (fallback to defaults if needed)
    const safeMeta = {
      title: meta?.title || "RetireMate",
      description: meta?.description || "Expert-curated retirement and Medicare insights.",
      image: meta?.image || "https://dev.retiremate.com/assets/meta-image-DYDKTIzA.png",
      url: meta?.url || `https://dev.retiremate.com${pathParam === "/" ? "" : pathParam}`
    };
    
    // Debug: Log meta values to verify they're correct
    console.log('[Prerender] Meta values:', safeMeta);

    let finalHtml = htmlData
      .replace(/__META_TITLE__/g, safeMeta.title)
      .replace(/__META_DESCRIPTION__/g, safeMeta.description)
      .replace(/__META_OG_TITLE__/g, safeMeta.title)
      .replace(/__META_OG_DESCRIPTION__/g, safeMeta.description)
      .replace(/__META_OG_IMAGE__/g, safeMeta.image)
      .replace(/__META_OG_URL__/g, safeMeta.url);

    // Remove any remaining placeholders as a safety measure
    finalHtml = finalHtml.replace(/__META_[A-Z0-9_]+__/g, "");
    
    // Verify replacements worked
    if (finalHtml.includes('__META_')) {
      console.error('[Prerender] WARNING: Some placeholders were not replaced!');
    }

    res.setHeader("Content-Type", "text/html; charset=utf-8");

    res.setHeader("X-Prerender", "true");
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");

    res.status(200).send(finalHtml);
  } catch (err) {
    res.status(500).send("Server error");
  }
}
