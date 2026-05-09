import type { Metadata } from "next";
import Link from "next/link";
import { BrickNav } from "./BrickNav";
import { SiteFooter } from "./SiteFooter";
import {
  getAllArticles,
  getArticlesByTopic,
  formatDate,
  type Article,
} from "@/lib/content/articles";
import { TOPICS } from "@/lib/content/topics";

export const metadata: Metadata = {
  title: "Typecast Data AI — John Ratté",
  description:
    "Data engineering, AI, and the gap between what gets shipped and what gets shipped well. By John Ratté, in New Orleans.",
};

export default function HomePage() {
  const all = getAllArticles();
  const latest = all[0] ?? null;

  return (
    <div className="bg-[color:var(--paper)] text-[color:var(--ink)]">
      <Masthead latest={latest} />

      <main id="main">
        <BioStrip />
        <TopicClusters />
        <ArchiveLink />
      </main>

      <SiteFooter />
    </div>
  );
}

/* -------------------------------------------------------------- *
 * Masthead — drenched Quarter Brick band, identity-first
 * -------------------------------------------------------------- */

function Masthead({ latest }: { latest: Article | null }) {
  return (
    <section
      aria-label="Masthead"
      className="relative bg-[color:var(--brick-band)] text-[color:var(--paper-on-brick)]"
    >
      <BrickNav rubric="The publication of John Ratté" />

      <div className="px-6 sm:px-10 pt-10 pb-20 sm:pt-20 sm:pb-28 max-w-[88rem] mx-auto">
        <div
          className="
            font-mono text-[15px] sm:text-[18px] tracking-tight
            text-[color:var(--paper-on-brick)]
            inline-flex items-baseline gap-[2px]
            mb-10 sm:mb-14
          "
        >
          <span>typecast</span>
          <span aria-hidden className="text-[color:var(--paper-on-brick-muted)]">.</span>
        </div>

        <div className="grid gap-12 lg:grid-cols-[1fr_auto] lg:gap-20 items-end">
          <div>
            <h1
              className="
                font-sans font-semibold tracking-[-0.022em]
                text-[color:var(--paper-on-brick)]
                leading-[1.04]
                text-[clamp(2.25rem,6vw,4.5rem)]
                max-w-[22ch]
              "
            >
              Data&<br />
              AI&<br />
              Analytics&<br />
              Can this export to Excel?
            </h1>

            <div
              aria-hidden
              className="mt-10 h-px bg-[color:var(--hairline-on-brick)] max-w-[44rem]"
            />

            <div
              className="
                mt-5
                font-mono text-[11px] sm:text-[12px] uppercase
                tracking-[0.16em]
                text-[color:var(--paper-on-brick-muted)]
                flex flex-wrap items-baseline gap-x-4 gap-y-1
              "
            >
              <span>№ 24</span>
              <span aria-hidden className="text-[color:var(--paper-on-brick-dim)]">·</span>
              <span>2026</span>
              <span aria-hidden className="text-[color:var(--paper-on-brick-dim)]">·</span>
              <span>New Orleans</span>
              <span aria-hidden className="text-[color:var(--paper-on-brick-dim)]">·</span>
              <span>by J.R.</span>
            </div>
          </div>

          {latest ? <LatestTeaser article={latest} /> : null}
        </div>
      </div>
    </section>
  );
}

function LatestTeaser({ article }: { article: Article }) {
  return (
    <aside
      aria-label="Latest post"
      className="lg:max-w-[28ch] lg:text-right lg:justify-self-end"
    >
      <div
        className="
          font-mono text-[11px] uppercase tracking-[0.16em]
          text-[color:var(--paper-on-brick-muted)]
          mb-3
        "
      >
        Latest
      </div>
      <p className="text-[17px] sm:text-[18px] leading-[1.45] text-[color:var(--paper-on-brick)]">
        {article.description}
      </p>
      <div className="mt-4 lg:flex lg:justify-end">
        <CtaLink href={article.href} tone="brick">
          Read it
        </CtaLink>
      </div>
    </aside>
  );
}

/* -------------------------------------------------------------- *
 * CtaLink — the single CTA primitive.
 * -------------------------------------------------------------- */

function CtaLink({
  href,
  tone = "ink",
  children,
}: {
  href: string;
  tone?: "ink" | "brick";
  children: React.ReactNode;
}) {
  const cls =
    tone === "brick"
      ? "text-[color:var(--paper-on-brick)] decoration-[color:var(--hairline-on-brick)] hover:decoration-[color:var(--paper-on-brick)] hover:[text-decoration-thickness:2px]"
      : "text-[color:var(--ink)] decoration-[color:var(--hairline)] hover:text-[color:var(--brick-deep)] hover:decoration-[color:var(--brick)] hover:[text-decoration-thickness:2px]";
  return (
    <Link
      href={href}
      className={[
        "inline-flex items-center gap-2",
        "font-mono text-[12px] uppercase tracking-[0.12em]",
        "underline decoration-1 underline-offset-[5px]",
        "transition-[color,text-decoration-color,text-decoration-thickness] duration-150",
        cls,
      ].join(" ")}
    >
      <span>{children}</span>
      <span aria-hidden>→</span>
    </Link>
  );
}

/* -------------------------------------------------------------- *
 * Bio strip — quietly factual, photo placeholder until supplied
 * -------------------------------------------------------------- */

function BioStrip() {
  return (
    <section
      aria-labelledby="bio-heading"
      className="px-6 sm:px-10 max-w-[88rem] mx-auto pt-20 sm:pt-28 pb-16 sm:pb-24"
    >
      <h2
        id="bio-heading"
        className="font-mono text-[12px] uppercase tracking-[0.16em] text-[color:var(--ink-muted)] mb-8"
      >
        Who
      </h2>

      <div className="space-y-6 text-[18px] sm:text-[19px] leading-[1.6] max-w-[60ch]">
        <p>
          John has spent the last 20 years building data and analytics
          solutions, including some of the most elaborate data
          visualizations ever exported to Excel. With a new focus on
          AI-centric development to deliver a wider range of custom
          solutions, he currently resides and works in New Orleans
          continuing his search for truth, happiness, and a po-boy
          restaurant that is open on Mondays.
        </p>
        <figure className="relative my-10 pl-10 sm:pl-14">
          <span
            aria-hidden
            className="absolute left-0 top-[-0.35em] text-[5rem] sm:text-[6rem] leading-none italic text-[color:var(--ink-muted)] select-none"
          >
            &ldquo;
          </span>
          <blockquote className="font-serif italic text-[24px] sm:text-[28px] leading-[1.35] text-[color:var(--ink)]">
            It&rsquo;s like a podcast you can read!
          </blockquote>
          <figcaption className="mt-4 font-mono text-[11px] uppercase tracking-[0.18em] text-[color:var(--ink-muted)]">
            Overheard, coffee shop in the Marigny, 2025
          </figcaption>
        </figure>
        <p>
          <CtaLink href="/about">Read the about</CtaLink>
        </p>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------- *
 * Topic clusters — four doors into the writing
 * -------------------------------------------------------------- */

function TopicClusters() {
  return (
    <section
      aria-labelledby="topics-heading"
      className="px-6 sm:px-10 max-w-[88rem] mx-auto pb-20 sm:pb-28 border-t border-[color:var(--hairline)] pt-16 sm:pt-24"
    >
      <h2
        id="topics-heading"
        className="font-mono text-[12px] uppercase tracking-[0.16em] text-[color:var(--ink-muted)] mb-12"
      >
        What
      </h2>

      <div className="grid gap-x-16 gap-y-16 lg:grid-cols-2">
        {TOPICS.map((meta) => (
          <ClusterPanel
            key={meta.id}
            name={meta.name}
            dek={meta.dek}
            articles={getArticlesByTopic(meta.id, 3)}
          />
        ))}
      </div>
    </section>
  );
}

function ClusterPanel({
  name,
  dek,
  articles,
}: {
  name: string;
  dek: string;
  articles: Article[];
}) {
  return (
    <div>
      <h3
        className="
          font-sans font-medium tracking-[-0.012em]
          text-[26px] sm:text-[28px] leading-[1.15]
          text-[color:var(--ink)]
        "
      >
        {name}
      </h3>
      <p className="mt-2 text-[16px] sm:text-[17px] leading-[1.5] text-[color:var(--ink-muted)] max-w-[52ch]">
        {dek}
      </p>

      {articles.length === 0 ? (
        <p className="mt-6 pt-4 border-t border-[color:var(--hairline)] text-[14px] text-[color:var(--ink-muted)] italic">
          Nothing published in this topic yet.
        </p>
      ) : (
        <ul className="mt-6 divide-y divide-[color:var(--hairline)] border-t border-[color:var(--hairline)]">
          {articles.map((article) => (
            <li key={article.slug}>
              <Link
                href={article.href}
                className="grid grid-cols-[1fr_auto] gap-6 items-baseline py-4 group transition-colors duration-150"
              >
                <span className="text-[17px] leading-[1.4] transition-colors duration-150 text-[color:var(--ink)] group-hover:text-[color:var(--brick-deep)]">
                  {article.title}
                </span>
                <time
                  dateTime={article.date}
                  className="font-mono text-[12px] whitespace-nowrap text-[color:var(--ink-muted)]"
                >
                  {formatDate(article.date)}
                </time>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* -------------------------------------------------------------- *
 * Archive link — quiet end-of-page CTA
 * -------------------------------------------------------------- */

function ArchiveLink() {
  return (
    <section
      id="archive"
      aria-label="Archive"
      className="border-t border-[color:var(--hairline)]"
    >
      <Link
        href="/archive"
        className="
          group
          mx-auto max-w-[88rem] px-6 sm:px-10 py-10
          font-mono text-[14px] sm:text-[15px] uppercase tracking-[0.12em]
          text-[color:var(--ink)]
          flex items-center justify-between
          transition-colors duration-150
          hover:text-[color:var(--brick-deep)]
        "
      >
        <span className="underline decoration-[color:var(--hairline)] decoration-1 underline-offset-[6px] group-hover:decoration-[color:var(--brick)] group-hover:[text-decoration-thickness:2px] transition-[text-decoration-color,text-decoration-thickness] duration-150">
          Read the archive
        </span>
        <span
          aria-hidden
          className="transition-transform duration-200 group-hover:translate-x-1"
          style={{ transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)" }}
        >
          →
        </span>
      </Link>
    </section>
  );
}
