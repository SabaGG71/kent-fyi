import Link from "next/link";
import { NEXT } from "@/lib/kent";

/**
 * "I would like to": what Kent wants to work on next, as a numbered list. Each row drops open to one line
 * and a link to the idea's own page. Only one is open at a time (the rows share a name).
 */
export function WouldLike() {
  return (
    <div className="mt-[clamp(40px,5vw,72px)]">
      <div className="flex items-baseline justify-between gap-6 border-t border-fg/20 pt-4">
        <h2 id="next-title" className="t-label text-fg/70">
          I would like to
        </h2>
        <p className="t-label hidden text-fg/50 sm:block">Things I want to work on next</p>
      </div>
      <ol aria-labelledby="next-title" className="mt-2">
        {NEXT.map((idea, i) => (
          <li key={idea.slug} className="border-b border-fg/15 last:border-b-0">
            <details name="would-like" className="group">
              <summary className="flex cursor-pointer list-none items-baseline gap-4 py-3 hover:text-hover [&::-webkit-details-marker]:hidden">
                <span className="t-label w-7 shrink-0 text-fg/50 group-hover:text-inherit">{String(i + 1).padStart(2, "0")}</span>
                <span className="t-lead flex-1">{idea.title}</span>
                <span aria-hidden className="t-label shrink-0 text-fg/60 group-open:rotate-45 group-hover:text-inherit">
                  +
                </span>
              </summary>
              <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 pb-4 pl-11">
                <p className="t-small max-w-[48ch] text-fg/80">{idea.short}</p>
                <Link href={`/next/${idea.slug}`} className="t-small underline decoration-1 underline-offset-[4px] hover:text-hover hover:decoration-hover">
                  See the idea<span aria-hidden>&nbsp;&rarr;</span>
                </Link>
              </div>
            </details>
          </li>
        ))}
      </ol>
    </div>
  );
}
