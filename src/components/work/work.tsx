"use client";

import Image from "next/image";
import { ArrowUpRight, Pause, Play } from "lucide-react";
import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";
import { InkHeading } from "@/components/site/ink-heading";
import { RollingText } from "@/components/site/rolling-text";
import { createPour } from "./pour-gl";

type Project = {
  kind: string;
  title: string;
  line: string;
  image: { src: string; alt: string; position: readonly [number, number] };
  link?: { href: string; label: string };
};

/** the wine and the jewelry are AI stand-ins in one matched set until the real bottle and pieces are shot;
 * the workspace is an Unsplash photo (Unsplash License), regraded warm */
const PROJECTS: Project[] = [
  {
    kind: "Wine",
    title: "kent fyi",
    line: "My own wine, under my own name.",
    image: {
      src: "/work/wine-2x.webp",
      alt: "A dark green wine bottle with a cream label that reads kent fyi, on a stone plinth against a red wall",
      position: [0.5, 0.42],
    },
  },
  {
    kind: "Partnership",
    title: "Jewelry",
    line: "A signed deal with a jewelry brand.",
    image: {
      src: "/work/ring-band-3.webp",
      alt: "A gold band ring with kent fyi engraved in script inside the band",
      position: [0.5, 0.5],
    },
  },
  {
    kind: "Company",
    title: "LocalEyes Growth",
    line: "Coffee carts, dessert carts and mobile bars, found on Google and booked for more events.",
    image: {
      src: "/work/workspace.webp",
      alt: "A steaming mug beside an open laptop on a table, in low late sunlight through a window",
      position: [0.5, 0.6],
    },
    link: { href: "https://localeyesgrowth.com", label: "localeyesgrowth.com" },
  },
];

const HOLD = 6;
const POUR = 1.7;
const pad = (i: number) => String(i + 1).padStart(2, "0");
/** the canvas reads the photos through the image optimizer, near the size it draws them */
const optimized = (src: string, w: number) => `/_next/image?url=${encodeURIComponent(src)}&w=${w}&q=90`;

/**
 * Work as an index and a stage. On the left the three things with his name on them, set big: the one in
 * view is lit and opens to its line, the others wait dimmed. On the right the stage, where each change
 * pours in: the next photo rises from the bottom of the frame under a moving surface with a thin meniscus,
 * like a glass filling. It turns over by itself while on screen, pauses on hover or focus, has its own
 * pause button, and stops turning for good once you pick one. Without WebGL the photos crossfade.
 */
export function Work() {
  const root = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const bar = useRef<HTMLSpanElement>(null);
  const [active, setActive] = useState(0);
  const [steered, setSteered] = useState(false);
  const [paused, setPaused] = useState(false);
  const [held, setHeld] = useState(false);
  const [inView, setInView] = useState(false);
  const [webgl, setWebgl] = useState<"on" | "off" | null>(null);
  const [reduce] = useState(() => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  // what the canvas draws: the photo it pours from and to, how far along, and when it last poured
  const fx = useRef({ from: 0, to: 0, p: 1, breath: 1 });
  const go = useRef<(i: number) => void>(() => {});

  // the stage
  useEffect(() => {
    const el = canvas.current;
    if (!el) return;
    const stage = createPour(
      el,
      PROJECTS.map((p) => p.image.position),
    );
    if (!stage) {
      setWebgl("off");
      return;
    }
    let visible = false;
    let lost = false;
    const size = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      return { width: Math.max(1, Math.round(el.clientWidth * dpr)), height: Math.max(1, Math.round(el.clientHeight * dpr)) };
    };
    const draw = (time: number) => {
      const f = fx.current;
      if (lost || !stage.ready(f.to)) return;
      stage.draw({ ...size(), ...f, time });
    };
    const tick = (time: number) => {
      if (visible) draw(time);
    };

    // the photos go up as they arrive, the first one first
    const width = Math.min(1920, Math.max(1080, Math.round(el.clientWidth * Math.min(window.devicePixelRatio || 1, 2) * 1.1)));
    const loaders = PROJECTS.map((p, i) => {
      const img = new window.Image();
      img.decoding = "async";
      img.onload = () => {
        if (lost) return;
        stage.setPhoto(i, img, img.naturalWidth, img.naturalHeight);
        if (i === fx.current.to) {
          setWebgl("on");
          draw(gsap.ticker.time);
        }
      };
      img.onerror = () => i === 0 && setWebgl("off");
      img.src = optimized(p.image.src, width >= 1600 ? 1920 : 1080);
      return img;
    });

    let pour: gsap.core.Tween | null = null;
    go.current = (i: number) => {
      const f = fx.current;
      if (i === f.to) return;
      pour?.progress(1);
      f.from = f.to;
      f.to = i;
      f.p = 0;
      pour = gsap.to(f, { p: 1, duration: reduce ? 0 : POUR, ease: "power2.inOut", onUpdate: () => draw(gsap.ticker.time) });
    };

    // the photo breathes while it rests
    const breath = reduce ? null : gsap.to(fx.current, { breath: 1.04, duration: 9, ease: "sine.inOut", yoyo: true, repeat: -1 });
    const io = new IntersectionObserver((entries) => {
      visible = entries[entries.length - 1].isIntersecting;
      if (visible) draw(gsap.ticker.time);
    });
    io.observe(el);
    const ro = new ResizeObserver(() => draw(gsap.ticker.time));
    ro.observe(el);
    const onLost = (e: Event) => {
      e.preventDefault();
      lost = true;
      setWebgl("off");
    };
    el.addEventListener("webglcontextlost", onLost);
    if (!reduce) gsap.ticker.add(tick);

    return () => {
      gsap.ticker.remove(tick);
      pour?.kill();
      breath?.kill();
      io.disconnect();
      ro.disconnect();
      loaders.forEach((img) => (img.onload = null));
      el.removeEventListener("webglcontextlost", onLost);
      stage.dispose();
    };
  }, [reduce]);

  const select = useCallback((i: number) => {
    setActive(i);
    go.current(i);
  }, []);

  // it only turns over by itself while it's on screen
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // the hairline fills while a project is held, then the next one pours in
  const auto = inView && !steered && !paused && !held && !reduce;
  useEffect(() => {
    if (!auto) {
      gsap.to(bar.current, { scaleX: steered || reduce ? 1 : 0, duration: 0.4, ease: "power2.out" });
      return;
    }
    const t = gsap.fromTo(
      bar.current,
      { scaleX: 0 },
      { scaleX: 1, duration: HOLD, ease: "none", onComplete: () => select((active + 1) % PROJECTS.length) },
    );
    return () => {
      t.kill();
    };
  }, [auto, active, steered, reduce, select]);

  // the index rises in once
  useGSAP(
    () => {
      if (reduce) return;
      gsap.from("[data-row]", {
        y: 40,
        opacity: 0,
        duration: 1.2,
        ease: "expo.out",
        stagger: 0.08,
        scrollTrigger: { trigger: "[data-index]", start: "top 82%", once: true },
      });
      gsap.fromTo(
        "[data-stage]",
        { clipPath: "inset(14% 10% 14% 10% round 6px)" },
        { clipPath: "inset(0% 0% 0% 0% round 6px)", duration: 1.6, ease: "expo.out", scrollTrigger: { trigger: "[data-stage]", start: "top 85%", once: true } },
      );
    },
    { scope: root, dependencies: [reduce] },
  );

  const pick = (i: number) => {
    setSteered(true);
    select(i);
  };

  return (
    <section
      ref={root}
      id="work"
      aria-labelledby="work-title"
      data-webgl={webgl ?? undefined}
      className="relative bg-coal pt-[clamp(40px,5vw,72px)] pr-[var(--pad-r)] pb-[clamp(104px,11vw,160px)] pl-[var(--pad-l)]"
    >
      <div className="grid grid-cols-1 gap-y-8 lg:grid-cols-12 lg:gap-x-8">
        <p className="text-[12px] font-semibold tracking-[0.02em] text-cream/60 uppercase lg:col-span-3 lg:pt-[0.7em]">
          <span aria-hidden className="mr-2 inline-block size-[6px] -translate-y-px rounded-full bg-ember align-middle" />
          Work
        </p>
        <InkHeading
          id="work-title"
          parts={[{ text: "A bottle, a deal and a company." }, { text: "All with my name on them.", tone: "soft" }]}
          className="text-[clamp(28px,3vw,50px)] leading-[1.08] lg:col-span-9"
        />
      </div>

      <div
        className="mt-[clamp(40px,5vw,80px)] grid grid-cols-1 gap-y-8 lg:h-[min(80svh,820px)] lg:min-h-[600px] lg:grid-cols-12 lg:gap-x-8"
        onPointerEnter={(e) => e.pointerType === "mouse" && setHeld(true)}
        onPointerLeave={() => setHeld(false)}
        onFocus={() => setHeld(true)}
        onBlur={(e) => !e.currentTarget.contains(e.relatedTarget) && setHeld(false)}
      >
        {/* the index */}
        <ol data-index className="flex flex-col justify-center lg:col-span-6">
          {PROJECTS.map((p, i) => {
            const on = active === i;
            return (
              <li key={p.title} data-row className="border-t border-cream/12 last:border-b">
                <button
                  type="button"
                  aria-pressed={on}
                  aria-controls={`project-${i}`}
                  onClick={() => pick(i)}
                  className="group flex w-full items-start gap-5 py-5 text-left lg:py-6"
                >
                  <span className={cn("w-7 pt-[0.6em] text-[12px] font-semibold tabular-nums transition-colors duration-500", on ? "text-cream" : "text-cream/35")}>
                    {pad(i)}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span
                      translate={p.title === "kent fyi" ? "no" : undefined}
                      style={{ fontWeight: on ? 600 : 400 } as CSSProperties}
                      className={cn(
                        "block font-display text-[clamp(34px,4vw,68px)] leading-[0.98] tracking-[-0.04em] transition-[color,font-weight] duration-700 ease-out-expo motion-reduce:transition-none",
                        on ? "text-cream" : "text-cream/30 group-hover:text-cream/60",
                      )}
                    >
                      {p.title}
                    </span>
                  </span>
                  <span className={cn("pt-[0.6em] text-[12px] font-semibold tracking-[0.02em] uppercase transition-colors duration-500", on ? "text-cream/70" : "text-cream/30")}>
                    {p.kind}
                  </span>
                </button>
                {/* the line, opening under the one that's lit */}
                <div
                  id={`project-${i}`}
                  className={cn(
                    "grid transition-[grid-template-rows,opacity] duration-700 ease-out-expo motion-reduce:transition-none",
                    on ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
                  )}
                >
                  <div className="overflow-hidden">
                    {/* the line on the left; a link, when there is one, in the row's bottom-right corner */}
                    <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3 pb-6 pl-12">
                      <p className="max-w-[36ch] text-[16px] leading-[1.5] text-cream/75 md:text-[17px]">{p.line}</p>
                      {p.link && (
                        <a
                          href={p.link.href}
                          target="_blank"
                          rel="noreferrer"
                          tabIndex={on ? 0 : -1}
                          className="roll-host ml-auto inline-flex items-center gap-1.5 pb-1 text-[12px] font-semibold tracking-[0.02em] text-cream uppercase"
                        >
                          <RollingText>{p.link.label}</RollingText>
                          <ArrowUpRight aria-hidden className="size-3.5" strokeWidth={2} />
                          <span className="sr-only">(opens in a new tab)</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>

        {/* the stage */}
        <figure data-stage className="relative aspect-[4/5] overflow-hidden rounded-[6px] bg-[#1c0705] lg:col-span-6 lg:aspect-auto lg:h-full">
          {/* the photos as plain images: what readers and search get, and the crossfade when WebGL can't run */}
          {PROJECTS.map((p, i) => (
            <Image
              key={p.title}
              src={p.image.src}
              alt={p.image.alt}
              fill
              quality={90}
              sizes="(min-width: 1024px) 48vw, 100vw"
              aria-hidden={active !== i}
              // under a running canvas they stay in place for readers but out of sight
              className={cn("object-cover transition-opacity duration-1000", active === i && webgl !== "on" ? "opacity-100" : "opacity-0")}
              style={{ objectPosition: `${p.image.position[0] * 100}% ${p.image.position[1] * 100}%` }}
            />
          ))}
          <canvas ref={canvas} aria-hidden className={cn("absolute inset-0 size-full transition-opacity duration-700", webgl === "on" ? "opacity-100" : "opacity-0")} />
          <div aria-hidden className="grain pointer-events-none absolute inset-0" />
          <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-[30%] bg-gradient-to-t from-coal/70 to-transparent" />

          {/* counter, progress and pause */}
          <figcaption className="absolute inset-x-5 bottom-5 flex items-center gap-4 text-[12px] font-semibold tracking-[0.02em] text-cream uppercase lg:inset-x-6 lg:bottom-6">
            <span className="tabular-nums">
              {pad(active)} / {pad(PROJECTS.length - 1)}
            </span>
            <span aria-hidden className="relative h-px flex-1 bg-cream/20">
              <span ref={bar} className="absolute inset-0 origin-left scale-x-0 bg-cream/80" />
            </span>
            <span className="truncate text-cream/70">{PROJECTS[active].kind}</span>
            {!steered && !reduce && (
              <button
                type="button"
                onClick={() => setPaused((v) => !v)}
                aria-label={paused ? "Play" : "Pause"}
                className="grid size-7 place-items-center rounded-[3px] text-cream/75 transition-colors duration-300 hover:bg-cream/10 hover:text-cream"
              >
                {paused ? <Play aria-hidden className="size-3.5" /> : <Pause aria-hidden className="size-3.5" />}
              </button>
            )}
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
