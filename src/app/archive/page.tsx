import type { Metadata } from "next";
import { BrickNav } from "../BrickNav";
import { SiteFooter } from "../SiteFooter";
import { ArchiveControls } from "./ArchiveControls";
import { getAllArticles } from "@/lib/content/articles";

export const metadata: Metadata = {
  title: "Archive · Typecast Data AI",
  description:
    "Everything John Ratté has published on typecastdata.ai. Reverse chronological. Filterable.",
};

export default function ArchivePage() {
  const articles = getAllArticles();
  return (
    <div className="bg-[color:var(--paper)] text-[color:var(--ink)]">
      <ArchiveMasthead />

      <main id="main">
        <ArchiveControls articles={articles} />
      </main>

      <SiteFooter />
    </div>
  );
}

/* -------------------------------------------------------------- *
 * Smaller brick masthead, cohesive with homepage
 * -------------------------------------------------------------- */

function ArchiveMasthead() {
  return (
    <section
      aria-label="Archive masthead"
      className="bg-[color:var(--brick-band)] text-[color:var(--paper-on-brick)]"
    >
      <BrickNav rubric="The publication of John Ratté" />

      <div className="mx-auto max-w-[88rem] px-6 sm:px-10 pt-10 pb-12 sm:pt-16 sm:pb-16">
        <div
          className="
            font-mono text-[15px] sm:text-[18px] tracking-tight
            text-[color:var(--paper-on-brick)]
            inline-flex items-baseline gap-[2px]
            mb-8 sm:mb-10
          "
        >
          <span>typecast</span>
          <span aria-hidden className="text-[color:var(--paper-on-brick-muted)]">.</span>
        </div>

        <h1
          className="
            font-sans font-semibold tracking-[-0.02em]
            text-[color:var(--paper-on-brick)]
            leading-[1.05]
            text-[clamp(2rem,4.5vw,3.25rem)]
          "
        >
          Archive
        </h1>

        <p
          className="
            mt-4 max-w-[58ch]
            text-[17px] sm:text-[18px] leading-[1.5]
            text-[color:var(--paper-on-brick)]
          "
        >
          Everything I have published. Reverse chronological. Filterable. The
          site does not pretend to be more than it is.
        </p>

        <div
          aria-hidden
          className="mt-8 h-px bg-[color:var(--hairline-on-brick)] max-w-[44rem]"
        />

        <div
          className="
            mt-4
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
    </section>
  );
}
