import { getAllArticles } from "@/lib/content/articles";

const SITE =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");
const TITLE = "Typecast Data AI";
const DESCRIPTION =
  "John Ratté on data engineering, AI, and the gap between what gets shipped and what gets shipped well.";
const AUTHOR = "John Ratté";

function escape(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function GET() {
  const articles = getAllArticles();
  const lastBuild = articles.length
    ? new Date(articles[0].date).toUTCString()
    : new Date().toUTCString();

  const items = articles
    .map((a) => {
      const link = `${SITE}${a.href}`;
      return `    <item>
      <title>${escape(a.title)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <pubDate>${new Date(a.date).toUTCString()}</pubDate>
      <description>${escape(a.description)}</description>
      <category>${escape(a.topic)}</category>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escape(TITLE)}</title>
    <link>${SITE}</link>
    <description>${escape(DESCRIPTION)}</description>
    <language>en-US</language>
    <managingEditor>noreply@typecastdata.ai (${escape(AUTHOR)})</managingEditor>
    <lastBuildDate>${lastBuild}</lastBuildDate>
    <atom:link href="${SITE}/feed.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=300, s-maxage=3600",
    },
  });
}
