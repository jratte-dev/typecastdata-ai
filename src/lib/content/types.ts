import type { Topic } from "./topics";

/**
 * Article shape, sourced from `content/articles/<slug>.mdx` frontmatter.
 *
 * Lives in its own file (separate from the fs-bound reader in articles.ts)
 * so that client components can import the type without dragging Node's
 * `fs` module into the client bundle.
 */
export type Article = {
  slug: string;
  title: string;
  description: string;
  topic: Topic;
  date: string; // ISO YYYY-MM-DD
  href: string; // /articles/<slug>
  draft: boolean;
  sections?: ArticleSection[];
  related?: string[];
};

export type ArticleSection = {
  id: string;
  label: string;
};
