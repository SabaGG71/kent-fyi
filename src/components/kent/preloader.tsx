"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { PRINTS } from "@/lib/kent";
import { createMarbler } from "./marbling-gl";
import { proofOf, rgb, type ProofKey } from "./proofs";

/** tells the page the marbled paper has started to lift (the hero plays its opening under it) */
export const INTRO_EVENT = "kentfyi:intro";
const SEEN = "kentfyi:intro";

// where the drops land (in screen heights, from the middle), how big they spread, and when (seconds)
// enough ink, all told, to cover a wide screen edge to edge once the rings have pushed each other out
const DROP_PLAN: number[][] = [
  [0.0, 0.0, 0.42, 0.04],
  [0.1, -0.06, 0.3, 0.13],
  [-0.14, 0.08, 0.28, 0.21],
  [0.16, 0.12, 0.25, 0.29],
  [-0.06, -0.14, 0.24, 0.37],
  [0.04, 0.05, 0.22, 0.45],
  [-0.12, -0.03, 0.2, 0.53],
  [0.09, 0.1, 0.18, 0.61],
  [0.02, -0.07, 0.16, 0.69],
  [-0.05, 0.04, 0.14, 0.77],
  [0.07, -0.01, 0.12, 0.85],
  [0.0, 0.02, 0.1, 0.93],
];
// 2 ink, 1 flood, 0 paper: a stone pattern with paper between the inks, so the page can show through
const COLOURS = [2, 1, 2, 0, 1, 2, 0, 2, 1, 2, 0, 1];

/**
 * The first visit opens on a sheet of marbled paper being made (see marbling-gl.ts) in the proof the
 * visitor last picked, with the name and a count of what's loaded in the corners. Once the hero's first
 * picture is in, the paper clears into the page. Once a session; never with reduced motion; a click or a
 * key skips it. Without JS a stylesheet rule fades it out on its own.
 */
export function Preloader() {
  const root = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [progress, setProgress] = useState(0);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const el = root.current;
    const cv = canvas.current;
    const html = document.documentElement;
    let told = false;
    const tell = () => {
      if (told) return;
      told = true;
      window.dispatchEvent(new Event(INTRO_EVENT));
    };
    const finish = () => {
      try {
        sessionStorage.setItem(SEEN, "1");
      } catch {
        // no storage: it simply plays again next time
      }
      html.dataset.intro = "seen";
      setGone(true);
      tell();
    };
    if (!el || !cv || html.dataset.intro === "seen") {
      setGone(true);
      window.dispatchEvent(new Event(INTRO_EVENT));
      return;
    }

    const proof = proofOf((html.dataset.proof as ProofKey) ?? "fyi");
    const colours = { ink: [...rgb(proof.ink)], flood: [...rgb(proof.flood)], paper: [...rgb("#ebeae7")] };
    const marbler = createMarbler(cv, DROP_PLAN, COLOURS);
    if (!marbler) {
      gsap.to(el, { opacity: 0, duration: 0.5, onComplete: finish });
      return;
    }

    // what the hero needs before it can show: the marble, the first picture, the type
    let loaded = 0;
    const needs = ["/kent/marble.webp", PRINTS[0].src];
    const total = needs.length + 1;
    const bump = () => setProgress(Math.round((++loaded / total) * 100));
    const ready = Promise.all([
      ...needs.map(
        (src) =>
          new Promise<void>((resolve) => {
            const img = new Image();
            img.onload = img.onerror = () => {
              bump();
              resolve();
            };
            img.src = src;
          }),
      ),
      document.fonts.ready.then(bump),
    ]);

    const s = { t: 0, comb: 0, wave: 0, swirl: 0, reveal: 0 };
    const draw = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      marbler.draw({ width: Math.round(cv.clientWidth * dpr), height: Math.round(cv.clientHeight * dpr), ...s, ...colours });
    };
    const tick = () => draw();
    gsap.ticker.add(tick);

    // drops land, the comb is drawn down, the wave across, the stylus turned
    const tl = gsap
      .timeline()
      .to(s, { t: 1.9, duration: 1.9, ease: "none" }, 0)
      .to(s, { comb: 1, duration: 0.6, ease: "power2.inOut" }, 0.95)
      .to(s, { wave: 1, duration: 0.55, ease: "power2.inOut" }, 1.2)
      .to(s, { swirl: 1, duration: 0.7, ease: "power2.inOut" }, 1.35);

    // then, once the sheet is made and the hero can show, the paper clears into the page
    let cleared = false;
    const clear = () => {
      if (cleared) return;
      cleared = true;
      tl.progress(1);
      gsap.to(el.querySelectorAll("[data-label]"), { opacity: 0, duration: 0.3 });
      // the hero's opening plays underneath while the paper lifts
      window.setTimeout(tell, 180);
      gsap.to(s, {
        reveal: 1.35,
        duration: 0.9,
        ease: "power2.in",
        onComplete: () => {
          gsap.ticker.remove(tick);
          marbler.dispose();
          finish();
        },
      });
    };
    // never longer than six seconds, however slow the network
    const loadedOrLate = Promise.race([ready, new Promise((r) => window.setTimeout(r, 6000))]);
    void Promise.all([loadedOrLate, tl.then()]).then(clear);
    const skip = () => clear();
    window.addEventListener("keydown", skip, { once: true });
    el.addEventListener("pointerdown", skip, { once: true });

    return () => {
      tl.kill();
      gsap.ticker.remove(tick);
      window.removeEventListener("keydown", skip);
      el.removeEventListener("pointerdown", skip);
    };
  }, []);

  if (gone) return null;

  return (
    <div ref={root} data-preloader aria-hidden className="fixed inset-0 z-[100] bg-paper">
      <canvas ref={canvas} className="absolute inset-0 size-full" />
      {/* the slug: small type on a scrap of paper, so the ink can pass under it */}
      <p data-label className="absolute top-2.5 left-[calc(var(--m)-6px)] bg-paper px-1.5 py-1 text-[15px] leading-none text-ink">
        <span className="underline decoration-1 underline-offset-[3px]">kent.fyi</span>
      </p>
      <p data-label className="mono absolute bottom-2 left-[calc(var(--m)-6px)] bg-paper px-1.5 py-0.5 text-ink">For your information</p>
      <p data-label className="mono absolute right-[calc(var(--m)-6px)] bottom-2 bg-paper px-1.5 py-0.5 text-ink tabular-nums">{String(progress).padStart(3, "0")}</p>
    </div>
  );
}
