"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ThemeToggle } from "./ThemeToggle";

export function ArticleHeader() {
  const [thin, setThin] = useState(false);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        setThin(window.scrollY > 120);
        raf = 0;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      data-thin={thin || undefined}
      className="
        no-print sticky top-0 z-40
        bg-[color:var(--paper)]
        border-b border-[color:var(--hairline)]
        h-[56px]
      "
    >
      <div className="mx-auto h-full max-w-[88rem] px-6 sm:px-10 flex items-center justify-between">
        <Link
          href="/"
          aria-label="Typecast Data AI, home"
          className="
            font-mono text-[15px] tracking-tight
            text-[color:var(--ink)]
            inline-flex items-baseline gap-[2px]
            transition-colors duration-150
            hover:text-[color:var(--brick-deep)]
          "
        >
          <span>typecast</span>
          <span aria-hidden className="text-[color:var(--brick)]">.</span>
        </Link>

        <div className="flex items-center gap-6 sm:gap-8">
          <nav
            aria-label="Site"
            data-thin={thin || undefined}
            className="
              font-mono text-[12px] sm:text-[13px] uppercase tracking-[0.08em]
              flex items-center gap-4 sm:gap-7
              opacity-100 data-[thin]:opacity-0
              data-[thin]:pointer-events-none
              transition-opacity duration-200 ease-out
            "
            style={{
              transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
            }}
          >
            {[
              { label: "Archive", href: "/archive", mobile: true },
              { label: "About", href: "/about", mobile: true },
              { label: "Feed", href: "/feed.xml", mobile: false },
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                className={[
                  "text-[color:var(--ink-muted)]",
                  "transition-colors duration-150",
                  "hover:text-[color:var(--brick-deep)]",
                  item.mobile ? "" : "hidden sm:inline",
                ].join(" ")}
              >
                {item.label}
              </a>
            ))}
          </nav>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
