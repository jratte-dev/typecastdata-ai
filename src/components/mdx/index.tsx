/**
 * Components made available globally to every MDX file under content/articles/.
 * Registered via mdx-components.tsx at the project root, which Next.js calls
 * automatically when compiling .mdx files.
 *
 * Helpers (like `c()` for CodeBlock token construction) are exported
 * alongside but must be imported explicitly in MDX since the components map
 * only handles components. Use:
 *
 *     import { c } from "@/components/mdx";
 *
 * at the top of an MDX file when authoring CodeBlock token arrays.
 */

export {
  H2,
  H3,
  PullQuote,
  BlockQuote,
  FootnoteRef,
  Footnotes,
  CodeBlock,
  StackDiagram,
  c,
} from "./components";

export { CycleComparison } from "./CycleComparison";
export { PodLayout } from "./PodLayout";
export { SeatTimeBudget } from "./SeatTimeBudget";

export type {
  Token,
  TokenKind,
  FootnoteEntry,
  StageDatum,
} from "./components";

export type { CycleData, CycleComparisonProps } from "./CycleComparison";
export type { PodNode, PodEdge, PodLayoutProps } from "./PodLayout";
export type { Segment, Role, SeatTimeBudgetProps } from "./SeatTimeBudget";
