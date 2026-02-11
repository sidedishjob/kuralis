export async function GET() {
  const baseUrl = "https://kuralis.homes";
  const staticPaths = ["/", "/about", "/contact", "/privacy", "/terms"];

  const urls = staticPaths
    .map((path) => {
      return `<url><loc>${baseUrl}${path}</loc><lastmod>${new Date().toISOString()}</lastmod></url>`;
    })
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
