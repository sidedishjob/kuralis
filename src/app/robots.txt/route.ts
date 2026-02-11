export function GET() {
  return new Response(
    `User-agent: *
Allow: /
Sitemap: https://kuralis.homes/sitemap.xml
`,
    {
      headers: {
        "Content-Type": "text/plain",
      },
    },
  );
}
