"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { cn } from "@/lib/utils";
import { FYIS, PRINTS } from "@/lib/kent";
import { PrintViewer, type ViewerHandle } from "./print-viewer";
import { ProofPicker } from "./proofs";
import { useTbilisiTime } from "./time";
import { VoilaBox } from "./voila-box";

/** seconds each FYI is shown while the hero turns through them by itself */
const HOLD = 4.4;

/** the stroke the hero draws across the picture once, to show it can be marbled: an S down the middle */
const DEMO: [number, number][] = [
  [0.18, 0.3],
  [0.42, 0.24],
  [0.62, 0.36],
  [0.4, 0.5],
  [0.3, 0.62],
  [0.58, 0.72],
  [0.8, 0.66],
];

/**
 * The hero: things you should know about Kent, set as one list, each line pointing at its footnote below.
 * Beside it, the picture for whatever is lit, sharp and in colour, which you can marble by dragging across
 * it. Point at a line and its picture grows in through the marble. Until someone does, the hero turns
 * through the lines by itself, slowly.
 *
 * The opening, as the page loads: the lines rise into place one after another and the
 * picture opens from the bottom; then one stroke across the picture shows it can be marbled.
 */
export function Hero() {
  const [index, setIndex] = useState(0);
  const [touched, setTouched] = useState(false);
  const [started, setStarted] = useState(false);
  const [inView, setInView] = useState(true);
  const root = useRef<HTMLElement>(null);
  const viewer = useRef<ViewerHandle>(null);
  const time = useTbilisiTime();

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.3 });
    io.observe(el);
    let demo = 0;
    const begin = () => {
      const html = document.documentElement;
      if (html.classList.contains("hero-pending")) {
        // hand the first frame over from the stylesheet to the tweens: take the class off first, so the
        // tweens start from clean transforms and set their own first frame in the same moment
        html.classList.remove("hero-pending");
        const q = gsap.utils.selector(el);
        gsap.fromTo(q("[data-line]"), { y: 0, yPercent: 112 }, { y: 0, yPercent: 0, duration: 1.25, ease: "expo.out", stagger: 0.07 });
        gsap.fromTo(q("[data-hero-photo]"), { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.4, ease: "expo.inOut", delay: 0.1 });
        gsap.fromTo(q("[data-hero-fade]"), { opacity: 0 }, { opacity: 1, duration: 0.9, ease: "power2.out", delay: 0.55, stagger: 0.08 });
      }
      setStarted(true);
      demo = window.setTimeout(() => viewer.current?.demo(DEMO, 1.6), 2200);
    };
    begin();
    return () => {
      io.disconnect();
      window.clearTimeout(demo);
    };
  }, []);

  // turn through the FYIs by itself until someone points at one
  useEffect(() => {
    if (!started || touched || !inView || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setTimeout(() => setIndex((i) => (i + 1) % PRINTS.length), (index === 0 ? HOLD + 2.6 : HOLD) * 1000);
    return () => window.clearTimeout(id);
  }, [index, touched, inView, started]);

  const point = (n: number) => {
    setTouched(true);
    setIndex(n);
  };

  const print = PRINTS[index];
  const frame = "lg:ml-auto lg:w-[min(100%,calc((100svh-200px)*0.8))]";

  return (
    <section
      ref={root}
      aria-labelledby="fyi-title"
      className="grid grid-cols-1 gap-x-(--g) gap-y-10 px-(--m) pt-[clamp(28px,6svh,72px)] pb-[clamp(64px,10svh,120px)] lg:grid-cols-12"
    >
      <div className="flex flex-col lg:col-span-7 lg:row-start-1 lg:pt-1">
        <h1 id="fyi-title" data-hero-fade className="mono text-ink/55">
          For your information
        </h1>
        <ol className="mt-4 text-[clamp(26px,3.45vw,56px)] leading-[1.06] tracking-[-0.025em] text-balance" onMouseLeave={() => touched && setIndex(0)}>
          {FYIS.map((f) => {
            const on = index === f.n;
            return (
              // each line rises into place from under its own edge; the padding keeps descenders in view
              <li key={f.id} className="-mb-[0.14em] overflow-hidden pb-[0.14em]">
                <span data-line className="inline-block">
                  <a
                    href={`#${f.id}`}
                    onMouseEnter={() => point(f.n)}
                    onFocus={() => point(f.n)}
                    onBlur={() => setIndex(0)}
                    className={cn("transition-colors duration-300", on ? "marbled" : index === 0 ? "text-ink/75" : "text-ink/25 hover:text-ink/75")}
                  >
                    {f.text}
                  </a>
                  <sup className="mono ml-[0.12em] align-[0.95em] text-[0.36em] text-link">{f.n}</sup>
                </span>
              </li>
            );
          })}
        </ol>
        <p data-hero-fade className="mono mt-auto pt-8 text-ink/55">
          Kent Sheridan, an American in Tbilisi.{time && <> It&rsquo;s {time} there now.</>}
        </p>
      </div>

      {/* the picture, with the VOILA box turning on its corner, its figure number, caption and the five proofs */}
      <figure className="max-lg:order-first lg:col-span-5 lg:col-start-8 lg:row-start-1">
        <div className={cn("relative mx-auto aspect-square w-full sm:aspect-[4/5]", frame)}>
          <div role="img" aria-label={print.alt} className="crop-marks absolute inset-0">
            <div data-hero-photo className="absolute inset-0 bg-ink/[0.06]">
              <PrintViewer ref={viewer} index={index} className="absolute inset-0" />
            </div>
          </div>
          <VoilaBox
            onPick={() => point(1)}
            className="absolute bottom-[3%] left-[-3%] z-10 [--box-w:62px] sm:[--box-w:74px] lg:bottom-[2%] lg:left-[-15%] lg:[--box-w:84px]"
          />
        </div>
        <figcaption data-hero-fade className={cn("mono mt-6 flex flex-col gap-3", frame)}>
          <span className="flex gap-3">
            <span className="shrink-0 text-ink/55">Fig. {index}</span>
            <span aria-live="polite">{print.caption}</span>
          </span>
          <ProofPicker />
        </figcaption>
      </figure>
    </section>
  );
}
