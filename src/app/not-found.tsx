import Link from "next/link";
import { ThemeToggle } from "./article/ThemeToggle";
import { SiteFooter } from "./SiteFooter";

export default function NotFound() {
  return (
    <div className="bg-[color:var(--paper)] text-[color:var(--ink)] min-h-full flex flex-col">
      <NotFoundHeader />

      <main
        id="main"
        className="flex-1 px-6 sm:px-10 max-w-[88rem] mx-auto w-full pt-24 sm:pt-32 pb-24"
      >
        <div className="max-w-[58ch] mx-auto">
          <div className="font-mono text-[12px] uppercase tracking-[0.16em] text-[color:var(--ink-muted)] mb-6">
            <span className="text-[color:var(--brick-deep)]">404</span>
            <span aria-hidden className="mx-2 text-[color:var(--hairline)]">·</span>
            Not found
          </div>

          <h1
            className="
              font-sans font-semibold tracking-[-0.018em]
              text-[color:var(--ink)]
              leading-[1.1]
              text-[clamp(2rem,4.5vw,3rem)]
              max-w-[24ch]
            "
          >
            That post does not exist, or never did.
          </h1>

          <p className="mt-4 text-[18px] leading-[1.55] text-[color:var(--ink-muted)] max-w-[52ch]">
            Possibly retired. Possibly never written. Possibly a typo on the
            way in. Either way, the place you are trying to read is not the
            place this URL points to.
          </p>

          <RecoveryRail />
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}

/* -------------------------------------------------------------- *
 * Quiet header (paper, not brick)
 * -------------------------------------------------------------- */

function NotFoundHeader() {
  return (
    <header className="border-b border-[color:var(--hairline)] h-[56px] flex-shrink-0">
      <div className="mx-auto max-w-[88rem] h-full px-6 sm:px-10 flex items-center justify-between">
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

/* -------------------------------------------------------------- *
 * Recovery rail
 * -------------------------------------------------------------- */

function RecoveryRail() {
  const rows = [
    { label: "Home", href: "/", value: "the front page" },
    { label: "Archive", href: "/archive", value: "everything I have written" },
    { label: "Latest post", href: "/article", value: "what is on top right now" },
  ];
  return (
    <nav
      aria-label="Recovery"
      className="mt-12 border-t border-[color:var(--hairline)]"
    >
      <ul className="divide-y divide-[color:var(--hairline)]">
        {rows.map((row) => (
          <li key={row.label}>
            <Link
              href={row.href}
              className="
                grid grid-cols-[10rem_1fr_auto] gap-4 items-baseline
                py-4 group
                transition-colors duration-150
              "
            >
              <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-[color:var(--ink-muted)]">
                {row.label}
              </span>
              <span className="text-[16px] sm:text-[17px] text-[color:var(--ink)] group-hover:text-[color:var(--brick-deep)] transition-colors duration-150">
                {row.value}
              </span>
              <span
                aria-hidden
                className="font-mono text-[14px] text-[color:var(--ink-muted)] group-hover:text-[color:var(--brick-deep)] transition-[color,transform] duration-200 group-hover:translate-x-1"
                style={{ transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)" }}
              >
                →
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
