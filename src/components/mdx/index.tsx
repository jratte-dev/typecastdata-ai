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

export { EngineersDay } from "./EngineersDay";
export { Bifurcation } from "./Bifurcation";

export type {
  Token,
  TokenKind,
  FootnoteEntry,
  StageDatum,
} from "./components";

export type { DayActivity, EngineersDayProps } from "./EngineersDay";
export type {
  BifurcationProps,
  BifurcationBranch,
  BifurcationOutcome,
} from "./Bifurcation";
