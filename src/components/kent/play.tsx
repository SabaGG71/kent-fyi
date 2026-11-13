import { TypedPortrait } from "./typed-portrait";

/**
 * P.S., after the footnotes: Kent's portrait, set entirely in the text of this page. Set like a footnote,
 * a hairline, the name on the left with what to do, the line it stands for on the right, then the portrait
 * as a figure, with the line you're reading beside it.
 */
export function Play() {
  return (
    <section id="play" aria-labelledby="play-title" className="scroll-mt-4 px-(--m)">
      <div className="border-t border-ink/15 pt-4 pb-[clamp(64px,8vw,120px)]">
        <div className="grid grid-cols-1 gap-x-(--g) gap-y-5 lg:grid-cols-12">
          <div className="lg:col-span-3">
            <p className="text-[15px] leading-tight">P.S.</p>
            <p className="mono mt-2 text-ink/55">Every letter is a line from this page. Move over him to read it.</p>
          </div>
          <h2 id="play-title" className="text-[clamp(26px,3vw,46px)] leading-[1.06] tracking-[-0.022em] text-balance lg:col-span-9">
            All of the above, in one face.
          </h2>
        </div>
        <div className="mt-[clamp(28px,3.4vw,52px)]">
          <TypedPortrait />
        </div>
      </div>
    </section>
  );
}
