"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { TOPICS, topicMeta, type Topic } from "@/lib/content/topics";
import { formatDate } from "@/lib/content/format";
import type { Article } from "@/lib/content/types";

type Selection = "all" | Topic;

export function ArchiveControls({ articles }: { articles: Article[] }) {
  const [selection, setSelection] = useState<Selection>("all");
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return articles.filter((a) => {
      if (selection !== "all" && a.topic !== selection) return false;
      if (q && !a.title.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [articles, selection, query]);

  return (
    <>
      <FilterStrip
        selection={selection}
        onSelect={setSelection}
        query={query}
        onQuery={setQuery}
        inputRef={inputRef}
        resultCount={filtered.length}
        total={articles.length}
      />
      <ArticleList
        articles={filtered}
        total={articles.length}
        onClear={() => {
          setSelection("all");
          setQuery("");
          requestAnimationFrame(() => inputRef.current?.focus());
        }}
      />
    </>
  );
}

/* -------------------------------------------------------------- *
 * Filter strip — sticky, paper background once the brick band scrolls past
 * -------------------------------------------------------------- */

function FilterStrip({
  selection,
  onSelect,
  query,
  onQuery,
  inputRef,
  resultCount,
  total,
}: {
  selection: Selection;
  onSelect: (s: Selection) => void;
  query: string;
  onQuery: (q: string) => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
  resultCount: number;
  total: number;
}) {
  return (
    <div
      className="
        sticky top-0 z-30
        bg-[color:var(--paper)]
        border-b border-[color:var(--hairline)]
      "
    >
      <div
        className="
          mx-auto max-w-[88rem] px-6 sm:px-10
          py-4
          flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8
        "
      >
        <Chips selection={selection} onSelect={onSelect} />
        <SearchInput
          query={query}
          onQuery={onQuery}
          inputRef={inputRef}
          resultCount={resultCount}
          total={total}
        />
      </div>
    </div>
  );
}

function Chips({
  selection,
  onSelect,
}: {
  selection: Selection;
  onSelect: (s: Selection) => void;
}) {
  const items: { id: Selection; label: string }[] = [
    { id: "all", label: "all" },
    ...TOPICS.map((t) => ({ id: t.id as Selection, label: t.label })),
  ];
  return (
    <div role="group" aria-label="Filter by topic" className="flex flex-wrap items-center gap-2">
      {items.map((item) => {
        const active = selection === item.id;
        return (
          <button
            key={item.id}
            type="button"
            aria-pressed={active}
            onClick={() => onSelect(item.id)}
            className={[
              "h-[40px] sm:h-[32px] px-3",
              "font-mono text-[11px] uppercase tracking-[0.12em]",
              "border transition-colors duration-150",
              active
                ? "bg-[color:var(--ink)] text-[color:var(--paper)] border-[color:var(--ink)]"
                : "text-[color:var(--ink-muted)] border-[color:var(--hairline)] hover:text-[color:var(--brick-deep)] hover:border-[color:var(--brick)]",
            ].join(" ")}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}

function SearchInput({
  query,
  onQuery,
  inputRef,
  resultCount,
  total,
}: {
  query: string;
  onQuery: (q: string) => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
  resultCount: number;
  total: number;
}) {
  return (
    <div className="sm:ml-auto flex items-baseline gap-3 w-full sm:w-auto">
      <label className="flex items-baseline gap-3 flex-1 sm:flex-none sm:w-[24ch]">
        <span className="sr-only">Search post titles</span>
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(e) => onQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Escape") onQuery("");
          }}
          placeholder="Search titles…"
          className="
            font-mono text-[13px] leading-[1.5]
            w-full
            bg-transparent
            border-0 border-b border-[color:var(--hairline)]
            px-0 py-1
            placeholder:text-[color:var(--ink-muted)]/70
            focus:border-[color:var(--brick)] focus:outline-none
            transition-colors duration-150
          "
        />
      </label>
      <span
        aria-live="polite"
        className="font-mono text-[11px] text-[color:var(--ink-muted)] tabular-nums whitespace-nowrap"
      >
        {resultCount === total ? "" : `${resultCount}/${total}`}
      </span>
    </div>
  );
}

/* -------------------------------------------------------------- *
 * Article list
 * -------------------------------------------------------------- */

function ArticleList({
  articles,
  total,
  onClear,
}: {
  articles: Article[];
  total: number;
  onClear: () => void;
}) {
  if (total === 0) {
    return (
      <div className="mx-auto max-w-[88rem] px-6 sm:px-10 py-20">
        <p className="text-[17px] leading-[1.5] text-[color:var(--ink-muted)] max-w-[60ch]">
          No published articles yet. The first one lands when it lands.
        </p>
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="mx-auto max-w-[88rem] px-6 sm:px-10 py-20">
        <p className="text-[17px] leading-[1.5] text-[color:var(--ink-muted)] max-w-[60ch]">
          No posts match. Try another topic, or no filter at all.
        </p>
        <button
          type="button"
          onClick={onClear}
          className="
            mt-4
            font-mono text-[12px] uppercase tracking-[0.12em]
            text-[color:var(--ink)]
            underline decoration-[color:var(--hairline)]
            decoration-1 underline-offset-[5px]
            transition-colors duration-150
            hover:text-[color:var(--brick-deep)] hover:decoration-[color:var(--brick)]
          "
        >
          Clear filter →
        </button>
      </div>
    );
  }

  return (
    <ol className="mx-auto max-w-[88rem] px-6 sm:px-10 pb-20">
      {articles.map((article) => (
        <li
          key={article.slug}
          className="border-b border-[color:var(--hairline)] first:border-t"
        >
          <Link
            href={article.href}
            className="
              grid grid-cols-[8ch_1fr] sm:grid-cols-[10ch_1fr_auto] gap-3 sm:gap-6
              items-baseline py-5 sm:py-6 group
              transition-colors duration-150
            "
          >
            <time
              dateTime={article.date}
              className="font-mono text-[12px] tabular-nums whitespace-nowrap text-[color:var(--ink-muted)]"
            >
              {formatDate(article.date)}
            </time>
            <span className="text-[17px] sm:text-[18px] leading-[1.4] transition-colors duration-150 col-span-2 sm:col-span-1 flex items-baseline gap-3 flex-wrap text-[color:var(--ink)] group-hover:text-[color:var(--brick-deep)]">
              <span>{article.title}</span>
            </span>
            <span
              className="
                hidden sm:inline-flex
                font-mono text-[10px] uppercase tracking-[0.12em]
                text-[color:var(--cypress-deep)]
                border border-[color:var(--cypress)]
                px-1.5 py-0.5 leading-none
                whitespace-nowrap
              "
            >
              {topicMeta(article.topic).label}
            </span>
          </Link>
        </li>
      ))}
    </ol>
  );
}
