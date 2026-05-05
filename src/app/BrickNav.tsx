import { ThemeToggle } from "./article/ThemeToggle";

export function BrickNav({ rubric }: { rubric: string }) {
  return (
    <div className="border-b border-[color:var(--hairline-on-brick)]">
      <div className="mx-auto max-w-[88rem] h-[56px] px-6 sm:px-10 flex items-center justify-between gap-4">
        <span
          className="
            hidden sm:inline-block
            font-mono text-[12px] uppercase tracking-[0.16em]
            text-[color:var(--paper-on-brick-muted)]
            truncate
          "
        >
          {rubric}
        </span>

        <div className="flex items-center gap-4 sm:gap-8 ml-auto">
          <nav
            aria-label="Site"
            className="font-mono text-[12px] sm:text-[13px] uppercase tracking-[0.08em] flex items-center gap-4 sm:gap-7"
          >
            {[
              { label: "Home", href: "/", mobile: true },
              { label: "Archive", href: "/archive", mobile: true },
              { label: "About", href: "/about", mobile: true },
              { label: "Feed", href: "/feed.xml", mobile: false },
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                className={[
                  "text-[color:var(--paper-on-brick-muted)]",
                  "transition-colors duration-150",
                  "hover:text-[color:var(--paper-on-brick)]",
                  item.mobile ? "" : "hidden sm:inline",
                ].join(" ")}
              >
                {item.label}
              </a>
            ))}
          </nav>
          <ThemeToggle tone="brick" />
        </div>
      </div>
    </div>
  );
}
