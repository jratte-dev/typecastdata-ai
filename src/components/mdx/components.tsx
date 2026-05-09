import * as React from "react";

/* -------------------------------------------------------------- *
 * Headings
 *
 * The MDX components map registers these against the default
 * `h2` / `h3` slots, so plain Markdown `## Title` and `### Title`
 * render through them without explicit JSX. Use the JSX form
 * (`<H2 id="...">...`) only when you need a stable anchor that
 * shouldn't drift if the heading copy changes — rehype-slug
 * generates an id from the text by default.
 * -------------------------------------------------------------- */

export function H2({
  id,
  children,
}: {
  id?: string;
  children: React.ReactNode;
}) {
  return (
    <h2
      id={id}
      className="
        scroll-mt-24
        font-sans font-medium tracking-[-0.012em]
        text-[28px] sm:text-[32px] leading-[1.15]
        text-[color:var(--ink)]
        mt-16 mb-2
      "
    >
      {children}
    </h2>
  );
}

export function H3({
  id,
  children,
}: {
  id?: string;
  children: React.ReactNode;
}) {
  return (
    <h3
      id={id}
      className="
        scroll-mt-24
        font-sans font-medium tracking-[-0.008em]
        text-[20px] sm:text-[22px] leading-[1.25]
        text-[color:var(--ink)]
        mt-12 mb-1
      "
    >
      {children}
    </h3>
  );
}

/* -------------------------------------------------------------- *
 * Quotes
 * -------------------------------------------------------------- */

export function PullQuote({ children }: { children: React.ReactNode }) {
  return (
    <figure className="my-12 sm:my-14">
      <div className="h-px w-full bg-[color:var(--cypress)] mb-6" />
      <blockquote
        className="
          font-sans font-medium tracking-[-0.014em]
          text-[24px] sm:text-[28px] leading-[1.2]
          text-[color:var(--ink)]
          max-w-[40ch]
        "
      >
        {children}
      </blockquote>
      <div className="h-px w-full bg-[color:var(--cypress)] mt-6" />
    </figure>
  );
}

export function BlockQuote({ children }: { children: React.ReactNode }) {
  return (
    <blockquote className="my-8 pl-6 border-l border-[color:var(--cypress)] text-[color:var(--ink-muted)]">
      <p className="text-[18px] sm:text-[19px] leading-[1.6] m-0">{children}</p>
    </blockquote>
  );
}

/* -------------------------------------------------------------- *
 * Footnotes
 *
 * `<FootnoteRef n={1} />` inline in the body, `<Footnotes notes={[...]} />`
 * once at the end of the article. Numbering is the article's responsibility,
 * not the component's — easier to audit, cheaper to refactor.
 * -------------------------------------------------------------- */

export function FootnoteRef({ n }: { n: number }) {
  return (
    <sup className="ml-[1px]">
      <a
        href={`#fn-${n}`}
        id={`fnref-${n}`}
        aria-label={`Footnote ${n}`}
        className="
          font-mono text-[12px]
          text-[color:var(--brick)]
          no-underline
          transition-colors duration-150
          hover:text-[color:var(--brick-deep)]
        "
      >
        [{n}]
      </a>
    </sup>
  );
}

export type FootnoteEntry = { n: number; body: React.ReactNode };

export function Footnotes({ notes }: { notes: FootnoteEntry[] }) {
  return (
    <section
      aria-labelledby="footnotes-heading"
      className="mx-auto max-w-[68ch] mt-24 pt-10 border-t border-[color:var(--hairline)]"
    >
      <h2
        id="footnotes-heading"
        className="font-mono text-[12px] uppercase tracking-[0.12em] text-[color:var(--ink-muted)] mb-5"
      >
        Notes
      </h2>
      <ol className="space-y-4">
        {notes.map(({ n, body }) => (
          <li
            key={n}
            id={`fn-${n}`}
            className="grid grid-cols-[2.5rem_1fr] gap-3"
          >
            <span className="font-mono text-[12px] text-[color:var(--brick)] tabular-nums">
              [{n}]
            </span>
            <p className="text-[16px] leading-[1.6] text-[color:var(--ink-muted)] m-0">
              {body}{" "}
              <a
                href={`#fnref-${n}`}
                aria-label={`Back to reference for footnote ${n}`}
                className="
                  font-mono text-[12px]
                  text-[color:var(--ink-muted)]
                  no-underline ml-[2px]
                  transition-colors duration-150
                  hover:text-[color:var(--brick-deep)]
                "
              >
                ↩
              </a>
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}

/* -------------------------------------------------------------- *
 * Code block (hand-tokenized, no runtime highlighter)
 *
 * Token arrays are constructed via the `c()` helper. This trades
 * Shiki's correctness for full editorial control over which tokens
 * carry weight on the page. Worth it for a publication where every
 * code sample is hand-curated.
 * -------------------------------------------------------------- */

export type Token = { k: TokenKind; t: string };
export type TokenKind = "" | "kw" | "id" | "fn" | "str" | "num" | "comment" | "decor";

export function c(k: TokenKind, t: string): Token {
  return { k, t };
}

export function CodeBlock({
  lang,
  lines,
  caption,
}: {
  lang: string;
  lines: Token[][];
  caption?: string;
}) {
  return (
    <figure className="my-10 -mx-2 sm:mx-[-3rem] lg:mx-[-7rem]">
      <div
        className="
          bg-[color:var(--paper-deep)]
          border-y border-[color:var(--hairline)]
          overflow-x-auto
        "
      >
        <div className="flex items-center justify-between px-5 sm:px-7 py-2 border-b border-[color:var(--hairline)]">
          <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-[color:var(--ink-muted)]">
            {lang}
          </span>
          <span
            aria-hidden
            className="font-mono text-[11px] tracking-[0.12em] text-[color:var(--ink-muted)] opacity-70"
          >
            {String(lines.length).padStart(2, "0")} lines
          </span>
        </div>
        <pre className="px-5 sm:px-7 py-5 m-0 font-mono text-[13.5px] sm:text-[14px] leading-[1.7]">
          {lines.map((line, i) => (
            <code key={i} className="block whitespace-pre">
              <span
                className="
                  inline-block w-7 mr-4 text-right
                  text-[color:var(--hairline)]
                  select-none
                "
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              {line.length === 0
                ? " "
                : line.map((tok, j) => (
                    <span key={j} className={tokenClass(tok.k)}>
                      {tok.t}
                    </span>
                  ))}
            </code>
          ))}
        </pre>
      </div>
      {caption ? (
        <figcaption
          className="
            mt-3 px-2 sm:px-0
            font-mono text-[12px] leading-[1.5]
            text-[color:var(--ink-muted)]
            max-w-[68ch]
          "
        >
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

function tokenClass(k: TokenKind): string {
  switch (k) {
    case "kw":
      return "text-[color:var(--ink)] font-semibold";
    case "fn":
      return "text-[color:var(--ink)]";
    case "str":
      return "text-[color:var(--ink-muted)]";
    case "num":
      return "text-[color:var(--ink-muted)]";
    case "comment":
      return "text-[color:var(--ink-muted)] opacity-80";
    case "decor":
      return "text-[color:var(--cypress-deep)] font-medium";
    case "id":
    default:
      return "text-[color:var(--ink)]";
  }
}

/* -------------------------------------------------------------- *
 * Stack diagram (hand-authored, proportional stages)
 *
 * Two stacks side by side, each a vertical column of stages whose
 * heights are proportional to milliseconds. The right column can
 * carry a horizontal cross-line marking where the left finished —
 * a legible way to argue "look how much time the right one is still
 * spending on things that aren't the model."
 * -------------------------------------------------------------- */

export type StageDatum = { name: string; ms: number };

export function StackDiagram({
  left,
  right,
  leftLabel = "Left",
  rightLabel = "Right",
  caption,
}: {
  left: StageDatum[];
  right: StageDatum[];
  leftLabel?: string;
  rightLabel?: string;
  caption?: React.ReactNode;
}) {
  const leftTotal = left.reduce((a, b) => a + b.ms, 0);
  const rightTotal = right.reduce((a, b) => a + b.ms, 0);
  const max = Math.max(leftTotal, rightTotal);
  const SCALE = 0.95;
  const colHeight = max * SCALE;
  const leftHeight = leftTotal * SCALE;

  return (
    <figure className="my-12 -mx-2 sm:mx-[-3rem] lg:mx-[-7rem]">
      <div
        className="
          bg-[color:var(--paper-deep)]
          border-y border-[color:var(--hairline)]
          px-6 sm:px-12 py-10
        "
      >
        <div className="grid grid-cols-2 gap-8 sm:gap-16 max-w-[64rem] mx-auto">
          <ProportionalStack
            label={leftLabel}
            stages={left}
            colHeight={colHeight}
            stackHeight={leftHeight}
            timing={`${leftTotal} ms`}
          />
          <ProportionalStack
            label={rightLabel}
            stages={right}
            colHeight={colHeight}
            stackHeight={colHeight}
            timing={`${rightTotal} ms`}
            crossLine={
              leftTotal < rightTotal
                ? { atPx: leftHeight, label: `${leftLabel} done` }
                : undefined
            }
          />
        </div>
      </div>
      {caption ? (
        <figcaption
          className="
            mt-3 px-2 sm:px-0
            font-mono text-[12px] leading-[1.5]
            text-[color:var(--ink-muted)]
            max-w-[68ch]
          "
        >
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

function ProportionalStack({
  label,
  stages,
  colHeight,
  stackHeight,
  timing,
  crossLine,
}: {
  label: string;
  stages: StageDatum[];
  colHeight: number;
  stackHeight: number;
  timing: string;
  crossLine?: { atPx: number; label: string };
}) {
  return (
    <div className="flex flex-col">
      <div className="flex items-baseline justify-between mb-5 pb-2 border-b border-[color:var(--hairline)]">
        <span className="font-mono text-[12px] uppercase tracking-[0.12em] text-[color:var(--ink)]">
          {label}
        </span>
        <span className="font-mono text-[12px] tracking-[0.06em] text-[color:var(--ink-muted)]">
          p50 {timing}
        </span>
      </div>
      <div className="relative" style={{ height: colHeight }}>
        <ol
          className="
            absolute inset-x-0 top-0
            flex flex-col
            border-t border-l border-[color:var(--hairline)]
            bg-[color:var(--paper)]
          "
          style={{ height: stackHeight }}
        >
          {stages.map((s) => (
            <li
              key={s.name}
              className="
                relative
                border-b border-[color:var(--hairline)]
                px-3 flex items-center justify-between
                font-mono
              "
              style={{ height: s.ms * 0.95 }}
            >
              <span className="text-[13px] text-[color:var(--ink)]">
                {s.name}
              </span>
              <span className="text-[11px] tabular-nums text-[color:var(--ink-muted)]">
                {s.ms}
              </span>
            </li>
          ))}
        </ol>
        {crossLine ? (
          <>
            <span
              aria-hidden
              className="absolute left-0 right-0 h-px bg-[color:var(--cypress)]"
              style={{ top: crossLine.atPx }}
            />
            <span
              aria-hidden
              className="
                absolute right-0
                font-mono text-[10px] uppercase tracking-[0.12em]
                text-[color:var(--cypress-deep)]
                bg-[color:var(--paper-deep)] px-2
              "
              style={{ top: crossLine.atPx - 7 }}
            >
              {crossLine.label}
            </span>
          </>
        ) : null}
      </div>
    </div>
  );
}
