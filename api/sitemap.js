export default async function handler(req, res) {
  const base = "https://retiremate.com";

  const staticRoutes = [
    "/",
    "/intro"
  ];

  const urls = staticRoutes
    .map((path) => `<url><loc>${base}${path}</loc></url>`)
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls}
  </urlset>`;

  res.setHeader("Content-Type", "application/xml");
  res.status(200).send(xml);
}
