import type { Metadata } from "next";
import { ArticleHeader } from "./ArticleHeader";
import { SubscribeBlock } from "./SubscribeBlock";
import { SiteFooter } from "../SiteFooter";

export const metadata: Metadata = {
  title:
    "Your warehouse is faster than your model serving · Typecast Data AI",
  description:
    "An honest accounting of the cheapest part of your stack outperforming the most expensive one, and what to do about it before someone asks.",
};

export default function ArticlePage() {
  return (
    <div className="bg-[color:var(--paper)] text-[color:var(--ink)]">
      <ArticleHeader />

      <main id="main" className="px-6 sm:px-10 pt-14 sm:pt-24 pb-24">
        <article>
          <PostHead />
          <SectionsToc />
          <PostBody />
          <Footnotes />
        </article>

        <div className="mx-auto max-w-[68ch] mt-24 space-y-16">
          <SubscribeBlock />
          <PrevNext />
          <RelatedPosts />
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}

/* -------------------------------------------------------------- *
 * Post head
 * -------------------------------------------------------------- */

function PostHead() {
  return (
    <header className="mx-auto max-w-[68ch]">
      <div className="font-mono text-[12px] uppercase tracking-[0.12em] text-[color:var(--ink-muted)] flex items-center gap-3 mb-8">
        <span className="text-[color:var(--ink)]">data engineering</span>
        <span aria-hidden className="text-[color:var(--cypress)]">/</span>
        <time dateTime="2026-05-04">May 4, 2026</time>
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
        Your warehouse is faster than your model serving, and that should
        embarrass you.
      </h1>

      <p
        className="
          mt-8 max-w-[58ch]
          text-[19px] sm:text-[20px] leading-[1.5]
          text-[color:var(--ink-muted)]
          font-normal
        "
      >
        An honest accounting of the cheapest part of your stack outperforming
        the most expensive one, and what to do about it before someone asks.
      </p>

      <div className="mt-12 mb-10 h-px bg-[color:var(--hairline)] w-full" />
    </header>
  );
}

/* -------------------------------------------------------------- *
 * Inline sections nav (compact TOC, top of article)
 * -------------------------------------------------------------- */

function SectionsToc() {
  const sections = [
    { id: "benchmark", label: "The benchmark nobody runs" },
    { id: "shape", label: "The shape of the gap" },
    { id: "what-to-do", label: "What to actually do" },
  ];
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
          <li key={s.id} className="border-t border-[color:var(--hairline)]">
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
 * Post body
 * -------------------------------------------------------------- */

function PostBody() {
  return (
    <div className="mx-auto max-w-[68ch] prose-typecast space-y-7 text-[18px] sm:text-[19px] leading-[1.65] text-[color:var(--ink)]">
      <p>
        There is a benchmark almost nobody at your company runs, and almost
        everybody is wrong about. Pick a non-trivial query, the kind that
        would have melted a 2014 data warehouse: a window function over six
        months of events, joined to a dimension table, grouped, ordered. Run
        it on Snowflake or BigQuery or Databricks SQL. Now pick a single
        inference call against your fancy LLM-powered classifier. Time both,
        end to end, and compare.
      </p>

      <p>
        In every production stack I have looked at in the last two years, the
        warehouse query wins by a comfortable margin. Sometimes by a
        humiliating one.
      </p>

      <p>We should talk about why.</p>

      <H2 id="benchmark">The benchmark nobody runs</H2>

      <p>
        The reason nobody runs this comparison is that the two systems live
        in different parts of the org chart, get measured against different
        SLAs, and are owned by people who have never had to apologize to each
        other. Data engineering is benchmarked on cost per terabyte and
        freshness lag. ML and AI are benchmarked on accuracy, then
        throughput, then cost. Latency, the metric you would actually care
        about if you were the user, sits awkwardly between them.
      </p>

      <p>
        Run it once. A real query, a real call, both warm. Here is the rough
        shape, with arbitrary but representative numbers:
      </p>

      <CodeBlock
        lang="sql/python"
        caption="A warehouse aggregation against forty-seven million rows beats a single classification call by roughly 2x at the wire, on a stack that costs perhaps 100x less per request."
        lines={[
          [c("comment", "-- snowflake xs warehouse, warm, 47M rows, p50")],
          [c("kw", "SELECT"), c("", " "), c("id", "user_id"), c("", ", "), c("fn", "row_number"), c("", "() "), c("kw", "OVER"), c("", " ("), c("kw", "PARTITION BY"), c("", " "), c("id", "user_id"), c("", " "), c("kw", "ORDER BY"), c("", " "), c("id", "ts"), c("", " "), c("kw", "DESC"), c("", ") "), c("kw", "AS"), c("", " "), c("id", "rn")],
          [c("kw", "FROM"), c("", " "), c("id", "events.session_starts")],
          [c("kw", "WHERE"), c("", " "), c("id", "ts"), c("", " >= "), c("fn", "current_date"), c("", "() - "), c("num", "180"), c("", ";")],
          [c("comment", "-- 230 ms")],
          [c("", "")],
          [c("comment", "# vllm classifier, warm worker, p50")],
          [c("kw", "result"), c("", " = "), c("fn", "client.classify"), c("", "(")],
          [c("", "    "), c("kw", "text"), c("", "="), c("str", '"…"'), c("", ", "), c("kw", "model"), c("", "="), c("str", '"intent-v3"')],
          [c("", ")")],
          [c("comment", "# 480 ms")],
        ]}
      />

      <p>
        The warehouse aggregated 47 million rows and answered in 230 ms. The
        serving call did one classification and answered in 480 ms. You are
        paying perhaps a hundred times more per call for the model, and it
        is, at best, half the speed.
      </p>

      <PullQuote>
        You are paying perhaps a hundred times more per call for the model,
        and it is, at best, half the speed.
      </PullQuote>

      <H2 id="shape">The shape of the gap</H2>

      <p>
        The first instinct is to say the gap is GPU versus CPU, or warehouse
        versus Python. Both are wrong, or at least beside the point. Modern
        warehouses are CPU all the way down, and the slowest part of model
        serving is almost never the matrix multiplication.
      </p>

      <p>The shape is this:</p>

      <StackDiagram />

      <p>
        Look at how many places the warehouse has spent the last fifteen
        years attacking. Query compilation runs once and is cached. Predicate
        pushdown happens before any data moves. Columnar storage means the
        scan touches the bytes you actually need. Vectorized execution
        amortizes per-row overhead across batches of thousands. The runtime
        is C++ or Rust under a thin SQL skin. The result is that a query
        which looks expensive on paper hits a system that has been brutally
        optimized to make exactly that query cheap.
      </p>

      <BlockQuote>
        The warehouse, by the time it sees your query, has already been
        quietly ruthless about everything between the network socket and the
        data. Model serving, by the time it sees your input, has done none
        of those things, and is about to do all of them in Python.
      </BlockQuote>

      <p>
        Now look at the serving stack. It was written in the last eighteen
        months. It is mostly Python. Each stage was added when somebody had a
        legitimate concern (auth, rate limiting, tracing, eval logging,
        fallback routing), and each stage was added in a hurry. The hot path
        passes through a queue because the original v0 had one shared
        worker. The tokenizer is a sidecar because the model graph could not
        include it. The output passes through a guardrail check that, if you
        read the source, calls another model. Each of those stages is fine
        on its own. They were not designed to compose at p50 latency.
      </p>

      <H3 id="not-the-model">This is not a model problem</H3>

      <p>
        Almost none of the gap is the model. People love to argue about
        whether the next quantization or the next inference engine will
        close it. Some of it might. But if you spent a week with your
        serving traces, you would find that something embarrassing, like
        JSON parsing or pydantic validation, eats more time than the actual
        forward pass on at least one production endpoint near you. I have
        seen 70 ms inference behind 300 ms of dispatch.
        <FootnoteRef n={1} /> I have also seen the inverse, and I trust
        those teams less, because it usually means they stopped measuring
        before they stopped optimizing.
      </p>

      <H2 id="what-to-do">What to actually do</H2>

      <p>Three things, in this order.</p>

      <CodeBlock
        lang="python"
        caption="Per-stage timing on the serving path. Routine to write, easy to ignore, the difference between a serving stack you understand and one you do not."
        lines={[
          [c("kw", "from"), c("", " "), c("id", "time"), c("", " "), c("kw", "import"), c("", " "), c("id", "perf_counter")],
          [c("kw", "from"), c("", " "), c("id", "contextlib"), c("", " "), c("kw", "import"), c("", " "), c("id", "contextmanager")],
          [c("", "")],
          [c("decor", "@contextmanager")],
          [c("kw", "def"), c("", " "), c("fn", "stage"), c("", "("), c("id", "name"), c("", ", "), c("id", "tracker"), c("", "):")],
          [c("", "    "), c("id", "t0"), c("", " = "), c("fn", "perf_counter"), c("", "()")],
          [c("", "    "), c("kw", "yield")],
          [c("", "    "), c("id", "tracker"), c("", "["), c("id", "name"), c("", "] = "), c("fn", "round"), c("", "(("), c("fn", "perf_counter"), c("", "() - "), c("id", "t0"), c("", ") * "), c("num", "1000"), c("", ", "), c("num", "2"), c("", ")")],
          [c("", "")],
          [c("kw", "def"), c("", " "), c("fn", "classify"), c("", "("), c("id", "req"), c("", "):")],
          [c("", "    "), c("id", "t"), c("", " = {}")],
          [c("", "    "), c("kw", "with"), c("", " "), c("fn", "stage"), c("", "("), c("str", '"validate"'), c("", ", "), c("id", "t"), c("", "):")],
          [c("", "        "), c("id", "payload"), c("", " = "), c("id", "Schema"), c("", "."), c("fn", "model_validate"), c("", "("), c("id", "req"), c("", "."), c("id", "json"), c("", ")")],
          [c("", "    "), c("kw", "with"), c("", " "), c("fn", "stage"), c("", "("), c("str", '"tokenize"'), c("", ", "), c("id", "t"), c("", "):")],
          [c("", "        "), c("id", "tokens"), c("", " = "), c("id", "tokenizer"), c("", "."), c("fn", "encode"), c("", "("), c("id", "payload"), c("", "."), c("id", "text"), c("", ")")],
          [c("", "    "), c("kw", "with"), c("", " "), c("fn", "stage"), c("", "("), c("str", '"infer"'), c("", ", "), c("id", "t"), c("", "):")],
          [c("", "        "), c("id", "logits"), c("", " = "), c("id", "model"), c("", "."), c("fn", "forward"), c("", "("), c("id", "tokens"), c("", ")")],
          [c("", "    "), c("kw", "with"), c("", " "), c("fn", "stage"), c("", "("), c("str", '"postprocess"'), c("", ", "), c("id", "t"), c("", "):")],
          [c("", "        "), c("id", "label"), c("", " = "), c("id", "head"), c("", "."), c("fn", "argmax"), c("", "("), c("id", "logits"), c("", ")")],
          [c("", "    "), c("id", "log"), c("", "."), c("fn", "info"), c("", "("), c("str", '"classify"'), c("", ", "), c("kw", "stage_ms"), c("", "="), c("id", "t"), c("", ", "), c("kw", "label"), c("", "="), c("id", "label"), c("", ")")],
          [c("", "    "), c("kw", "return"), c("", " "), c("id", "label")],
        ]}
      />

      <p>
        First, instrument every stage of the serving path the same way the
        warehouse instruments its plan. Not p99 of the whole call. Per-stage
        p50 and p99, with the stage names attached, exported continuously.
        If you cannot answer{" "}
        <em className="not-italic font-medium text-[color:var(--ink)]">
          where did the 480 ms go
        </em>{" "}
        in under a minute, you cannot improve it.
      </p>

      <p>
        Second, accept that you have a query optimizer to write. Routing,
        batching, caching, prompt deduplication, response compression:
        these are the warehouse&rsquo;s tricks, ported to your serving
        stack. None of them are research. All of them get rejected, because
        a bigger model is a more interesting Slack message.
      </p>

      <p>
        Third, stop pretending model serving has to be slow. Some of it
        does. Generation has a token budget you cannot cheat.
        <FootnoteRef n={2} /> But classification, embedding, retrieval,
        scoring, ranking: those should land inside the latency budget your
        warehouse query already meets. If they do not, the work is not done.
      </p>

      <H3 id="last-thing">One last thing</H3>

      <p>
        A senior engineer I worked with used to ask, of any system,{" "}
        <em className="not-italic font-medium text-[color:var(--ink)]">
          what is it spending the time on, and is it the time you wanted it
          to spend.
        </em>{" "}
        It is a small question. It is easier to ask than to answer. The
        honest answer, for most model serving stacks today, is that the time
        we wanted to spend is on the model, and the time we are spending is
        on everything else. The warehouse, fifteen years older and a tenth
        as fashionable, would never put up with that.
      </p>
    </div>
  );
}

/* -------------------------------------------------------------- *
 * Block-level building parts
 * -------------------------------------------------------------- */

function H2({ id, children }: { id: string; children: React.ReactNode }) {
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

function H3({ id, children }: { id: string; children: React.ReactNode }) {
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

function PullQuote({ children }: { children: React.ReactNode }) {
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

function BlockQuote({ children }: { children: React.ReactNode }) {
  return (
    <blockquote
      className="my-8 pl-6 border-l border-[color:var(--cypress)] text-[color:var(--ink-muted)]"
    >
      <p className="text-[18px] sm:text-[19px] leading-[1.6] m-0">{children}</p>
    </blockquote>
  );
}

function FootnoteRef({ n }: { n: number }) {
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

/* -------------------------------------------------------------- *
 * Code block (hand-tokenized, no runtime highlighter)
 * -------------------------------------------------------------- */

type Token = { k: TokenKind; t: string };
type TokenKind = "" | "kw" | "id" | "fn" | "str" | "num" | "comment" | "decor";

function c(k: TokenKind, t: string): Token {
  return { k, t };
}

function CodeBlock({
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
              {line.length === 0 ? " " : line.map((tok, j) => (
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
 * Stack diagram (hand-authored SVG)
 * -------------------------------------------------------------- */

type StageDatum = { name: string; ms: number };

function StackDiagram() {
  const warehouse: StageDatum[] = [
    { name: "client", ms: 5 },
    { name: "coordinator", ms: 15 },
    { name: "compiled plan", ms: 10 },
    { name: "vectorized scan", ms: 195 },
    { name: "result", ms: 5 },
  ];
  const serving: StageDatum[] = [
    { name: "client", ms: 5 },
    { name: "gateway", ms: 25 },
    { name: "auth", ms: 30 },
    { name: "queue", ms: 60 },
    { name: "worker", ms: 35 },
    { name: "tokenize", ms: 40 },
    { name: "model", ms: 70 },
    { name: "detokenize", ms: 25 },
    { name: "validate", ms: 130 },
    { name: "response", ms: 60 },
  ];
  const wTotal = warehouse.reduce((a, b) => a + b.ms, 0);
  const sTotal = serving.reduce((a, b) => a + b.ms, 0);
  const max = Math.max(wTotal, sTotal);
  const SCALE = 0.95;
  const colHeight = max * SCALE;
  const wHeight = wTotal * SCALE;

  return (
    <figure className="my-12 -mx-2 sm:mx-[-3rem] lg:mx-[-7rem]">
      <div
        className="
          bg-[color:var(--paper-deep)]
          border-y border-[color:var(--hairline)]
          px-6 sm:px-12 py-10
        "
      >
        <div
          className="grid grid-cols-2 gap-8 sm:gap-16 max-w-[64rem] mx-auto"
        >
          <ProportionalStack
            label="Warehouse query"
            stages={warehouse}
            colHeight={colHeight}
            stackHeight={wHeight}
            timing={`${wTotal} ms`}
          />
          <ProportionalStack
            label="Model serving"
            stages={serving}
            colHeight={colHeight}
            stackHeight={colHeight}
            timing={`${sTotal} ms`}
            crossLine={{
              atPx: wHeight,
              label: "warehouse done",
            }}
          />
        </div>
      </div>
      <figcaption
        className="
          mt-3 px-2 sm:px-0
          font-mono text-[12px] leading-[1.5]
          text-[color:var(--ink-muted)]
          max-w-[68ch]
        "
      >
        Same request envelope, different total time. Stage heights are
        proportional to p50 latency. Where the warehouse is finished, the
        serving stack still has{" "}
        <span className="text-[color:var(--ink)] font-medium">
          {sTotal - wTotal} ms
        </span>{" "}
        of work to do, and none of it is the model.
      </figcaption>
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

/* -------------------------------------------------------------- *
 * Footnotes
 * -------------------------------------------------------------- */

function Footnotes() {
  const notes = [
    {
      n: 1,
      body: "I have also seen the inverse, where the model is genuinely the slowest stage. Those stacks are run by people who already have working tracing and have stopped reading posts like this.",
    },
    {
      n: 2,
      body: "Yes, this changes for streaming generation. The argument here is about the non-generative serving path, which is most of what production AI actually does.",
    },
  ];
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
 * Prev / Next
 * -------------------------------------------------------------- */

function PrevNext() {
  const items: { dir: "prev" | "next"; href: string; title: string }[] = [
    {
      dir: "prev",
      href: "#",
      title: "The dbt project that ate a quarter, and what we learned the second time",
    },
    {
      dir: "next",
      href: "#",
      title: "Stop using vector search for things that are not search",
    },
  ];
  return (
    <nav
      aria-label="Adjacent posts"
      className="grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-10 border-t border-[color:var(--hairline)] pt-10"
    >
      {items.map((it) => {
        const isStub = it.href === "#";
        const align = it.dir === "next" ? "sm:text-right" : "";
        const labelCls =
          "font-mono text-[11px] uppercase tracking-[0.12em] text-[color:var(--ink-muted)]";
        const titleCls = [
          "text-[19px] leading-[1.3] transition-colors duration-150",
          isStub
            ? "text-[color:var(--ink-muted)] opacity-70"
            : "text-[color:var(--ink)] group-hover:text-[color:var(--brick-deep)]",
        ].join(" ");
        const inner = (
          <>
            <span className={labelCls}>
              {it.dir === "prev" ? "← Previous" : "Next →"}
              {isStub ? " · soon" : ""}
            </span>
            <span className={titleCls}>{it.title}</span>
          </>
        );
        const wrapperCls = [
          "group flex flex-col gap-2 transition-colors duration-150",
          align,
        ].join(" ");
        return isStub ? (
          <span
            key={it.dir}
            aria-disabled="true"
            className={`${wrapperCls} cursor-not-allowed`}
          >
            {inner}
          </span>
        ) : (
          <a key={it.dir} href={it.href} className={wrapperCls}>
            {inner}
          </a>
        );
      })}
    </nav>
  );
}

/* -------------------------------------------------------------- *
 * Related
 * -------------------------------------------------------------- */

function RelatedPosts() {
  const items = [
    {
      title: "Your data warehouse is a state machine, please treat it like one",
      date: "Apr 12, 2026",
    },
    {
      title: "I read every AI infra postmortem from 2025 so you do not have to",
      date: "Mar 28, 2026",
    },
    {
      title: "Ten years of CDC, and the same three bugs",
      date: "Feb 19, 2026",
    },
  ];
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
          <li key={it.title}>
            <span
              aria-disabled="true"
              className="
                grid grid-cols-[1fr_auto] gap-6 items-baseline
                py-4 cursor-not-allowed
              "
            >
              <span className="text-[17px] leading-[1.4] text-[color:var(--ink-muted)] opacity-80 flex items-baseline gap-3 flex-wrap">
                <span>{it.title}</span>
                <span
                  aria-label="Coming soon"
                  className="font-mono text-[10px] uppercase tracking-[0.12em] opacity-70"
                >
                  (soon)
                </span>
              </span>
              <time className="font-mono text-[12px] text-[color:var(--ink-muted)] whitespace-nowrap opacity-80">
                {it.date}
              </time>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* Helpers re-exported from local scope */
