"use client";

import { useMemo, useRef, useState } from "react";
import { POSTS, TOPICS, topicMeta, type Post, type Topic } from "../posts";

type Selection = "all" | Topic;

export function ArchiveControls() {
  const [selection, setSelection] = useState<Selection>("all");
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return POSTS.filter((p) => {
      if (selection !== "all" && p.topic !== selection) return false;
      if (q && !p.title.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [selection, query]);

  return (
    <>
      <FilterStrip
        selection={selection}
        onSelect={setSelection}
        query={query}
        onQuery={setQuery}
        inputRef={inputRef}
        resultCount={filtered.length}
      />
      <PostList posts={filtered} onClear={() => {
        setSelection("all");
        setQuery("");
        requestAnimationFrame(() => inputRef.current?.focus());
      }} />
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
}: {
  selection: Selection;
  onSelect: (s: Selection) => void;
  query: string;
  onQuery: (q: string) => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
  resultCount: number;
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
    <div role="tablist" aria-label="Filter by topic" className="flex flex-wrap items-center gap-2">
      {items.map((item) => {
        const active = selection === item.id;
        return (
          <button
            key={item.id}
            role="tab"
            aria-selected={active}
            onClick={() => onSelect(item.id)}
            className={[
              "h-[32px] px-3",
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
}: {
  query: string;
  onQuery: (q: string) => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
  resultCount: number;
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
        {resultCount === POSTS.length ? "" : `${resultCount}/${POSTS.length}`}
      </span>
    </div>
  );
}

/* -------------------------------------------------------------- *
 * Post list
 * -------------------------------------------------------------- */

function PostList({ posts, onClear }: { posts: Post[]; onClear: () => void }) {
  if (posts.length === 0) {
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
      {posts.map((post) => {
        const isStub = post.href === "#";
        return (
          <li
            key={post.slug}
            className="border-b border-[color:var(--hairline)] first:border-t"
          >
            <a
              href={post.href}
              aria-disabled={isStub || undefined}
              tabIndex={isStub ? -1 : undefined}
              onClick={isStub ? (e) => e.preventDefault() : undefined}
              className={[
                "grid grid-cols-[8ch_1fr] sm:grid-cols-[10ch_1fr_auto] gap-3 sm:gap-6",
                "items-baseline py-5 sm:py-6 group",
                "transition-colors duration-150",
                isStub ? "cursor-not-allowed" : "",
              ].join(" ")}
            >
              <time
                dateTime={post.isoDate}
                className={[
                  "font-mono text-[12px] tabular-nums whitespace-nowrap",
                  isStub
                    ? "text-[color:var(--ink-muted)] opacity-60"
                    : "text-[color:var(--ink-muted)]",
                ].join(" ")}
              >
                {post.date}
              </time>
              <span
                className={[
                  "text-[17px] sm:text-[18px] leading-[1.4] transition-colors duration-150",
                  "col-span-2 sm:col-span-1 flex items-baseline gap-3 flex-wrap",
                  isStub
                    ? "text-[color:var(--ink-muted)] opacity-70"
                    : "text-[color:var(--ink)] group-hover:text-[color:var(--brick-deep)]",
                ].join(" ")}
              >
                {post.isNew ? (
                  <span
                    aria-label="New post"
                    className="font-mono text-[10px] uppercase tracking-[0.16em] text-[color:var(--cypress-deep)] mr-[-0.25rem]"
                  >
                    new ·
                  </span>
                ) : null}
                <span>{post.title}</span>
                {isStub ? (
                  <span
                    aria-label="Coming soon"
                    className="font-mono text-[10px] uppercase tracking-[0.12em] text-[color:var(--ink-muted)] opacity-70"
                  >
                    (soon)
                  </span>
                ) : null}
              </span>
              <span
                className={[
                  "hidden sm:inline-flex",
                  "font-mono text-[10px] uppercase tracking-[0.12em]",
                  "text-[color:var(--cypress-deep)]",
                  "border border-[color:var(--cypress)]",
                  "px-1.5 py-0.5 leading-none",
                  "whitespace-nowrap",
                  isStub ? "opacity-60" : "",
                ].join(" ")}
              >
                {topicMeta(post.topic).label}
              </span>
            </a>
          </li>
        );
      })}
    </ol>
  );
}
