import Link from "next/link";
import { NEXT } from "@/lib/kent";

/**
 * "I would like to": what Kent wants to work on next, as a numbered list. An idea with its own page is a link,
 * turning hyperlink blue, number and all, the instant you point at it; the rest are just a line, for now.
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
        {NEXT.map((idea, i) => {
          const n = String(i + 1).padStart(2, "0");
          return (
            <li key={idea.slug} className="border-b border-fg/15 last:border-b-0">
              {idea.page ? (
                <Link href={`/next/${idea.slug}`} className="group flex items-baseline gap-4 py-3 hover:text-hover">
                  <span className="t-label w-7 shrink-0 text-fg/50 group-hover:text-hover">{n}</span>
                  <span className="t-lead flex-1">{idea.title}</span>
                  <span aria-hidden className="t-label shrink-0 text-fg/60 group-hover:text-hover">
                    &rarr;
                  </span>
                </Link>
              ) : (
                <div className="flex items-baseline gap-4 py-3">
                  <span className="t-label w-7 shrink-0 text-fg/50">{n}</span>
                  <span className="t-lead flex-1">{idea.title}</span>
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
