import fs from "fs/promises";
import path from "path";
import { chromium } from "playwright";

const DIST = path.resolve("dist");
const ROUTES_FILE = path.resolve("prerender-routes.json");
<<<<<<< HEAD
const BASE = process.env.BASE_URL || "https://dev.retiremate.com";
const TIMEOUT = 15000; // timeout per page
=======
const BASE_URL = process.env.BASE_URL || "https://dev.retiremate.com"; // <-- set prod later
>>>>>>> parent of 10f5567 (build issue resolved)

function outputPath(route) {
  const clean = route.split("?")[0]; // strip query
  if (clean === "/") return path.join(DIST, "index.html");
  return path.join(DIST, clean, "index.html");
}

async function main() {
  const { routes } = JSON.parse(await fs.readFile(ROUTES_FILE, "utf8"));
  const browser = await chromium.launch();
  const page = await browser.newPage();

  for (const route of routes) {
    const url = BASE_URL + route;
    console.log("Rendering:", url);

    await page.goto(url, { waitUntil: "networkidle" });
    await page.waitForTimeout(500); // allow Helmet to inject meta

    const html = await page.content();
    const file = outputPath(route);

    await fs.mkdir(path.dirname(file), { recursive: true });
    await fs.writeFile(file, html);

    console.log("Saved:", file);
  }

  await browser.close();
}

main();
