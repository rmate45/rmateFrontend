// scripts/generate-routes.js
// Robust route generator — logs status + content-type and fails fast with helpful output.

import fs from "fs/promises";
import path from "path";

const BASE = process.env.VITE_API_BASE_URL || "https://dev-api.retiremate.com/api/v1"; // <-- change if your API host is different
const OUT = path.resolve("prerender-routes.json");

function slugify(str = "") {
  return String(str)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function fetchJSON(url) {
  console.log("Fetching:", url);
  const res = await fetch(url, { redirect: "follow" });

  console.log("  status:", res.status, "content-type:", res.headers.get("content-type"));

  // If not application/json, capture sample and fail clearly
  const ct = (res.headers.get("content-type") || "").toLowerCase();
  if (!ct.includes("application/json")) {
    const text = await res.text();
    console.error("✖ Expected JSON but got non-JSON response. First 1000 chars:");
    console.error(text.slice(0, 1000));
    throw new Error(`Endpoint ${url} did not return JSON (content-type: ${ct}). Check API_BASE / endpoint.`);
  }

  const body = await res.json();
  // Some APIs wrap data under `.data`, others return array directly — normalize
  return body?.data ?? body ?? [];
}

async function main() {
  try {
    const explore = await fetchJSON(`${BASE}/get-explore-questions`);
    const medicare = await fetchJSON(`${BASE}/get-medicare-questions`);
    const financial = await fetchJSON(`${BASE}/get-financial-plannings`);
    const roth = await fetchJSON(`${BASE}/get-roth-questions`);

    const routes = [];

    explore.forEach((q) => {
      if (!q?._id) return;
      routes.push(
        `/Top-Explore-Questions/${slugify(q.question || q.title || q.name)}?id=${encodeURIComponent(q._id)}&type=explore`
      );
    });

    medicare.forEach((q) => {
      if (!q?._id) return;
      routes.push(
        `/Top-Medicare-Questions/${slugify(q.question || q.title || q.name)}?id=${encodeURIComponent(q._id)}&type=medicare`
      );
    });

    financial.forEach((q) => {
      if (!q?._id) return;
      routes.push(
        `/Top-Financial-Planning-Questions/${slugify(q.question || q.title || q.name)}?id=${encodeURIComponent(q._id)}&type=financial`
      );
    });

    roth.forEach((q) => {
      if (!q?._id) return;
      routes.push(
        `/Top-Roth-Conversion-Retirement-Questions/${slugify(q.question || q.title || q.name)}?id=${encodeURIComponent(q._id)}&type=roth`
      );
    });

    // Add common static routes
    routes.push("/", "/financial", "/medicare", "/explore");

    await fs.writeFile(OUT, JSON.stringify({ routes }, null, 2), "utf-8");
    console.log(`Wrote ${OUT} — ${routes.length} routes.`);
  } catch (err) {
    console.error("\nRoute generation failed:", err.message || err);
    process.exit(1);
  }
}

main();
