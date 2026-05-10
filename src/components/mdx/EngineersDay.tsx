import * as React from "react";

/**
 * EngineersDay — a before/after grid of an engineer's working hours.
 *
 * Renders two rows of cells (default 9 hours each). Each cell carries an
 * activity (code, debug, lunch, eval, review, judge, context). Cells are
 * colored by activity family so that "BEFORE" and "AFTER" rows produce
 * a visible compositional shift — the article's argument made geometric.
 *
 * Used as a structural argument, not decoration. If a draft uses this
 * component, the activities arrays should encode something the author
 * actually wants to claim about how time gets spent.
 */

export type DayActivity =
  | "code"
  | "debug"
  | "lunch"
  | "eval"
  | "review"
  | "judge"
  | "context";

type ActivityDef = {
  label: string;
  family: "cool" | "neutral" | "cypress" | "brick";
  intensity: 1 | 2 | 3;
};

const ACTIVITY_DEFS: Record<DayActivity, ActivityDef> = {
  code:    { label: "code",    family: "cool",    intensity: 2 },
  debug:   { label: "debug",   family: "cool",    intensity: 3 },
  lunch:   { label: "lunch",   family: "neutral", intensity: 1 },
  eval:    { label: "eval",    family: "cypress", intensity: 2 },
  review:  { label: "review",  family: "cypress", intensity: 1 },
  judge:   { label: "judge",   family: "brick",   intensity: 3 },
  context: { label: "context", family: "cypress", intensity: 3 },
};

function cellStyle(activity: DayActivity): React.CSSProperties {
  const def = ACTIVITY_DEFS[activity];
  switch (def.family) {
    case "neutral":
      return {
        background: "var(--paper)",
        borderStyle: "dashed",
        borderWidth: "1px",
        borderColor: "var(--hairline)",
      };
    case "cool": {
      const opacity = def.intensity === 2 ? 30 : 55;
      return {
        background: "var(--paper-deep)",
        borderWidth: "1px",
        borderStyle: "solid",
        borderColor: `color-mix(in oklch, var(--ink-muted) ${opacity}%, transparent)`,
      };
    }
    case "cypress": {
      const bgOp = def.intensity === 1 ? 8 : def.intensity === 2 ? 16 : 28;
      const borderOp = def.intensity === 1 ? 35 : def.intensity === 2 ? 60 : 85;
      return {
        background: `color-mix(in oklch, var(--cypress) ${bgOp}%, var(--paper))`,
        borderWidth: "1px",
        borderStyle: "solid",
        borderColor: `color-mix(in oklch, var(--cypress) ${borderOp}%, transparent)`,
      };
    }
    case "brick": {
      const bgOp = def.intensity === 1 ? 10 : def.intensity === 2 ? 20 : 32;
      const borderOp = def.intensity === 1 ? 35 : def.intensity === 2 ? 60 : 85;
      return {
        background: `color-mix(in oklch, var(--brick) ${bgOp}%, var(--paper))`,
        borderWidth: "1px",
        borderStyle: "solid",
        borderColor: `color-mix(in oklch, var(--brick) ${borderOp}%, transparent)`,
      };
    }
  }
}

const DEFAULT_HOURS = ["9", "10", "11", "12", "1", "2", "3", "4", "5"];

export type EngineersDayProps = {
  before: DayActivity[];
  after: DayActivity[];
  hours?: string[];
  beforeLabel?: string;
  afterLabel?: string;
  beforeYear?: string;
  afterYear?: string;
  subtitle?: string;
  caption?: React.ReactNode;
};

export function EngineersDay({
  before,
  after,
  hours = DEFAULT_HOURS,
  beforeLabel = "BEFORE",
  afterLabel = "AFTER",
  beforeYear,
  afterYear,
  subtitle,
  caption,
}: EngineersDayProps) {
  if (before.length !== after.length || before.length !== hours.length) {
    console.warn(
      "[EngineersDay] before/after/hours arrays must be the same length"
    );
  }
  const used = Array.from(new Set([...before, ...after]));
  return (
    <figure className="my-12 -mx-2 sm:mx-[-3rem] lg:mx-[-7rem]">
      <div className="bg-[color:var(--paper-deep)] border-y border-[color:var(--hairline)] px-6 sm:px-12 py-10">
        <div className="max-w-[64rem] mx-auto">
          {subtitle ? (
            <p className="font-mono text-[12px] leading-[1.5] text-[color:var(--ink-muted)] mb-8 max-w-[60ch]">
              {subtitle}
            </p>
          ) : null}

          {/* Hour-label header row */}
          <div
            className="grid gap-1 sm:gap-2 mb-2"
            style={{
              gridTemplateColumns: `7ch repeat(${hours.length}, minmax(0, 1fr))`,
            }}
          >
            <div />
            {hours.map((h, i) => (
              <div
                key={i}
                className="font-mono text-[11px] text-[color:var(--ink-muted)] text-center"
              >
                {h}
              </div>
            ))}
          </div>

          <Row
            label={beforeLabel}
            year={beforeYear}
            activities={before}
            cols={hours.length}
          />
          <Row
            label={afterLabel}
            year={afterYear}
            activities={after}
            cols={hours.length}
          />

          {/* Legend */}
          <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2 font-mono text-[11px] text-[color:var(--ink-muted)]">
            {used.map((a) => (
              <div key={a} className="flex items-center gap-2">
                <span
                  className="inline-block w-3 h-3"
                  style={cellStyle(a)}
                  aria-hidden
                />
                <span>{ACTIVITY_DEFS[a].label}</span>
              </div>
            ))}
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

function Row({
  label,
  year,
  activities,
  cols,
}: {
  label: string;
  year?: string;
  activities: DayActivity[];
  cols: number;
}) {
  return (
    <div
      className="grid gap-1 sm:gap-2 mb-3"
      style={{
        gridTemplateColumns: `7ch repeat(${cols}, minmax(0, 1fr))`,
      }}
    >
      <div className="flex flex-col justify-center">
        <span className="font-mono text-[11px] text-[color:var(--ink)]">
          {label}
        </span>
        {year ? (
          <span className="font-mono text-[10px] text-[color:var(--ink-muted)]">
            {year}
          </span>
        ) : null}
      </div>
      {activities.map((a, i) => (
        <Cell key={i} activity={a} />
      ))}
    </div>
  );
}

function Cell({ activity }: { activity: DayActivity }) {
  const def = ACTIVITY_DEFS[activity];
  return (
    <div
      className="h-12 sm:h-14 flex items-center justify-center font-mono text-[10px] sm:text-[11px] text-[color:var(--ink)]"
      style={cellStyle(activity)}
    >
      {def.label}
    </div>
  );
}
