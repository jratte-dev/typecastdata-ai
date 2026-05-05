"use client";

import { useEffect, useState } from "react";

type Mode = "light" | "dark";
type Tone = "ink" | "brick";

function readInitialMode(): Mode {
  if (typeof document === "undefined") return "light";
  const attr = document.documentElement.getAttribute("data-theme");
  if (attr === "light" || attr === "dark") return attr;
  return "light";
}

export function ThemeToggle({ tone = "ink" }: { tone?: Tone }) {
  const [mode, setMode] = useState<Mode>(readInitialMode);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", mode);
    try {
      window.localStorage.setItem("theme", mode);
    } catch {}
  }, [mode]);

  const onBrick = tone === "brick";
  const borderClass = onBrick
    ? "border-[color:var(--hairline-on-brick)]"
    : "border-[color:var(--hairline)]";
  const inactiveClass = onBrick
    ? "text-[color:var(--paper-on-brick-muted)] hover:text-[color:var(--paper-on-brick)]"
    : "text-[color:var(--ink-muted)] hover:text-[color:var(--brick-deep)]";
  const activeClass = onBrick
    ? "bg-[color:var(--paper-on-brick)] text-[color:var(--brick-band)]"
    : "bg-[color:var(--ink)] text-[color:var(--paper)]";
  const dividerClass = onBrick
    ? "border-r border-[color:var(--hairline-on-brick)]"
    : "border-r border-[color:var(--hairline)]";

  return (
    <div
      role="group"
      aria-label="Theme"
      className={[
        "inline-flex items-stretch",
        "font-mono text-[11px] uppercase tracking-[0.1em]",
        "border h-[40px] sm:h-[32px]",
        borderClass,
      ].join(" ")}
    >
      {(["light", "dark"] as Mode[]).map((m, i) => {
        const active = mode === m;
        return (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            aria-pressed={active}
            aria-label={`Use ${m} theme`}
            className={[
              "px-3 transition-colors duration-150",
              i === 0 ? dividerClass : "",
              active ? activeClass : inactiveClass,
            ].join(" ")}
          >
            {m}
          </button>
        );
      })}
    </div>
  );
}
