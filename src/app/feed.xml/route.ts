import { POSTS } from "../posts";

const SITE = "https://typecastdata.ai";
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
  // RSS only carries posts that actually exist. Stubs (href === "#") are
  // hidden until real article routes ship.
  const live = POSTS.filter((p) => p.href !== "#");
  const lastBuild = live.length
    ? new Date(live[0].isoDate).toUTCString()
    : new Date().toUTCString();

  const items = live
    .map((p) => {
      const link = `${SITE}${p.href}`;
      return `    <item>
      <title>${escape(p.title)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <pubDate>${new Date(p.isoDate).toUTCString()}</pubDate>
      <description>${escape(p.title)}</description>
      <category>${escape(p.topic)}</category>
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
