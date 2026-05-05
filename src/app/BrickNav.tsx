import { ThemeToggle } from "./article/ThemeToggle";

export function BrickNav({ rubric }: { rubric: string }) {
  return (
    <div className="border-b border-[color:var(--hairline-on-brick)]">
      <div className="mx-auto max-w-[88rem] h-[56px] px-6 sm:px-10 flex items-center justify-between">
        <span
          className="
            font-mono text-[12px] uppercase tracking-[0.16em]
            text-[color:var(--paper-on-brick-muted)]
          "
        >
          {rubric}
        </span>

        <div className="flex items-center gap-6 sm:gap-8">
          <nav
            aria-label="Site"
            className="font-mono text-[13px] uppercase tracking-[0.08em] hidden sm:flex items-center gap-7"
          >
            {[
              { label: "Home", href: "/" },
              { label: "Archive", href: "/archive" },
              { label: "About", href: "/about" },
              { label: "Feed", href: "/feed.xml" },
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="
                  text-[color:var(--paper-on-brick-muted)]
                  transition-colors duration-150
                  hover:text-[color:var(--paper-on-brick)]
                "
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
