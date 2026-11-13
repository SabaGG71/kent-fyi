import { SupraRun } from "./supra-run";

/**
 * Supra Run, kept as a page of its own (/run): an earlier P.S. Set like a footnote, a hairline, the name
 * on the left with how to play, the line it stands for on the right, then the game with its caption.
 */
export function RunSection() {
  return (
    <section aria-labelledby="run-title" className="px-(--m) pt-[clamp(40px,8svh,96px)]">
      <div className="border-t border-ink/15 pt-4 pb-[clamp(64px,8vw,120px)]">
        <div className="grid grid-cols-1 gap-x-(--g) gap-y-5 lg:grid-cols-12">
          <div className="lg:col-span-3">
            <p className="text-[15px] leading-tight">A game</p>
            <p className="mono mt-2 text-ink/55">Arrow keys on a keyboard, the buttons on a phone.</p>
          </div>
          <h1 id="run-title" className="text-[clamp(26px,3vw,46px)] leading-[1.06] tracking-[-0.022em] text-balance lg:col-span-9">
            Learn four Georgian words on the way to dinner.
          </h1>
        </div>
        <figure className="mt-[clamp(28px,3.4vw,52px)]">
          <SupraRun />
          <figcaption className="mono mt-3 text-ink/55">Tbilisi at dusk, printed in the ink picked on the home page. The dogs wear yellow tags: vaccinated, and friendly.</figcaption>
        </figure>
      </div>
    </section>
  );
}
