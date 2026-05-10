import * as React from "react";

/**
 * Bifurcation — a premise that splits into two outcomes, optionally with
 * a cascade after either branch. Paths are drawn as inline SVG so the
 * arrows actually arrive at their boxes (no decorative stand-ins).
 *
 * Layout: HTML boxes positioned over an SVG arrow layer in a fixed
 * aspect-ratio container. The whole figure scales with width via
 * percentage-based positioning.
 */

export type BifurcationOutcome = {
  label: string;
  caption?: string;
  tone?: "good" | "bad" | "neutral";
};

export type BifurcationBranch = {
  /** Text on the arrow leaving the premise. */
  label: string;
  /** The first outcome reached from this branch. */
  outcome: BifurcationOutcome;
  /** Optional second outcome the first one cascades into. */
  cascade?: BifurcationOutcome;
};

export type BifurcationProps = {
  /** The premise that splits. Single line of text. */
  premise: string;
  leftBranch: BifurcationBranch;
  rightBranch: BifurcationBranch;
  caption?: React.ReactNode;
};

function toneStyle(tone: BifurcationOutcome["tone"]): React.CSSProperties {
  switch (tone) {
    case "good":
      return {
        background: "color-mix(in oklch, var(--cypress) 16%, var(--paper))",
        borderColor: "color-mix(in oklch, var(--cypress) 70%, transparent)",
      };
    case "bad":
      return {
        background: "color-mix(in oklch, var(--brick) 18%, var(--paper))",
        borderColor: "color-mix(in oklch, var(--brick) 70%, transparent)",
      };
    case "neutral":
    default:
      return {
        background: "var(--paper)",
        borderColor: "var(--hairline)",
      };
  }
}

function arrowColor(tone: BifurcationOutcome["tone"]): string {
  if (tone === "good") return "var(--cypress)";
  if (tone === "bad") return "var(--brick)";
  return "var(--ink-muted)";
}

export function Bifurcation({
  premise,
  leftBranch,
  rightBranch,
  caption,
}: BifurcationProps) {
  const hasCascade = !!(leftBranch.cascade || rightBranch.cascade);
  // viewBox dimensions — used for both SVG and box positioning calcs.
  const W = 800;
  const H = hasCascade ? 520 : 360;

  // Box geometry (in viewBox units)
  const PREMISE = { x: 250, y: 20, w: 300, h: 60 };
  const OUT_W = 280;
  const OUT_H = 100;
  const OUT_Y = 220;
  const LEFT = { x: 30, y: OUT_Y, w: OUT_W, h: OUT_H };
  const RIGHT = { x: W - OUT_W - 30, y: OUT_Y, w: OUT_W, h: OUT_H };

  // Cascade geometry — only used if a cascade is present
  const CASC_Y = 420;
  const LEFT_CASC = leftBranch.cascade
    ? { x: 30, y: CASC_Y, w: OUT_W, h: 70 }
    : null;
  const RIGHT_CASC = rightBranch.cascade
    ? { x: W - OUT_W - 30, y: CASC_Y, w: OUT_W, h: 70 }
    : null;

  return (
    <figure className="my-12 -mx-2 sm:mx-[-3rem] lg:mx-[-7rem]">
      <div className="bg-[color:var(--paper-deep)] border-y border-[color:var(--hairline)] px-6 sm:px-12 py-10">
        <div
          className="relative mx-auto"
          style={{ maxWidth: "44rem", aspectRatio: `${W} / ${H}` }}
        >
          <svg
            viewBox={`0 0 ${W} ${H}`}
            preserveAspectRatio="none"
            className="absolute inset-0 w-full h-full"
            aria-hidden
          >
            <defs>
              {/* Two arrowhead markers, one per branch tone. */}
              <marker
                id="arrow-left"
                viewBox="0 0 10 10"
                refX="9"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path
                  d="M 0 0 L 10 5 L 0 10 z"
                  fill={arrowColor(leftBranch.outcome.tone)}
                />
              </marker>
              <marker
                id="arrow-right"
                viewBox="0 0 10 10"
                refX="9"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path
                  d="M 0 0 L 10 5 L 0 10 z"
                  fill={arrowColor(rightBranch.outcome.tone)}
                />
              </marker>
            </defs>

            {/* Left branch arrow — premise bottom-center to left outcome top-center */}
            <line
              x1={PREMISE.x + PREMISE.w / 2}
              y1={PREMISE.y + PREMISE.h}
              x2={LEFT.x + LEFT.w / 2}
              y2={LEFT.y - 4}
              stroke={arrowColor(leftBranch.outcome.tone)}
              strokeWidth="2"
              markerEnd="url(#arrow-left)"
            />
            {/* Right branch arrow */}
            <line
              x1={PREMISE.x + PREMISE.w / 2}
              y1={PREMISE.y + PREMISE.h}
              x2={RIGHT.x + RIGHT.w / 2}
              y2={RIGHT.y - 4}
              stroke={arrowColor(rightBranch.outcome.tone)}
              strokeWidth="2"
              markerEnd="url(#arrow-right)"
            />
            {/* Cascade arrows */}
            {LEFT_CASC ? (
              <line
                x1={LEFT.x + LEFT.w / 2}
                y1={LEFT.y + LEFT.h}
                x2={LEFT_CASC.x + LEFT_CASC.w / 2}
                y2={LEFT_CASC.y - 4}
                stroke={arrowColor(leftBranch.outcome.tone)}
                strokeWidth="2"
                markerEnd="url(#arrow-left)"
              />
            ) : null}
            {RIGHT_CASC ? (
              <line
                x1={RIGHT.x + RIGHT.w / 2}
                y1={RIGHT.y + RIGHT.h}
                x2={RIGHT_CASC.x + RIGHT_CASC.w / 2}
                y2={RIGHT_CASC.y - 4}
                stroke={arrowColor(rightBranch.outcome.tone)}
                strokeWidth="2"
                markerEnd="url(#arrow-right)"
              />
            ) : null}
          </svg>

          {/* Premise box */}
          <Box
            x={PREMISE.x}
            y={PREMISE.y}
            w={PREMISE.w}
            h={PREMISE.h}
            viewW={W}
            viewH={H}
            tone="neutral"
          >
            <span className="font-sans font-medium text-[color:var(--ink)]">
              {premise}
            </span>
          </Box>

          {/* Branch labels (text on the arrows, placed mid-arrow) */}
          <ArrowLabel
            x1={PREMISE.x + PREMISE.w / 2}
            y1={PREMISE.y + PREMISE.h}
            x2={LEFT.x + LEFT.w / 2}
            y2={LEFT.y}
            viewW={W}
            viewH={H}
            text={leftBranch.label}
            tone={leftBranch.outcome.tone}
            side="left"
          />
          <ArrowLabel
            x1={PREMISE.x + PREMISE.w / 2}
            y1={PREMISE.y + PREMISE.h}
            x2={RIGHT.x + RIGHT.w / 2}
            y2={RIGHT.y}
            viewW={W}
            viewH={H}
            text={rightBranch.label}
            tone={rightBranch.outcome.tone}
            side="right"
          />

          {/* Outcome boxes */}
          <Box
            x={LEFT.x}
            y={LEFT.y}
            w={LEFT.w}
            h={LEFT.h}
            viewW={W}
            viewH={H}
            tone={leftBranch.outcome.tone}
          >
            <OutcomeContent outcome={leftBranch.outcome} />
          </Box>
          <Box
            x={RIGHT.x}
            y={RIGHT.y}
            w={RIGHT.w}
            h={RIGHT.h}
            viewW={W}
            viewH={H}
            tone={rightBranch.outcome.tone}
          >
            <OutcomeContent outcome={rightBranch.outcome} />
          </Box>

          {/* Cascade boxes */}
          {LEFT_CASC && leftBranch.cascade ? (
            <Box
              x={LEFT_CASC.x}
              y={LEFT_CASC.y}
              w={LEFT_CASC.w}
              h={LEFT_CASC.h}
              viewW={W}
              viewH={H}
              tone={leftBranch.cascade.tone}
              terminal
            >
              <OutcomeContent outcome={leftBranch.cascade} />
            </Box>
          ) : null}
          {RIGHT_CASC && rightBranch.cascade ? (
            <Box
              x={RIGHT_CASC.x}
              y={RIGHT_CASC.y}
              w={RIGHT_CASC.w}
              h={RIGHT_CASC.h}
              viewW={W}
              viewH={H}
              tone={rightBranch.cascade.tone}
              terminal
            >
              <OutcomeContent outcome={rightBranch.cascade} />
            </Box>
          ) : null}
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

function Box({
  x,
  y,
  w,
  h,
  viewW,
  viewH,
  tone,
  terminal,
  children,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  viewW: number;
  viewH: number;
  tone: BifurcationOutcome["tone"];
  terminal?: boolean;
  children: React.ReactNode;
}) {
  const style: React.CSSProperties = {
    position: "absolute",
    left: `${(x / viewW) * 100}%`,
    top: `${(y / viewH) * 100}%`,
    width: `${(w / viewW) * 100}%`,
    height: `${(h / viewH) * 100}%`,
    borderWidth: terminal ? "2px" : "1px",
    borderStyle: "solid",
    ...toneStyle(tone),
  };
  return (
    <div
      className="rounded-sm flex items-center justify-center px-3 text-center"
      style={style}
    >
      {children}
    </div>
  );
}

function OutcomeContent({ outcome }: { outcome: BifurcationOutcome }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="font-sans font-medium text-[15px] sm:text-[16px] text-[color:var(--ink)] leading-[1.25]">
        {outcome.label}
      </span>
      {outcome.caption ? (
        <span className="font-mono text-[10px] sm:text-[11px] text-[color:var(--ink-muted)]">
          {outcome.caption}
        </span>
      ) : null}
    </div>
  );
}

function ArrowLabel({
  x1,
  y1,
  x2,
  y2,
  viewW,
  viewH,
  text,
  tone,
  side,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  viewW: number;
  viewH: number;
  text: string;
  tone: BifurcationOutcome["tone"];
  side: "left" | "right";
}) {
  const cx = (x1 + x2) / 2;
  const cy = (y1 + y2) / 2;
  const color = arrowColor(tone);
  return (
    <div
      className="absolute font-mono text-[11px] leading-[1.2] whitespace-nowrap pointer-events-none"
      style={{
        left: `${(cx / viewW) * 100}%`,
        top: `${(cy / viewH) * 100}%`,
        transform: side === "left"
          ? "translate(calc(-100% - 4px), -50%)"
          : "translate(4px, -50%)",
        color,
      }}
    >
      {text}
    </div>
  );
}
