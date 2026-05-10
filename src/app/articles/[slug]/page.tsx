import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArticleHeader } from "../../article/ArticleHeader";
import { SubscribeBlock } from "../../article/SubscribeBlock";
import { SiteFooter } from "../../SiteFooter";
import {
  getAllArticles,
  getArticleBySlug,
  formatDate,
  type Article,
} from "@/lib/content/articles";
import { topicMeta } from "@/lib/content/topics";

type RouteParams = { slug: string };

export async function generateStaticParams(): Promise<RouteParams[]> {
  return getAllArticles().map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<RouteParams>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return {};
  return {
    title: article.title,
    description: article.description,
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();

  let MDXContent: React.ComponentType;
  try {
    const mod = await import(`../../../../content/articles/${slug}.mdx`);
    MDXContent = mod.default;
  } catch {
    notFound();
  }

  const all = getAllArticles();
  const idx = all.findIndex((a) => a.slug === article.slug);
  const newer = idx > 0 ? all[idx - 1] : null;
  const older = idx >= 0 && idx < all.length - 1 ? all[idx + 1] : null;
  const related = resolveRelated(article, all);

  return (
    <div className="bg-[color:var(--paper)] text-[color:var(--ink)]">
      <ArticleHeader />

      <main id="main" className="px-6 sm:px-10 pt-14 sm:pt-24 pb-24">
        <article>
          <PostHead article={article} />
          {article.sections && article.sections.length > 0 ? (
            <SectionsToc sections={article.sections} />
          ) : null}
          <div className="mx-auto max-w-[68ch] prose-typecast space-y-7 text-[18px] sm:text-[19px] leading-[1.65] text-[color:var(--ink)]">
            <MDXContent />
          </div>
        </article>

        <div className="mx-auto max-w-[68ch] mt-24 space-y-16">
          <SubscribeBlock />
          {(newer || older) && <PrevNext newer={newer} older={older} />}
          {related.length > 0 && <RelatedPosts items={related} />}
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}

/* -------------------------------------------------------------- *
 * Post head — title, dek, topic, date
 * -------------------------------------------------------------- */

function PostHead({ article }: { article: Article }) {
  const topic = topicMeta(article.topic);
  return (
    <header className="mx-auto max-w-[68ch]">
      <div className="font-mono text-[12px] uppercase tracking-[0.12em] text-[color:var(--ink-muted)] flex items-center gap-3 mb-8">
        <span className="text-[color:var(--ink)]">{topic.label}</span>
        <span aria-hidden className="text-[color:var(--cypress)]">
          /
        </span>
        <time dateTime={article.date}>{formatDate(article.date)}</time>
      </div>

      <h1
        className="
          font-sans font-medium tracking-[-0.022em]
          text-[color:var(--ink)]
          leading-[1.04]
          text-[clamp(2.25rem,5.5vw,4rem)]
          max-w-[22ch]
        "
      >
        {article.title}
      </h1>

      <p
        className="
          mt-8 max-w-[58ch]
          text-[19px] sm:text-[20px] leading-[1.5]
          text-[color:var(--ink-muted)]
          font-normal
        "
      >
        {article.description}
      </p>

      <div className="mt-12 mb-10 h-px bg-[color:var(--hairline)] w-full" />
    </header>
  );
}

/* -------------------------------------------------------------- *
 * Sections TOC — derived from frontmatter `sections`
 * -------------------------------------------------------------- */

function SectionsToc({
  sections,
}: {
  sections: { id: string; label: string }[];
}) {
  return (
    <nav
      aria-label="Sections in this article"
      className="mx-auto max-w-[68ch] mb-12"
    >
      <h2 className="font-mono text-[11px] uppercase tracking-[0.12em] text-[color:var(--ink-muted)] mb-3">
        In this post
      </h2>
      <ol className="flex flex-col border-b border-[color:var(--hairline)]">
        {sections.map((s, i) => (
          <li
            key={s.id}
            className="border-t border-[color:var(--hairline)]"
          >
            <a
              href={`#${s.id}`}
              className="
                grid grid-cols-[2.25rem_1fr] gap-3 items-baseline
                py-2.5
                text-[15px] text-[color:var(--ink)]
                transition-colors duration-150
                hover:text-[color:var(--brick-deep)]
              "
            >
              <span className="font-mono text-[11px] tabular-nums text-[color:var(--ink-muted)]">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span>{s.label}</span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

/* -------------------------------------------------------------- *
 * Prev / Next — adjacent in date order
 * -------------------------------------------------------------- */

function PrevNext({
  newer,
  older,
}: {
  newer: Article | null;
  older: Article | null;
}) {
  const items: { dir: "prev" | "next"; article: Article | null }[] = [
    { dir: "prev", article: older },
    { dir: "next", article: newer },
  ];
  return (
    <nav
      aria-label="Adjacent posts"
      className="grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-10 border-t border-[color:var(--hairline)] pt-10"
    >
      {items.map((it) => {
        const align = it.dir === "next" ? "sm:text-right" : "";
        const labelCls =
          "font-mono text-[11px] uppercase tracking-[0.12em] text-[color:var(--ink-muted)]";
        const titleCls =
          "text-[19px] leading-[1.3] transition-colors duration-150 text-[color:var(--ink)] group-hover:text-[color:var(--brick-deep)]";
        const wrapperCls = [
          "group flex flex-col gap-2 transition-colors duration-150",
          align,
        ].join(" ");
        if (!it.article) {
          return (
            <span
              key={it.dir}
              aria-hidden
              className={wrapperCls}
            />
          );
        }
        return (
          <Link
            key={it.dir}
            href={it.article.href}
            className={wrapperCls}
          >
            <span className={labelCls}>
              {it.dir === "prev" ? "← Previous" : "Next →"}
            </span>
            <span className={titleCls}>{it.article.title}</span>
          </Link>
        );
      })}
    </nav>
  );
}

/* -------------------------------------------------------------- *
 * Related posts — explicit `related` slugs, falls back to topic
 * -------------------------------------------------------------- */

function resolveRelated(article: Article, all: Article[]): Article[] {
  if (article.related && article.related.length > 0) {
    return article.related
      .map((slug) => all.find((a) => a.slug === slug))
      .filter((a): a is Article => a !== undefined);
  }
  return all
    .filter((a) => a.topic === article.topic && a.slug !== article.slug)
    .slice(0, 3);
}

function RelatedPosts({ items }: { items: Article[] }) {
  return (
    <section
      aria-labelledby="related-heading"
      className="border-t border-[color:var(--hairline)] pt-10"
    >
      <h2
        id="related-heading"
        className="font-mono text-[12px] uppercase tracking-[0.12em] text-[color:var(--ink-muted)] mb-5"
      >
        Also worth reading
      </h2>
      <ul className="divide-y divide-[color:var(--hairline)]">
        {items.map((it) => (
          <li key={it.slug}>
            <Link
              href={it.href}
              className="
                grid grid-cols-[1fr_auto] gap-6 items-baseline
                py-4 group
              "
            >
              <span className="text-[17px] leading-[1.4] text-[color:var(--ink)] group-hover:text-[color:var(--brick-deep)] transition-colors duration-150">
                {it.title}
              </span>
              <time
                dateTime={it.date}
                className="font-mono text-[12px] text-[color:var(--ink-muted)] whitespace-nowrap"
              >
                {formatDate(it.date)}
              </time>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
