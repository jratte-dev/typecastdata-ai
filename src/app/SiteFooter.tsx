export function SiteFooter() {
  return (
    <footer
      className="
        no-print
        border-t border-[color:var(--hairline)]
        py-8
      "
    >
      <div className="mx-auto max-w-[88rem] px-6 sm:px-10 flex flex-col sm:flex-row gap-2 sm:gap-6 items-baseline justify-between">
        <span className="font-mono text-[12px] uppercase tracking-[0.12em] text-[color:var(--ink-muted)]">
          © 2026 John Ratté · New Orleans
        </span>
        <span className="font-mono text-[12px] tracking-tight text-[color:var(--ink-muted)] inline-flex items-baseline">
          typecast<span className="text-[color:var(--brick)]">.</span>
        </span>
      </div>
    </footer>
  );
}
