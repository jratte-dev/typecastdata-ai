# content/articles/

This is where published articles live. One file per article, format `<slug>.mdx`. The build reads from this directory at compile time. No CMS, no database.

## Frontmatter spec

Every `.mdx` file under `articles/` must include this frontmatter block at the top.

```yaml
---
title: "Your warehouse is faster than your model serving"
slug: "warehouse-vs-serving"
description: "An honest accounting of the cheapest part of your stack outperforming the most expensive one, and what to do about it before someone asks."
topic: "ai"
date: "2026-05-04"
draft: false
sections:
  - id: "benchmark"
    label: "The benchmark nobody runs"
  - id: "shape"
    label: "The shape of the gap"
  - id: "what-to-do"
    label: "What to actually do"
related:
  - "warehouse-state-machine"
  - "vector-search-not-search"
---
```

### Required fields

- **`title`** — full post title, sentence case, no trailing period.
- **`slug`** — kebab-case, also the filename stem and the URL path. Must match the filename: `warehouse-vs-serving.mdx` → `slug: "warehouse-vs-serving"`.
- **`description`** — one sentence. Used for `<meta name="description">` and the article subhead. Keep under 200 chars.
- **`topic`** — one of `data`, `ai`, `postmortems`, `trade`. Defined in `src/app/posts.ts` (the `Topic` type).
- **`date`** — ISO `YYYY-MM-DD`. Drives sort order, RSS `pubDate`, and the displayed date.

### Optional fields

- **`draft`** — `true` filters the article out at build time (no route, no archive entry, no RSS). Default `false`.
- **`sections`** — array of `{id, label}` for the in-article TOC. If omitted, the TOC is hidden.
- **`related`** — array of slugs for the "Also worth reading" block. If omitted, the block falls back to recent articles in the same topic.

## Body

Plain Markdown plus MDX. The article components are pre-registered globally via `src/components/mdx/index.tsx`, so use them without imports:

```mdx
## A heading

A paragraph with **emphasis** and a [link](https://example.com).

<PullQuote>
  A short, punchy line worth pulling out.
</PullQuote>

<H2 id="benchmark">The benchmark nobody runs</H2>

<CodeBlock
  lang="sql"
  caption="Optional caption."
  lines={[
    [c("kw", "SELECT"), c("", " "), c("id", "user_id")],
    [c("kw", "FROM"), c("", " "), c("id", "events")]
  ]}
/>
```

Available components: `H2`, `H3`, `PullQuote`, `BlockQuote`, `CodeBlock`, `StackDiagram`, `FootnoteRef`. The `c()` helper is also globally exported for `CodeBlock` token construction.

Heading IDs come from `rehype-slug` automatically — Markdown `## My heading` produces `<h2 id="my-heading">`. Use `<H2 id="explicit-id">` if you want a stable anchor that doesn't drift with copy edits.

## Drafts

Setting `draft: true` keeps an article in the repo without publishing it. Useful for working on a draft on `main` without hiding it on a feature branch. The build skips drafts entirely: no route, no archive listing, no RSS entry.

Articles intended to ship live in `vault/inbox/` first (rough), then `typecastdata/posts/drafts/` (polished), then promote into this directory via the drafts bridge (Phase 2). Don't author MDX directly here unless you're hand-fixing something.
