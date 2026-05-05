"use client";

import { useRef, useState } from "react";

type SubmitState = "idle" | "submitting" | "success" | "error";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function SubscribeBlock() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [state, setState] = useState<SubmitState>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const trimmed = email.trim();
  const isValid = EMAIL_RE.test(trimmed);
  const submitting = state === "submitting";
  const succeeded = state === "success";

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValid || submitting) return;
    setErrorMsg(null);
    setState("submitting");
    const start = performance.now();
    try {
      // No backend wired yet. Hold a minimum visible-pending window so the
      // state actually registers, then resolve.
      await new Promise((r) => setTimeout(r, 350));
      const elapsed = performance.now() - start;
      if (elapsed < 250) await new Promise((r) => setTimeout(r, 250 - elapsed));
      setState("success");
    } catch {
      setState("error");
      setErrorMsg("Could not file that one. Try again in a moment.");
    }
  }

  return (
    <section
      aria-labelledby="subscribe-heading"
      className="border-t border-[color:var(--hairline)] pt-10"
    >
      <h2
        id="subscribe-heading"
        className="font-mono text-[12px] uppercase tracking-[0.12em] text-[color:var(--ink-muted)] mb-4"
      >
        Subscribe
      </h2>

      <p className="text-[17px] leading-[1.6] text-[color:var(--ink)] max-w-[60ch]">
        New posts by RSS or email. No upsells, no cadence promises.{" "}
        <a
          href="/feed.xml"
          className="
            text-[color:var(--ink)] underline decoration-[color:var(--hairline)]
            decoration-1 underline-offset-[5px]
            transition-colors duration-150
            hover:text-[color:var(--brick-deep)] hover:decoration-[color:var(--brick)]
          "
        >
          RSS
        </a>{" "}
        or{" "}
        <button
          type="button"
          onClick={() => {
            const next = !open;
            setOpen(next);
            if (next) requestAnimationFrame(() => inputRef.current?.focus());
          }}
          aria-expanded={open}
          aria-controls="subscribe-form"
          className="
            text-[color:var(--ink)] underline decoration-[color:var(--hairline)]
            decoration-1 underline-offset-[5px]
            transition-colors duration-150
            hover:text-[color:var(--brick-deep)] hover:decoration-[color:var(--brick)]
          "
        >
          Email
        </button>
        .
      </p>

      <div
        id="subscribe-form"
        aria-hidden={!open}
        className="grid mt-4"
        style={{
          gridTemplateRows: open ? "1fr" : "0fr",
          opacity: open ? 1 : 0,
          transition:
            "grid-template-rows 200ms cubic-bezier(0.22, 1, 0.36, 1), opacity 200ms cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      >
        <div className="overflow-hidden">
          {succeeded ? (
            <p
              role="status"
              aria-live="polite"
              className="font-mono text-[13px] text-[color:var(--ink-muted)] py-2"
            >
              Filed. You will hear when there is something to read.
            </p>
          ) : (
            <form
              onSubmit={onSubmit}
              noValidate
              className="flex flex-col sm:flex-row gap-2 sm:items-end pt-1"
            >
              <label className="flex flex-col gap-1 flex-1">
                <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-[color:var(--ink-muted)]">
                  Email
                </span>
                <input
                  ref={inputRef}
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (state === "error") {
                      setState("idle");
                      setErrorMsg(null);
                    }
                  }}
                  aria-invalid={state === "error" || undefined}
                  aria-describedby={errorMsg ? "subscribe-error" : undefined}
                  placeholder="you@somewhere.com"
                  disabled={submitting}
                  className="
                    font-sans text-[16px] leading-[1.5]
                    bg-transparent
                    border-0 border-b border-[color:var(--hairline)]
                    px-0 py-2
                    placeholder:text-[color:var(--ink-muted)]/60
                    focus:border-[color:var(--brick)] focus:outline-none
                    disabled:opacity-60
                    transition-colors duration-150
                  "
                />
              </label>
              <button
                type="submit"
                disabled={!isValid || submitting}
                aria-busy={submitting || undefined}
                className="
                  font-mono text-[13px] uppercase tracking-[0.08em]
                  text-[color:var(--ink)]
                  border border-[color:var(--ink)]
                  px-5 py-2 h-[40px]
                  transition-colors duration-150
                  hover:bg-[color:var(--ink)] hover:text-[color:var(--paper)]
                  disabled:opacity-50 disabled:cursor-not-allowed
                  disabled:hover:bg-transparent disabled:hover:text-[color:var(--ink)]
                "
              >
                {submitting ? "Filing…" : "Subscribe"}
              </button>
            </form>
          )}
          {errorMsg ? (
            <p
              id="subscribe-error"
              role="alert"
              aria-live="assertive"
              className="font-mono text-[12px] text-[color:var(--brick-deep)] mt-3"
            >
              {errorMsg}
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
