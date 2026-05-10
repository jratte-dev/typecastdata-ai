import * as React from "react";

/**
 * SeatTimeBudget — for each role, two side-by-side columns showing the
 * activities that fill the seat today versus tomorrow. Today segments may
 * carry explicit `weight` numbers (treated as percentages) which control
 * the block heights; when no weights are set, segments split the column
 * height evenly. Tomorrow columns always render evenly, because the
 * argument the visual makes is "the work changes," not "the hour count
 * changes."
 *
 * Designed for the consulting-pod-under-AI-tooling article. Works for any
 * before/after activity comparison where the editorial point is qualitative
 * shift across roles.
 */

export type Segment = {
  /** Activity label rendered inside the segment block. */
  label: string;
  /** Percentage 0-100. Optional. When omitted, evenly splits the column. */
  weight?: number;
  /** Optional small note rendered under the label. */
  note?: string;
};

export type Role = {
  /** Role name rendered as the row header. */
  name: string;
  /** Today's activities for this seat. */
  today: Segment[];
  /** Tomorrow's activities for this seat. */
  tomorrow: Segment[];
  /** Optional caveat rendered under the tomorrow column. */
  tomorrowNote?: string;
};

export type SeatTimeBudgetProps = {
  title?: string;
  subtitle?: string;
  roles: Role[];
  caption?: React.ReactNode;
};

export function SeatTimeBudget({
  title,
  subtitle,
  roles,
  caption,
}: SeatTimeBudgetProps) {
  // Constrained to article body width because the content is text-dense.
  // Two columns side by side per role; activities stacked vertically
  // within each column with heights proportional to weight.
  return (
    <figure className="my-12">
      <div className="bg-[color:var(--paper-deep)] border-y border-[color:var(--hairline)] px-4 sm:px-8 py-10">
        <div className="max-w-[42rem] mx-auto">
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

          <div className="space-y-12">
            {roles.map((role) => (
              <RoleRow key={role.name} role={role} />
            ))}
          </div>
        </div>
      </div>
      {caption ? (
        <figcaption className="mt-3 font-mono text-[12px] leading-[1.5] text-[color:var(--ink-muted)] max-w-[68ch]">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

function RoleRow({ role }: { role: Role }) {
  return (
    <div>
      <div className="font-mono text-[13px] uppercase tracking-[0.12em] text-[color:var(--ink)] mb-4 pb-2 border-b border-[color:var(--hairline)]">
        {role.name}
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-5">
        <Column label="Today" segments={role.today} tone="muted" />
        <Column
          label="Tomorrow"
          segments={role.tomorrow}
          tone="accent"
          forceEven
          note={role.tomorrowNote}
        />
      </div>
    </div>
  );
}

function Column({
  label,
  segments,
  tone,
  forceEven = false,
  note,
}: {
  label: string;
  segments: Segment[];
  tone: "muted" | "accent";
  forceEven?: boolean;
  note?: string;
}) {
  const weights = computeWeights(segments, forceEven);

  const borderColor =
    tone === "accent" ? "var(--cypress)" : "var(--ink-muted)";
  const fillColor =
    tone === "accent"
      ? "color-mix(in oklch, var(--cypress) 6%, var(--paper))"
      : "color-mix(in oklch, var(--ink-muted) 4%, var(--paper))";
  const textColor =
    tone === "accent" ? "var(--cypress-deep)" : "var(--ink)";
  const headerColor =
    tone === "accent" ? "var(--cypress-deep)" : "var(--ink-muted)";

  return (
    <div className="flex flex-col">
      <div
        className="font-mono text-[10px] uppercase tracking-[0.16em] mb-2"
        style={{ color: headerColor }}
      >
        {label}
      </div>
      <div
        className="flex flex-col rounded-sm overflow-hidden"
        style={{
          minHeight: "22rem",
          border: `1px solid ${borderColor}`,
          background: fillColor,
        }}
      >
        {segments.map((seg, i) => {
          const isLast = i === segments.length - 1;
          const showWeight = !forceEven && seg.weight !== undefined;
          return (
            <div
              key={i}
              className="px-3 py-2.5 flex items-start justify-between gap-2"
              style={{
                flexGrow: weights[i],
                flexShrink: 0,
                flexBasis: 0,
                minHeight: "3rem",
                borderBottom: isLast
                  ? "none"
                  : `1px solid ${borderColor}`,
              }}
            >
              <div className="flex-1 min-w-0">
                <div
                  className="font-mono text-[11px] leading-[1.4] break-words"
                  style={{ color: textColor }}
                >
                  {seg.label}
                </div>
                {seg.note ? (
                  <p className="font-mono text-[10px] leading-[1.4] mt-1 italic m-0 break-words text-[color:var(--ink-muted)]">
                    {seg.note}
                  </p>
                ) : null}
              </div>
              {showWeight ? (
                <div
                  className="font-mono text-[10px] tabular-nums shrink-0 mt-0.5"
                  style={{ color: "var(--ink-muted)" }}
                >
                  {seg.weight}%
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
      {note ? (
        <p className="mt-2 font-mono text-[11px] leading-[1.5] text-[color:var(--ink-muted)] italic">
          {note}
        </p>
      ) : null}
    </div>
  );
}

/**
 * Resolve segment weight values used by flex-grow on each block. If
 * forceEven, all 1 (equal heights). Otherwise:
 *   - When all segments have explicit weights, return them as-is.
 *   - When some are unweighted, distribute (100 - explicitTotal) evenly.
 *   - When none are weighted, all equal.
 */
function computeWeights(segments: Segment[], forceEven: boolean): number[] {
  const n = segments.length;
  if (n === 0) return [];
  if (forceEven) return segments.map(() => 1);

  const explicitTotal = segments.reduce(
    (acc, s) => acc + (s.weight ?? 0),
    0,
  );
  const unweightedCount = segments.filter(
    (s) => s.weight === undefined,
  ).length;

  if (unweightedCount === 0) {
    if (explicitTotal === 0) return segments.map(() => 1);
    return segments.map((s) => s.weight ?? 0);
  }

  const remainder = Math.max(0, 100 - explicitTotal);
  const perUnweighted = remainder / unweightedCount;
  return segments.map((s) =>
    s.weight !== undefined ? s.weight : perUnweighted,
  );
}
