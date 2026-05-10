import type { Metadata } from "next";
import { BrickNav } from "../BrickNav";
import { SiteFooter } from "../SiteFooter";

export const metadata: Metadata = {
  title: "About",
  description:
    "John Ratté: senior data engineer, twenty years in, currently in New Orleans, writing here because the explanations on the internet are worse.",
};

export default function AboutPage() {
  return (
    <div className="bg-[color:var(--paper)] text-[color:var(--ink)]">
      <AboutMasthead />

      <main id="main">
        <Body />
      </main>

      <SiteFooter />
    </div>
  );
}

/* -------------------------------------------------------------- *
 * Brick masthead
 * -------------------------------------------------------------- */

function AboutMasthead() {
  return (
    <section
      aria-label="About masthead"
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
          About
        </h1>

        <p
          className="
            mt-4 max-w-[60ch]
            text-[17px] sm:text-[18px] leading-[1.5]
            text-[color:var(--paper-on-brick)]
          "
        >
          Senior data engineer. Twenty years in. Currently in New Orleans,
          writing here because the explanations on the internet are worse.
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

/* -------------------------------------------------------------- *
 * Body
 * -------------------------------------------------------------- */

function Body() {
  return (
    <div className="px-6 sm:px-10 max-w-[88rem] mx-auto pt-16 sm:pt-24 pb-24">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,68ch)_320px] lg:gap-20 items-start">
        <div className="space-y-12">
          <Bio />
          <Section label="Now">
            <p>
              Currently freelancing on a handful of AI infra projects.
              Currently in New Orleans, where the air is heavier than the
              work and the food is the only thing that takes itself
              seriously. Currently annoyed at retrieval, at agent
              frameworks, and at most claims about latency that arrive
              without numbers attached.
            </p>
          </Section>

          <Section label="Background">
            <p>
              Started in Postgres, moved to warehouses around the time
              warehouses started being interesting again. Has shipped
              pipelines for healthcare, advertising, gaming, and one company
              that did not survive its own data. Has watched at least three{" "}
              <em className="not-italic font-medium text-[color:var(--ink)]">
                next-generation
              </em>{" "}
              platforms become tech debt. Has a working theory about why.
            </p>
          </Section>

          <Section label="Writing">
            <p>
              This site is where I write about it. Mostly to clear my head,
              occasionally to win an argument, never to please an algorithm.
              New posts go out by RSS or by email, when there is something
              worth writing, which is not often, which is fine. No upsells,
              no cadence promises.
            </p>
          </Section>

          <Section label="Elsewhere">
            <ContactList />
          </Section>
        </div>

        <PhotoPlaceholder />
      </div>
    </div>
  );
}

function Bio() {
  return (
    <div className="space-y-5 text-[18px] sm:text-[19px] leading-[1.65] text-[color:var(--ink)]">
      <p>
        John Ratté has spent twenty years building data systems for
        companies that mostly did not deserve them. He is now in New
        Orleans, working on AI-shaped problems for clients who would rather
        not have AI-shaped problems.
      </p>
      <p className="text-[color:var(--ink-muted)]">
        Available for the kind of consulting that involves writing things
        down before doing them, and for talking honestly about whether AI
        is the right answer to your particular question. (It usually is
        not.)
      </p>
    </div>
  );
}

function Section({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <section aria-label={label} className="border-t border-[color:var(--hairline)] pt-8">
      <h2 className="font-mono text-[12px] uppercase tracking-[0.16em] text-[color:var(--ink-muted)] mb-4">
        {label}
      </h2>
      <div className="text-[17px] sm:text-[18px] leading-[1.6] text-[color:var(--ink)]">
        {children}
      </div>
    </section>
  );
}

/* -------------------------------------------------------------- *
 * Contact list (hairline-divided rows)
 *
 * Email is real. GitHub / LinkedIn / Bluesky / Mastodon URLs are
 * placeholders for John to fill in.
 * -------------------------------------------------------------- */

function ContactList() {
  const rows: { label: string; value: string; href: string; muted?: boolean }[] = [
    { label: "Email", value: "jratte@gmail.com", href: "mailto:jratte@gmail.com" },
    { label: "GitHub", value: "github.com/jratte", href: "https://github.com/jratte" },
    { label: "LinkedIn", value: "linkedin.com/in/john-ratte", href: "#", muted: true },
    { label: "Bluesky", value: "(swap with handle)", href: "#", muted: true },
  ];
  return (
    <ul className="divide-y divide-[color:var(--hairline)] border-t border-[color:var(--hairline)]">
      {rows.map((row) => {
        const labelCls =
          "font-mono text-[11px] uppercase tracking-[0.16em] text-[color:var(--ink-muted)]";
        const wrapperCls =
          "grid grid-cols-[8rem_1fr] gap-6 items-baseline py-4 group transition-colors duration-150";
        const valueCls = [
          "text-[16px] sm:text-[17px] leading-[1.4]",
          row.muted
            ? "text-[color:var(--ink-muted)] opacity-70"
            : "text-[color:var(--ink)] group-hover:text-[color:var(--brick-deep)]",
          "transition-colors duration-150",
        ].join(" ");
        return (
          <li key={row.label}>
            {row.muted ? (
              <span aria-disabled="true" className={`${wrapperCls} cursor-not-allowed`}>
                <span className={labelCls}>{row.label}</span>
                <span className={valueCls}>{row.value}</span>
              </span>
            ) : (
              <a
                href={row.href}
                target={row.href.startsWith("http") ? "_blank" : undefined}
                rel={row.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className={wrapperCls}
              >
                <span className={labelCls}>{row.label}</span>
                <span className={valueCls}>{row.value}</span>
              </a>
            )}
          </li>
        );
      })}
    </ul>
  );
}

/* -------------------------------------------------------------- *
 * Photo placeholder
 *
 * Swap to a real image at /public/about-1.jpg (NOT a headshot;
 * hands at keyboard, NOLA interior, notebook, workshop scene).
 * -------------------------------------------------------------- */

function PhotoPlaceholder() {
  return (
    <figure
      aria-hidden
      className="bg-[color:var(--paper-deep)] border border-[color:var(--hairline)] aspect-[320/420] w-full lg:w-[320px] flex items-center justify-center"
    >
      <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-[color:var(--ink-muted)] text-center px-6 leading-[1.5]">
        [ photo placeholder
        <br />
        swap to /public/about-1.jpg ]
      </span>
    </figure>
  );
}
