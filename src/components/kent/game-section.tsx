import { SupraRun } from "./run/supra-run";

/**
 * P.P.S., after the portrait: Supra Run. Set like the footnotes, a hairline, the name on the left with how
 * to play, the line it stands for on the right, then the game as a figure with its caption.
 */
export function GameSection() {
  return (
    <section id="game" aria-labelledby="game-title" className="scroll-mt-4 px-(--m)">
      <div className="border-t border-ink/15 pt-4 pb-[clamp(64px,8vw,120px)]">
        <div className="grid grid-cols-1 gap-x-(--g) gap-y-5 lg:grid-cols-12">
          <div className="lg:col-span-3">
            <p className="text-[15px] leading-tight">P.P.S.</p>
            <p className="mono mt-2 text-ink/55">A game. Arrow keys on a keyboard, the buttons on a phone.</p>
          </div>
          <h2 id="game-title" className="text-[clamp(26px,3vw,46px)] leading-[1.06] tracking-[-0.022em] text-balance lg:col-span-9">
            I&rsquo;m late for dinner in Tbilisi. Run me there.
          </h2>
        </div>
        <figure className="mt-[clamp(28px,3.4vw,52px)]">
          <SupraRun />
          <figcaption className="mono mt-3 text-ink/55">Fig. 10 &nbsp;Tbilisi at dusk, printed in the ink picked at the top. The dogs wear yellow tags: vaccinated, and friendly.</figcaption>
        </figure>
      </div>
    </section>
  );
}
