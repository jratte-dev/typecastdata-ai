import * as React from "react";

/**
 * PodLayout — a small network/flow diagram for talking about how a team
 * actually communicates, not how the org chart says they do. Renders nodes
 * as labeled boxes positioned by `role` and connects them with edges that
 * can be solid, dashed, emphasized, or bidirectional.
 *
 * Designed for the "consulting pod under AI tooling" article (4 nodes:
 * external, non-technical, technical lead, technical) but the role->position
 * lookup is extensible. Unknown roles fall back to a circle layout so the
 * component still renders something sensible if reused.
 */

export type PodNode = {
  /** Stable id used to wire up edges. */
  id: string;
  /** Short label rendered in the box header. */
  label: string;
  /** Role token used to position the node and tone its styling. */
  role: string;
  /** Optional one-line description rendered under the label. */
  note?: string;
};

export type PodEdge = {
  /** Source node id. */
  from: string;
  /** Target node id. */
  to: string;
  /** Optional caption rendered near the edge midpoint. */
  label?: string;
  /** Line style. Defaults to "solid". */
  style?: "solid" | "dashed";
  /** When true, draws arrowheads on both ends. */
  bidirectional?: boolean;
  /** When true, draws the edge in the cypress accent at +0.5 stroke. */
  emphasis?: boolean;
};

export type PodLayoutProps = {
  title?: string;
  subtitle?: string;
  nodes: PodNode[];
  edges: PodEdge[];
  caption?: React.ReactNode;
};

// Layout dimensions live in viewBox units. The SVG scales to container
// width via CSS, the container holds aspect ratio. Centering math below
// assumes these constants.
const VBW = 1000;
const VBH = 540;
const NODE_W = 260;
const NODE_H = 96;

const ROLE_POSITIONS: Record<string, { x: number; y: number }> = {
  external: { x: 500, y: 70 },
  "non-technical": { x: 220, y: 270 },
  "technical lead": { x: 780, y: 270 },
  technical: { x: 500, y: 470 },
};

type Positioned = PodNode & { x: number; y: number };

export function PodLayout({
  title,
  subtitle,
  nodes,
  edges,
  caption,
}: PodLayoutProps) {
  const positioned = layoutNodes(nodes);
  const byId = new Map(positioned.map((n) => [n.id, n]));

  return (
    <figure className="my-12 -mx-2 sm:mx-[-3rem] lg:mx-[-7rem]">
      <div className="bg-[color:var(--paper-deep)] border-y border-[color:var(--hairline)] px-6 sm:px-12 py-10">
        <div className="max-w-[64rem] mx-auto">
          {title ? (
            <h3 className="font-mono text-[12px] uppercase tracking-[0.16em] text-[color:var(--ink-muted)] mb-2">
              {title}
            </h3>
          ) : null}
          {subtitle ? (
            <p className="font-sans text-[15px] sm:text-[16px] leading-[1.45] text-[color:var(--ink)] mb-8 max-w-[60ch]">
              {subtitle}
            </p>
          ) : null}

          <svg
            viewBox={`0 0 ${VBW} ${VBH}`}
            className="w-full"
            role="img"
            aria-label={title ?? "Pod layout diagram"}
          >
            <defs>
              <marker
                id="pod-arrow-muted"
                viewBox="0 0 10 10"
                refX="9"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path
                  d="M 0 0 L 10 5 L 0 10 z"
                  fill="color-mix(in oklch, var(--ink-muted) 70%, transparent)"
                />
              </marker>
              <marker
                id="pod-arrow-accent"
                viewBox="0 0 10 10"
                refX="9"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--cypress)" />
              </marker>
            </defs>

            {/* Edges first so node fills sit on top */}
            {edges.map((edge, i) => {
              const a = byId.get(edge.from);
              const b = byId.get(edge.to);
              if (!a || !b) return null;
              return <EdgeShape key={i} a={a} b={b} edge={edge} />;
            })}

            {positioned.map((node) => (
              <NodeShape key={node.id} node={node} />
            ))}
          </svg>
        </div>
      </div>
      {caption ? (
        <figcaption className="mt-3 px-2 sm:px-0 font-mono text-[12px] leading-[1.5] text-[color:var(--ink-muted)] max-w-[68ch]">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

function NodeShape({ node }: { node: Positioned }) {
  const { x, y, label, note, role } = node;
  const rx = NODE_W / 2;
  const ry = NODE_H / 2;
  const isAccent = role === "technical lead";
  const isExternal = role === "external";

  const strokeColor = isAccent ? "var(--cypress)" : "var(--ink-muted)";
  const fillColor = isExternal
    ? "color-mix(in oklch, var(--ink-muted) 5%, var(--paper))"
    : isAccent
    ? "color-mix(in oklch, var(--cypress) 6%, var(--paper))"
    : "var(--paper)";
  const strokeWidth = isAccent ? 1.5 : 1;

  // Rough character-based wrap for the note. Anything longer than ~38
  // chars per line gets a manual split. SVG text doesn't auto-wrap.
  const noteLines = wrapText(note ?? "", 38, 3);

  return (
    <g transform={`translate(${x - rx}, ${y - ry})`}>
      <rect
        width={NODE_W}
        height={NODE_H}
        rx={6}
        ry={6}
        fill={fillColor}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
      />
      <text
        x={NODE_W / 2}
        y={26}
        textAnchor="middle"
        className="font-mono"
        fontSize={11}
        letterSpacing="0.12em"
        fill={isAccent ? "var(--cypress-deep)" : "var(--ink)"}
        style={{ textTransform: "uppercase" }}
      >
        {label.toUpperCase()}
      </text>
      {noteLines.map((line, i) => (
        <text
          key={i}
          x={NODE_W / 2}
          y={48 + i * 14}
          textAnchor="middle"
          fontSize={11}
          fill="var(--ink-muted)"
        >
          {line}
        </text>
      ))}
    </g>
  );
}

function EdgeShape({
  a,
  b,
  edge,
}: {
  a: Positioned;
  b: Positioned;
  edge: PodEdge;
}) {
  const { p1, p2 } = clipEndpoints(a, b);

  const stroke = edge.emphasis ? "var(--cypress)" : "var(--ink-muted)";
  const strokeOpacity = edge.emphasis ? 1 : 0.55;
  const strokeWidth = edge.emphasis ? 1.5 : 1;
  const dashArray = edge.style === "dashed" ? "5 4" : undefined;
  const markerId = edge.emphasis ? "pod-arrow-accent" : "pod-arrow-muted";

  // Midpoint for label placement.
  const mx = (p1.x + p2.x) / 2;
  const my = (p1.y + p2.y) / 2;

  // For the BA<->Architect telephone-game arrow specifically, we want the
  // label to sit ABOVE the midpoint, not centered on the line. For other
  // edges the midpoint is fine. Pick offset by edge orientation: if the
  // edge is more horizontal than vertical, shift the label up by ~14px.
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  const isHorizontal = Math.abs(dx) > Math.abs(dy);
  const labelY = my - (isHorizontal ? 12 : 0);
  const labelX = mx + (isHorizontal ? 0 : 8);

  return (
    <g>
      <line
        x1={p1.x}
        y1={p1.y}
        x2={p2.x}
        y2={p2.y}
        stroke={stroke}
        strokeOpacity={strokeOpacity}
        strokeWidth={strokeWidth}
        strokeDasharray={dashArray}
        markerEnd={`url(#${markerId})`}
        markerStart={edge.bidirectional ? `url(#${markerId})` : undefined}
      />
      {edge.label ? (
        <EdgeLabel
          x={labelX}
          y={labelY}
          text={edge.label}
          tone={edge.emphasis ? "accent" : "muted"}
        />
      ) : null}
    </g>
  );
}

function EdgeLabel({
  x,
  y,
  text,
  tone,
}: {
  x: number;
  y: number;
  text: string;
  tone: "muted" | "accent";
}) {
  // Render a paper-colored rect behind the text so the line doesn't
  // bleed through, then the text on top. Width estimated from char count.
  const charW = 5.6;
  const padX = 6;
  const padY = 3;
  const w = text.length * charW + padX * 2;
  const h = 18;
  const fill = tone === "accent" ? "var(--cypress-deep)" : "var(--ink-muted)";

  return (
    <g transform={`translate(${x}, ${y})`}>
      <rect
        x={-w / 2}
        y={-h / 2}
        width={w}
        height={h}
        rx={2}
        ry={2}
        fill="var(--paper-deep)"
      />
      <text
        x={0}
        y={padY}
        textAnchor="middle"
        fontSize={10.5}
        className="font-mono"
        fill={fill}
        letterSpacing="0.04em"
      >
        {text}
      </text>
    </g>
  );
}

/**
 * Wrap text to a target line length without breaking words. Hard cap on
 * line count; final line truncates with an ellipsis if needed.
 */
function wrapText(text: string, maxChars: number, maxLines: number): string[] {
  if (!text) return [];
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length <= maxChars) {
      current = candidate;
    } else {
      if (current) lines.push(current);
      current = word;
      if (lines.length === maxLines) {
        // Final line will truncate below; stop accumulating.
        current = "";
        break;
      }
    }
  }
  if (current) lines.push(current);

  if (lines.length > maxLines) {
    const head = lines.slice(0, maxLines - 1);
    const last = lines.slice(maxLines - 1).join(" ");
    head.push(
      last.length > maxChars ? `${last.slice(0, maxChars - 1)}…` : last,
    );
    return head;
  }
  return lines;
}

/**
 * Compute line endpoints clipped to the rectangular node boundaries so
 * arrow markers sit at the box edge instead of behind it.
 */
function clipEndpoints(a: Positioned, b: Positioned) {
  const halfW = NODE_W / 2;
  const halfH = NODE_H / 2;
  return {
    p1: clipToBox(a.x, a.y, b.x, b.y, halfW, halfH),
    p2: clipToBox(b.x, b.y, a.x, a.y, halfW, halfH),
  };
}

/**
 * Find the point on segment (cx,cy)->(tx,ty) that lies on the rectangle
 * centered at (cx,cy) with half-width hw and half-height hh. Used to
 * pull edge endpoints back to node boundaries.
 */
function clipToBox(
  cx: number,
  cy: number,
  tx: number,
  ty: number,
  hw: number,
  hh: number,
) {
  const dx = tx - cx;
  const dy = ty - cy;
  if (dx === 0 && dy === 0) return { x: cx, y: cy };

  const tX = dx === 0 ? Infinity : Math.abs(hw / dx);
  const tY = dy === 0 ? Infinity : Math.abs(hh / dy);
  const t = Math.min(tX, tY);

  return { x: cx + dx * t, y: cy + dy * t };
}

/**
 * Position nodes by role lookup. Unknown roles fall back to evenly spaced
 * positions on a circle inscribed in the viewBox so the component still
 * renders something defensible if a different article passes new role
 * tokens.
 */
function layoutNodes(nodes: PodNode[]): Positioned[] {
  const unmappedIndices: number[] = [];
  const positioned: Positioned[] = nodes.map((node, i) => {
    const known = ROLE_POSITIONS[node.role];
    if (known) return { ...node, x: known.x, y: known.y };
    unmappedIndices.push(i);
    return { ...node, x: 0, y: 0 };
  });

  if (unmappedIndices.length > 0) {
    const cx = VBW / 2;
    const cy = VBH / 2;
    const r = Math.min(VBW, VBH) / 2 - 100;
    const n = unmappedIndices.length;
    unmappedIndices.forEach((idx, k) => {
      const angle = (2 * Math.PI * k) / n - Math.PI / 2;
      positioned[idx].x = cx + r * Math.cos(angle);
      positioned[idx].y = cy + r * Math.sin(angle);
    });
  }

  return positioned;
}
