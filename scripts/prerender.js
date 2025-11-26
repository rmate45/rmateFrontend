// scripts/prerender.js
import fs from "fs/promises";
import path from "path";
import { chromium } from "playwright";

const DIST = path.resolve("dist");
const ROUTES_FILE = path.resolve("prerender-routes.json");
const BASE = process.env.VITE_API_BASE_URL || "https://dev-api.retiremate.com/api/v1";
const TIMEOUT = 15000; // timeout per page

function routeToOutPath(route) {
  const url = new URL(route, BASE);
  const pathname = url.pathname === "/" ? "/index.html" : path.join(url.pathname, "index.html");
  return path.join(DIST, pathname);
}

async function ensureDirFor(filePath) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
}

function urlJoin(base, route) {
  return new URL(route, base).toString();
}

async function saveHtml(outPath, html) {
  await ensureDirFor(outPath);
  await fs.writeFile(outPath, html, "utf8");
}

async function main() {
  console.log("Prerender start. BASE =", BASE);
  const raw = await fs.readFile(ROUTES_FILE, "utf8");
  const { routes } = JSON.parse(raw);
  console.log("Routes to prerender:", routes.length);

  // Launch chromium headless
  const browser = await chromium.launch({ args: ["--no-sandbox", "--disable-setuid-sandbox"] });

  const context = await browser.newContext({
    userAgent:
      "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36",
  });

  const page = await context.newPage();

  for (const route of routes) {
    const full = urlJoin(BASE, route);
    console.log("-> Rendering:", full);

    try {
      // navigate
      const resp = await page.goto(full, { waitUntil: "networkidle", timeout: TIMEOUT });
      if (!resp) console.warn("   no response object for", full);

      // Wait for OG title (SeoHelmet injects it). If not present, fall back to small timeout.
      try {
        await page.waitForSelector('meta[property="og:title"]', { timeout: 7000 });
        console.log("   og:title present");
      } catch (err) {
        console.warn("   og:title not detected within timeout; falling back to short wait");
        await page.waitForTimeout(700);
      }

      // extra safety: wait for a window flag if your pages set it
      try {
        await page.waitForFunction('window.__PRERENDER_READY === true', { timeout: 2000 }).catch(() => {});
      } catch (e) {
        // ignore
      }

      // small pause to let Helmet finalize changes
      await page.waitForTimeout(300);

      const html = await page.content();
      const outPath = routeToOutPath(route);
      await saveHtml(outPath, html);
      console.log("   Saved:", outPath);
    } catch (err) {
      console.error("   Failed rendering", full, ":", err && err.message ? err.message : err);
      // continue with next route (do not abort whole build)
    }
  }

  await browser.close();
  console.log("Prerender complete.");
}

main().catch((err) => {
  console.error("Prerender crashed:", err);
  process.exit(1);
});
