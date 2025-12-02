// api/prerender.js
import fs from "fs";
import path from "path";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_PRERENDER_API_BASE
const WEBSITE_URL = import.meta.env.VITE_WEBSITE_URL

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
    image: `${WEBSITE_URL}/assets/meta-image-DYDKTIzA.png`,
    url: `${WEBSITE_URL}$${url === "/" ? "" : url}`,
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
          image: defaultMeta.image,
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
          image: defaultMeta.image,
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
          image: defaultMeta.image,
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
          image: defaultMeta.image,
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
      .replace(/__META_OG_URL__/g, meta.url);

    finalHtml = finalHtml.replace(/__META_[A-Z0-9_]+__/g, "");

    res.setHeader("Content-Type", "text/html; charset=utf-8");

    res.setHeader("X-Prerender", "true");
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");

    res.status(200).send(finalHtml);
  } catch (err) {
    res.status(500).send("Server error");
  }
}
