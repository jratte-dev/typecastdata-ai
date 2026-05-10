import type { MDXComponents } from "mdx/types";
import {
  H2,
  H3,
  PullQuote,
  BlockQuote,
  FootnoteRef,
  Footnotes,
  CodeBlock,
  StackDiagram,
  CycleComparison,
} from "@/components/mdx";

/**
 * Next.js calls this when compiling MDX. Returning a map here makes the
 * named components available in every .mdx file without per-file imports.
 *
 * The lowercase keys (`h2`, `h3`) override the default Markdown rendering
 * of `## Heading` and `### Heading`. The PascalCase keys are usable as
 * JSX in MDX bodies. Helper functions like `c()` are not exposed via this
 * map — import them explicitly in MDX when needed.
 */
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h2: H2,
    h3: H3,
    PullQuote,
    BlockQuote,
    FootnoteRef,
    Footnotes,
    CodeBlock,
    StackDiagram,
    CycleComparison,
    ...components,
  };
}
