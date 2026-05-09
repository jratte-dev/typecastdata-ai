import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { isTopic, type Topic } from "./topics";
import type { Article, ArticleSection } from "./types";

/**
 * Server-only content reader. Consumes `content/articles/<slug>.mdx` files
 * at build time, validates frontmatter, filters drafts, sorts by date desc.
 *
 * The Article and ArticleSection types live in ./types so client components
 * can import them without pulling Node's fs module into the client bundle.
 * Use formatDate from ./format for display formatting.
 */

const CONTENT_DIR = path.join(process.cwd(), "content", "articles");

let _cache: Article[] | null = null;

export function getAllArticles(): Article[] {
  if (_cache !== null) return _cache;

  if (!fs.existsSync(CONTENT_DIR)) {
    _cache = [];
    return _cache;
  }

  const files = fs
    .readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith(".mdx"));

  const articles: Article[] = [];
  for (const file of files) {
    const fullPath = path.join(CONTENT_DIR, file);
    const raw = fs.readFileSync(fullPath, "utf8");
    const { data } = matter(raw);
    const expectedSlug = file.replace(/\.mdx$/, "");
    articles.push(parseFrontmatter(data, expectedSlug, file));
  }

  const live = articles
    .filter((a) => !a.draft)
    .sort((a, b) => b.date.localeCompare(a.date));

  _cache = live;
  return live;
}

export function getArticleBySlug(slug: string): Article | null {
  return getAllArticles().find((a) => a.slug === slug) ?? null;
}

export function getArticlesByTopic(topic: Topic, limit?: number): Article[] {
  const list = getAllArticles().filter((a) => a.topic === topic);
  return typeof limit === "number" ? list.slice(0, limit) : list;
}

export function getArticleSlugs(): string[] {
  return getAllArticles().map((a) => a.slug);
}

/* -------------------------------------------------------------- *
 * Re-exports so server consumers can keep using a single import.
 * -------------------------------------------------------------- */

export type { Article, ArticleSection } from "./types";
export { formatDate } from "./format";

/* -------------------------------------------------------------- *
 * Frontmatter parsing
 * -------------------------------------------------------------- */

function parseFrontmatter(
  data: Record<string, unknown>,
  expectedSlug: string,
  file: string
): Article {
  const ctx = `content/articles/${file}`;

  const title = requireString(data.title, "title", ctx);
  const slug = requireString(data.slug, "slug", ctx);
  const description = requireString(data.description, "description", ctx);
  const topic = requireString(data.topic, "topic", ctx);
  const date = requireString(data.date, "date", ctx);

  if (slug !== expectedSlug) {
    throw new Error(
      `${ctx}: frontmatter slug "${slug}" does not match filename slug "${expectedSlug}". ` +
        `Rename the file to "${slug}.mdx" or update the frontmatter slug to match.`
    );
  }
  if (!isTopic(topic)) {
    throw new Error(
      `${ctx}: frontmatter topic "${topic}" is not a recognized topic. ` +
        `Edit src/lib/content/topics.ts if this should be valid.`
    );
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new Error(
      `${ctx}: frontmatter date "${date}" must be ISO format (YYYY-MM-DD).`
    );
  }

  const draft = data.draft === true;
  const sections = parseSections(data.sections, ctx);
  const related = parseStringArray(data.related, "related", ctx);

  return {
    slug,
    title,
    description,
    topic,
    date,
    href: `/articles/${slug}`,
    draft,
    sections,
    related,
  };
}

function requireString(value: unknown, field: string, ctx: string): string {
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(
      `${ctx}: frontmatter field "${field}" is required and must be a non-empty string.`
    );
  }
  return value.trim();
}

function parseSections(
  value: unknown,
  ctx: string
): ArticleSection[] | undefined {
  if (value === undefined || value === null) return undefined;
  if (!Array.isArray(value)) {
    throw new Error(`${ctx}: frontmatter "sections" must be an array.`);
  }
  return value.map((item, i) => {
    if (typeof item !== "object" || item === null) {
      throw new Error(
        `${ctx}: sections[${i}] must be an object with id and label.`
      );
    }
    const obj = item as Record<string, unknown>;
    return {
      id: requireString(obj.id, `sections[${i}].id`, ctx),
      label: requireString(obj.label, `sections[${i}].label`, ctx),
    };
  });
}

function parseStringArray(
  value: unknown,
  field: string,
  ctx: string
): string[] | undefined {
  if (value === undefined || value === null) return undefined;
  if (!Array.isArray(value)) {
    throw new Error(`${ctx}: frontmatter "${field}" must be an array of strings.`);
  }
  return value.map((v, i) => {
    if (typeof v !== "string") {
      throw new Error(`${ctx}: ${field}[${i}] must be a string.`);
    }
    return v;
  });
}
