"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { Photo } from "@/lib/kent";
import { cn } from "@/lib/utils";

/** how long each photograph stays in front on a phone before the next slides in */
const DWELL = 4500;

/**
 * A row of photographs. From a small tablet up it's a plain grid, a column each (two at least). On a phone it's a strip you swipe, one
 * photograph at a time with the next one peeking in, no scrollbar, a thin segment per photograph under it
 * (the one in front fills yellow while it waits), and it moves on by itself every few seconds while it's
 * on screen. A finger on it holds it. Reduced motion: no autoplay.
 */
export function PhotoStrip({ photos, label, className }: { photos: Photo[]; label: string; className?: string }) {
  const track = useRef<HTMLUListElement>(null);
  const steering = useRef<number | null>(null);
  const [active, setActive] = useState(0);
  const [held, setHeld] = useState(false);
  const [playing, setPlaying] = useState(false);

  /** where the strip sits with each photograph in front: its left edge on the page margin, the last as far as it goes */
  const stops = useCallback(() => {
    const el = track.current;
    if (!el) return [];
    const pad = parseFloat(getComputedStyle(el).paddingLeft) || 0;
    const max = el.scrollWidth - el.clientWidth;
    return Array.from(el.children, (c) => Math.min((c as HTMLElement).offsetLeft - pad, max));
  }, []);

  const go = useCallback(
    (i: number) => {
      const el = track.current;
      const at = stops()[i];
      if (!el || at === undefined) return;
      steering.current = i;
      setActive(i);
      el.scrollTo({ left: at, behavior: "smooth" });
    },
    [stops],
  );

  const onScroll = () => {
    const el = track.current;
    if (!el) return;
    const s = stops();
    const x = el.scrollLeft;
    if (steering.current !== null) {
      // a slide we started: don't light the photographs it passes on the way
      if (Math.abs(s[steering.current] - x) > 2) return;
      steering.current = null;
    }
    let best = 0;
    s.forEach((v, i) => {
      if (Math.abs(v - x) < Math.abs(s[best] - x)) best = i;
    });
    setActive(best);
  };

  // only plays on a phone, on screen, with motion allowed
  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const narrow = matchMedia("(max-width: 639px)");
    const still = matchMedia("(prefers-reduced-motion: reduce)");
    let seen = false;
    const update = () => setPlaying(seen && narrow.matches && !still.matches);
    const io = new IntersectionObserver(
      ([e]) => {
        seen = e.isIntersecting;
        update();
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    narrow.addEventListener("change", update);
    still.addEventListener("change", update);
    return () => {
      io.disconnect();
      narrow.removeEventListener("change", update);
      still.removeEventListener("change", update);
    };
  }, []);

  useEffect(() => {
    if (!playing || held || photos.length < 2) return;
    const t = setTimeout(() => go((active + 1) % photos.length), DWELL);
    return () => clearTimeout(t);
  }, [playing, held, active, photos.length, go]);

  const filling = playing && !held;

  return (
    <div className={className}>
      <ul
        ref={track}
        aria-label={label}
        onScroll={onScroll}
        onTouchStart={() => {
          steering.current = null;
          setHeld(true);
        }}
        onTouchEnd={() => setHeld(false)}
        onTouchCancel={() => setHeld(false)}
        style={{ "--n": Math.max(photos.length, 2) } as React.CSSProperties}
        className="relative -mx-(--m) flex snap-x snap-mandatory scroll-px-(--m) gap-(--g) overflow-x-auto overscroll-x-contain px-(--m) [scrollbar-width:none] sm:mx-0 sm:grid sm:grid-cols-[repeat(var(--n),minmax(0,1fr))] sm:overflow-visible sm:px-0 [&::-webkit-scrollbar]:hidden"
      >
        {photos.map((p) => (
          <li key={p.src} className={cn("relative aspect-[4/5] shrink-0 snap-start overflow-hidden sm:w-auto", photos.length > 1 ? "w-[78vw]" : "w-full")}>
            <Image src={p.src} alt={p.alt} fill sizes="(min-width: 640px) 33vw, 78vw" className="object-cover" style={{ objectPosition: p.position }} />
          </li>
        ))}
      </ul>

      {photos.length > 1 && (
        <div className="mt-3 flex items-center justify-between sm:hidden">
          <div className="-ml-1 flex">
            {photos.map((p, i) => (
              <button key={p.src} type="button" onClick={() => go(i)} aria-label={`Photo ${i + 1} of ${photos.length}`} aria-current={i === active || undefined} className="group px-1 py-3">
                <span className="relative block h-[2px] w-9 overflow-hidden bg-fg/25">
                  {i === active && (
                    <span key={`${active}-${filling}`} className={cn("absolute inset-0 origin-left bg-accent", filling && "animate-[strip-fill_4.5s_linear_both]")} />
                  )}
                </span>
              </button>
            ))}
          </div>
          <p className="t-label text-fg/65" aria-hidden>
            {String(active + 1).padStart(2, "0")} / {String(photos.length).padStart(2, "0")}
          </p>
        </div>
      )}
    </div>
  );
}
