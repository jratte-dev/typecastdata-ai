import * as React from "react";

/**
 * CycleComparison — two development cycles side by side, rendered as
 * tracks of wheel icons. Each wheel represents one completed cycle (one
 * full "rotation" of build/test/ship). Both tracks span the same
 * horizontal extent (= the same time window, the same effort budget),
 * so the visible difference IS the argument: same effort in, more
 * cycles complete on the rapid track.
 *
 * Designed for the "rapid prototyping with agents" argument, but the
 * shape is general — any time you want to argue "same input, more
 * iterations, more progress" this component fits.
 */

export type CycleData = {
  /** Short label for this cycle (e.g., "Traditional cycle"). */
  label: string;
  /** How many full cycles complete inside the time window. */
  iterations: number;
  /** Word for the count (default "iterations"). */
  iterationName?: string;
  /** Optional one-liner under the track. */
  caption?: string;
};

export type CycleComparisonProps = {
  /** Optional title above the tracks. */
  title?: string;
  /** Optional subtitle (sentence). */
  subtitle?: string;
  /** The "less" cycle — typically rendered in muted ink. */
  baseline: CycleData;
  /** The "more" cycle — typically rendered in cypress accent. */
  accelerated: CycleData;
  /** Optional figcaption below the figure. */
  caption?: React.ReactNode;
};

export function CycleComparison({
  title,
  subtitle,
  baseline,
  accelerated,
  caption,
}: CycleComparisonProps) {
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
            <p className="font-sans text-[15px] sm:text-[16px] leading-[1.45] text-[color:var(--ink)] mb-10 max-w-[60ch]">
              {subtitle}
            </p>
          ) : null}

          <div className="space-y-10">
            <Track cycle={baseline} tone="muted" />
            <Track cycle={accelerated} tone="accent" />
          </div>
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

function Track({
  cycle,
  tone,
}: {
  cycle: CycleData;
  tone: "muted" | "accent";
}) {
  // viewBox dimensions — chosen so each wheel renders at a comfortable
  // size when the SVG fills typical article-figure widths (700-900px).
  const VBW = 1000;
  const VBH = 60;
  const MARGIN = 24;
  const TRACK_Y = 30;
  const WHEEL_R = 14;

  const color = tone === "accent" ? "var(--cypress)" : "var(--ink-muted)";
  const fillColor =
    tone === "accent"
      ? "color-mix(in oklch, var(--cypress) 16%, var(--paper))"
      : "color-mix(in oklch, var(--ink-muted) 12%, var(--paper))";

  const positions = wheelPositions(cycle.iterations, MARGIN, VBW - MARGIN);
  const iterName = cycle.iterationName ?? "iterations";

  return (
    <div>
      <div className="flex items-baseline justify-between mb-3 gap-4">
        <span className="font-mono text-[12px] uppercase tracking-[0.12em] text-[color:var(--ink)]">
          {cycle.label}
        </span>
        <span
          className="font-mono text-[11px] tabular-nums"
          style={{ color }}
        >
          {cycle.iterations} {iterName}
        </span>
      </div>
      <svg
        viewBox={`0 0 ${VBW} ${VBH}`}
        className="w-full"
        role="img"
        aria-label={`${cycle.label}: ${cycle.iterations} ${iterName}`}
      >
        {/* Track line */}
        <line
          x1={MARGIN}
          y1={TRACK_Y}
          x2={VBW - MARGIN}
          y2={TRACK_Y}
          stroke="color-mix(in oklch, var(--ink-muted) 28%, transparent)"
          strokeWidth="1"
        />
        {/* Wheels — each = one completed cycle */}
        {positions.map((x, i) => (
          <Wheel
            key={i}
            cx={x}
            cy={TRACK_Y}
            r={WHEEL_R}
            color={color}
            fill={fillColor}
          />
        ))}
      </svg>
      {cycle.caption ? (
        <p className="mt-3 font-mono text-[11px] leading-[1.5] text-[color:var(--ink-muted)] max-w-[60ch]">
          {cycle.caption}
        </p>
      ) : null}
    </div>
  );
}

function Wheel({
  cx,
  cy,
  r,
  color,
  fill,
}: {
  cx: number;
  cy: number;
  r: number;
  color: string;
  fill: string;
}) {
  // Spokes — two diameters, makes the wheel readable as a wheel.
  const inset = r * 0.32; // pull spokes in slightly so they don't touch the edge
  return (
    <g>
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill={fill}
        stroke={color}
        strokeWidth="1.5"
      />
      <line
        x1={cx - r + inset}
        y1={cy}
        x2={cx + r - inset}
        y2={cy}
        stroke={color}
        strokeWidth="1"
      />
      <line
        x1={cx}
        y1={cy - r + inset}
        x2={cx}
        y2={cy + r - inset}
        stroke={color}
        strokeWidth="1"
      />
    </g>
  );
}

/**
 * Compute evenly-spaced wheel x positions across the usable track width.
 * One iteration -> single wheel at left start (it just happened, hasn't
 * gone anywhere yet). Two or more -> evenly spaced from start to end.
 */
function wheelPositions(n: number, xStart: number, xEnd: number): number[] {
  if (n <= 0) return [];
  if (n === 1) return [xStart];
  const step = (xEnd - xStart) / (n - 1);
  return Array.from({ length: n }, (_, i) => xStart + i * step);
}
