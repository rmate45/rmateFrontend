// api/prerender.js
import fs from "fs";
import path from "path";
import axios from "axios";

/**
 * ENV
 */
const API_BASE_URL = process.env.VITE_PRERENDER_API_BASE;
const WEBSITE_URL = process.env.VITE_WEBSITE_URL;

/**
 * Utils
 */
function slugify(text = "") {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-");
}

function stripHtml(text = "") {
  return text.replace(/<[^>]*>/g, "").trim();
}

/**
 * META RESOLVER
 */
async function getPageMetadata(url, queryParams = {}) {
  const cleanUrl = url.split("?")[0];

  const defaultMeta = {
    title: "RetireMate",
    description: "Expert-curated retirement and Medicare insights.",
    image: `${WEBSITE_URL}/retiremate.jpg`,
    url: `${WEBSITE_URL}${cleanUrl === "/" ? "" : cleanUrl}`,
  };

  try {
    if (cleanUrl === "/") return defaultMeta;

    const slug = slugify(decodeURIComponent(cleanUrl.split("/").pop() || ""));
    const id = queryParams?.id;

    const fetchList = async (endpoint, matchField) => {
      const res = await axios.get(`${API_BASE_URL}/${endpoint}`);
      const items = res.data?.data || [];
      return items.find(
        (it) =>
          slugify(it[matchField] || it.title || it.name) === slug
      );
    };

    const fetchItem = async (endpoint, id) => {
      const res = await axios.get(`${API_BASE_URL}/${endpoint}/${id}`);
      return res.data?.data || res.data;
    };

    if (cleanUrl.includes("/Top-Explore-Questions/")) {
      const data = id
        ? await fetchItem("get-explore-question", id)
        : await fetchList("get-explore-questions", "question");

      if (data)
        return {
          title: data.question,
          description: stripHtml(data.answer).slice(0, 160),
          image: defaultMeta.image,
          url: `${WEBSITE_URL}${cleanUrl}`,
        };
    }

    if (cleanUrl.includes("/Top-Roth-Conversion-Retirement-Questions/")) {
      const data = id
        ? await fetchItem("get-roth-question", id)
        : await fetchList("get-roth-questions", "question");

      if (data)
        return {
          title: data.question,
          description: stripHtml(data.answer).slice(0, 160),
          image: defaultMeta.image,
          url: `${WEBSITE_URL}${cleanUrl}`,
        };
    }

    if (cleanUrl.includes("/Top-Financial-Planning-Questions/")) {
      const data = id
        ? await fetchItem("get-financial-planning", id)
        : await fetchList("get-financial-planning", "question");

      if (data)
        return {
          title: data.question,
          description: stripHtml(data.answer).slice(0, 160),
          image: defaultMeta.image,
          url: `${WEBSITE_URL}${cleanUrl}`,
        };
    }

    if (cleanUrl.includes("/Top-Medicare-Questions/")) {
      const data = id
        ? await fetchItem("get-medicare-question", id)
        : await fetchList("get-medicare-question", "question");

      if (data)
        return {
          title: data.question,
          description: stripHtml(data.answer).slice(0, 160),
          image: defaultMeta.image,
          url: `${WEBSITE_URL}${cleanUrl}`,
        };
    }

    if (cleanUrl.includes("/Persona/")) {
      const data = id
        ? await fetchItem("get-persona", id)
        : await fetchList("get-personas", "persona_question");

      if (data)
        return {
          title: data.persona_question,
          description: stripHtml(data.persona_description).slice(0, 160),
          image: defaultMeta.image,
          url: `${WEBSITE_URL}${cleanUrl}`,
        };
    }

    return defaultMeta;
  } catch (err) {
    console.error("META ERROR:", err.message);
    return defaultMeta;
  }
}

/**
 * PRERENDER HANDLER
 */
export default async function handler(req, res) {
  try {
    const indexPath = path.resolve(process.cwd(), "dist", "index.html");
    let html = await fs.promises.readFile(indexPath, "utf8");

    const meta = await getPageMetadata(req.originalUrl, req.query || {});

    /**
     * 1️⃣ HEAD INJECTION
     */
    html = html.replace(
      "<!--app-head-->",
      `
<title>${meta.title}</title>
<meta name="description" content="${meta.description}" />

<meta property="og:type" content="article" />
<meta property="og:title" content="${meta.title}" />
<meta property="og:description" content="${meta.description}" />
<meta property="og:image" content="${meta.image}" />
<meta property="og:url" content="${meta.url}" />

<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${meta.title}" />
<meta name="twitter:description" content="${meta.description}" />
<meta name="twitter:image" content="${meta.image}" />

<link rel="canonical" href="${meta.url}" />
`
    );

    /**
     * 2️⃣ APP HTML (EMPTY – SPA MOUNTS CLIENT-SIDE)
     */
    html = html.replace("<!--app-html-->", "");

    /**
     * 3️⃣ APP SCRIPTS (KEEP SPA)
     */
    html = html.replace(
      "<!--app-scripts-->",
      `<script type="module" src="/assets/index.js"></script>`
    );

    res
      .status(200)
      .set("Content-Type", "text/html; charset=utf-8")
      .set("X-Prerender", "true")
      .set("Cache-Control", "no-cache, no-store, must-revalidate")
      .send(html);

  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
}
