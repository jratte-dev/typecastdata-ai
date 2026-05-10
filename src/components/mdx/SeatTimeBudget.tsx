import * as React from "react";

/**
 * SeatTimeBudget — for each role, two stacked horizontal bars showing the
 * activities that fill the seat today versus tomorrow. Today segments may
 * carry explicit `weight` numbers (treated as percentages); when no weights
 * are set, segments split evenly. Tomorrow segments always render evenly,
 * because the argument the visual makes is "the work changes," not "the
 * hour count changes."
 *
 * Designed for the consulting-pod-under-AI-tooling article. Works for any
 * before/after activity comparison where the editorial point is qualitative
 * shift across roles.
 */

export type Segment = {
  /** Activity label rendered inside the segment. */
  label: string;
  /** Percentage 0-100. Optional. When omitted, evenly splits the bar. */
  weight?: number;
  /** Optional small note rendered under the segment. */
  note?: string;
};

export type Role = {
  /** Role name rendered as the row header. */
  name: string;
  /** Today's activities for this seat. */
  today: Segment[];
  /** Tomorrow's activities for this seat. */
  tomorrow: Segment[];
  /** Optional caveat rendered under the tomorrow bar. */
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
  // Note on width: this component is text-dense (three rows of segmented
  // bars with labels inside each segment) and reads poorly when stretched
  // to the full-bleed width that the SVG-driven figures use. Sized to
  // article body width with a tight inner max so segment labels stay near
  // their natural reading length.
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

      <div className="grid grid-cols-[5.5rem_1fr] gap-x-4 gap-y-5 items-start">
        <RowLabel text="Today" />
        <Bar segments={role.today} tone="muted" />

        <RowLabel text="Tomorrow" tone="accent" />
        <div>
          <Bar segments={role.tomorrow} tone="accent" forceEven />
          {role.tomorrowNote ? (
            <p className="mt-2 font-mono text-[11px] leading-[1.5] text-[color:var(--ink-muted)] italic">
              {role.tomorrowNote}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function RowLabel({
  text,
  tone = "muted",
}: {
  text: string;
  tone?: "muted" | "accent";
}) {
  const color =
    tone === "accent" ? "var(--cypress-deep)" : "var(--ink-muted)";
  return (
    <div
      className="font-mono text-[10px] uppercase tracking-[0.16em] pt-2"
      style={{ color }}
    >
      {text}
    </div>
  );
}

function Bar({
  segments,
  tone,
  forceEven = false,
}: {
  segments: Segment[];
  tone: "muted" | "accent";
  forceEven?: boolean;
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

  return (
    <div>
      <div
        className="flex w-full overflow-hidden rounded-sm"
        style={{
          border: `1px solid ${borderColor}`,
          background: fillColor,
        }}
      >
        {segments.map((seg, i) => {
          const isLast = i === segments.length - 1;
          const w = weights[i];
          const showWeight = !forceEven && seg.weight !== undefined;
          return (
            <div
              key={i}
              className="px-2.5 py-2.5 flex flex-col"
              style={{
                flexBasis: `${w}%`,
                flexGrow: 0,
                flexShrink: 0,
                borderRight: isLast ? "none" : `1px solid ${borderColor}`,
              }}
            >
              <div
                className="font-mono text-[11px] leading-[1.35] break-words hyphens-auto"
                style={{ color: textColor }}
              >
                {seg.label}
              </div>
              {showWeight ? (
                <div
                  className="font-mono text-[10px] tabular-nums mt-1"
                  style={{ color: "var(--ink-muted)" }}
                >
                  {seg.weight}%
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
      <SegmentNotes segments={segments} weights={weights} />
    </div>
  );
}

function SegmentNotes({
  segments,
  weights,
}: {
  segments: Segment[];
  weights: number[];
}) {
  const hasAny = segments.some((s) => s.note);
  if (!hasAny) return null;
  return (
    <div className="flex w-full mt-1.5">
      {segments.map((seg, i) => (
        <div
          key={i}
          className="px-2.5"
          style={{
            flexBasis: `${weights[i]}%`,
            flexGrow: 0,
            flexShrink: 0,
          }}
        >
          {seg.note ? (
            <p className="font-mono text-[10px] leading-[1.4] text-[color:var(--ink-muted)] italic m-0 break-words">
              {seg.note}
            </p>
          ) : null}
        </div>
      ))}
    </div>
  );
}

/**
 * Resolve segment widths. If forceEven, all equal. Otherwise:
 *   - Sum the explicit weights.
 *   - Distribute (100 - sum) across unweighted segments evenly.
 *   - If everything is unweighted, all equal.
 */
function computeWeights(segments: Segment[], forceEven: boolean): number[] {
  const n = segments.length;
  if (n === 0) return [];
  if (forceEven) return segments.map(() => 100 / n);

  const explicitTotal = segments.reduce(
    (acc, s) => acc + (s.weight ?? 0),
    0,
  );
  const unweightedCount = segments.filter((s) => s.weight === undefined)
    .length;

  if (unweightedCount === 0) {
    // Normalize in case explicit weights don't sum to 100.
    if (explicitTotal === 0) return segments.map(() => 100 / n);
    return segments.map((s) => ((s.weight ?? 0) / explicitTotal) * 100);
  }

  const remainder = Math.max(0, 100 - explicitTotal);
  const perUnweighted = remainder / unweightedCount;
  return segments.map((s) => (s.weight !== undefined ? s.weight : perUnweighted));
}
