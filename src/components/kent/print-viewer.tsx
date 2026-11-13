"use client";

import { useEffect, useImperativeHandle, useRef, useState, type Ref } from "react";
import { gsap } from "@/lib/gsap";
import { PRINTS } from "@/lib/kent";
import { createPrinter, type Rgb } from "./print-gl";
import { DEFAULT_PROOF, proofOf, rgb, useProof } from "./proofs";
import { Stir } from "./stir";

/** how long a change of picture takes to grow through the marble */
const CHANGE = 1.25;

export type ViewerHandle = {
  /** stir along a path of frame-uv points over a duration: the hero's invitation to try it */
  demo: (path: [number, number][], seconds: number) => void;
};

/**
 * The hero picture (see print-gl.ts): PRINTS[index], sharp, in colour, and yours to marble. It draws only
 * while something is moving: a stir healing, a change of picture, the ink following a new proof. With
 * reduced motion changes are instant (stirring still works, since you're the one moving it). Without
 * WebGL 2, the photo itself.
 */
export function PrintViewer({ index, className, ref }: { index: number; className?: string; ref?: Ref<ViewerHandle> }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const proof = useProof();
  const [status, setStatus] = useState<"on" | "off" | null>(null);
  const fx = useRef({ from: index, to: index, mix: 1, busy: 0, ink: rgb(proofOf(DEFAULT_PROOF).ink) as Rgb, flood: rgb(proofOf(DEFAULT_PROOF).flood) as Rgb });
  const stir = useRef(new Stir());
  const wake = useRef<() => void>(() => {});
  const reduce = useRef(false);

  useImperativeHandle(ref, () => ({
    demo: (path, seconds) => {
      if (reduce.current || path.length < 2) return;
      const t = { k: 0 };
      let last = path[0];
      gsap.to(t, {
        k: path.length - 1,
        duration: seconds,
        ease: "sine.inOut",
        onUpdate: () => {
          const i = Math.min(path.length - 2, Math.floor(t.k));
          const f = t.k - i;
          const p: [number, number] = [path[i][0] + (path[i + 1][0] - path[i][0]) * f, path[i][1] + (path[i + 1][1] - path[i][1]) * f];
          stir.current.drag(p[0], p[1], p[0] - last[0], p[1] - last[1], 0.1, 0.8);
          last = p;
          wake.current();
        },
      });
    },
  }));

  useEffect(() => {
    const el = canvas.current;
    if (!el) return;
    reduce.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const printer = createPrinter(el, PRINTS.length);
    if (!printer) {
      setStatus("off");
      return;
    }
    let visible = false;
    let lost = false;
    let running = false;

    const draw = (time: number) => {
      const f = fx.current;
      if (lost || !printer.ready(f.to)) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const s = stir.current;
      printer.setStir(s.data, s.w, s.h);
      printer.draw({
        width: Math.max(1, Math.round(el.clientWidth * dpr)),
        height: Math.max(1, Math.round(el.clientHeight * dpr)),
        from: f.from,
        to: f.to,
        mix: f.mix,
        time: reduce.current ? 0 : time,
        ink: f.ink,
        flood: f.flood,
      });
    };

    // the loop runs only while something is moving, and stops itself once all is still
    const tick = (time: number, deltaMs: number) => {
      if (!visible) return;
      const moving = stir.current.step(Math.min(deltaMs, 50) / 1000);
      draw(time);
      if (!moving && fx.current.busy === 0) {
        gsap.ticker.remove(tick);
        running = false;
      }
    };
    wake.current = () => {
      if (!running) {
        running = true;
        gsap.ticker.add(tick);
      }
    };

    // the marble first, then the pictures, the one on show first of all
    const load = (src: string, onload: (img: HTMLImageElement) => void) => {
      const img = new Image();
      img.decoding = "async";
      img.onload = () => !lost && onload(img);
      img.onerror = () => setStatus("off");
      img.src = src;
      return img;
    };
    const order = [fx.current.to, ...PRINTS.map((_, i) => i).filter((i) => i !== fx.current.to)];
    const images: HTMLImageElement[] = [];
    images.push(
      load("/kent/marble.webp", (img) => {
        printer.setMarble(img);
        order.forEach((slot) =>
          images.push(
            load(PRINTS[slot].src, (pic) => {
              printer.setPicture(slot, pic);
              if (printer.ready(fx.current.to)) {
                setStatus("on");
                draw(gsap.ticker.time);
              }
            }),
          ),
        );
      }),
    );

    // your hand on the picture: dragging marbles it, a press drops a ring
    let last: [number, number] | null = null;
    const at = (e: PointerEvent): [number, number] => {
      const r = el.getBoundingClientRect();
      return [(e.clientX - r.left) / r.width, (e.clientY - r.top) / r.height];
    };
    const onMove = (e: PointerEvent) => {
      const p = at(e);
      if (last) stir.current.drag(p[0], p[1], p[0] - last[0], p[1] - last[1]);
      last = p;
      wake.current();
    };
    const onLeave = () => (last = null);
    const onDown = (e: PointerEvent) => {
      const p = at(e);
      stir.current.drop(p[0], p[1]);
      last = p;
      wake.current();
    };
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    el.addEventListener("pointerdown", onDown);

    const io = new IntersectionObserver((entries) => {
      visible = entries[entries.length - 1].isIntersecting;
      if (visible) draw(gsap.ticker.time);
    });
    io.observe(el);
    const ro = new ResizeObserver(() => {
      if (!el.clientWidth || !el.clientHeight) return;
      stir.current.resize(el.clientWidth / el.clientHeight);
      draw(gsap.ticker.time);
    });
    ro.observe(el);
    const onLost = (e: Event) => {
      e.preventDefault();
      lost = true;
      setStatus("off");
    };
    el.addEventListener("webglcontextlost", onLost);

    return () => {
      gsap.ticker.remove(tick);
      io.disconnect();
      ro.disconnect();
      images.forEach((img) => (img.onload = null));
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("webglcontextlost", onLost);
      printer.dispose();
      wake.current = () => {};
    };
  }, []);

  // a new picture grows in through the marble
  useEffect(() => {
    const f = fx.current;
    if (index === f.to) return;
    gsap.killTweensOf(f, "mix");
    // a change that interrupts another starts from whatever is showing most
    f.from = f.mix < 0.5 ? f.from : f.to;
    f.to = index;
    f.mix = 0;
    f.busy++;
    wake.current();
    gsap.to(f, { mix: 1, duration: reduce.current ? 0 : CHANGE, ease: "power2.inOut", onComplete: () => f.busy--, onInterrupt: () => f.busy-- });
  }, [index]);

  // the ink follows the proof
  useEffect(() => {
    const p = proofOf(proof);
    const f = fx.current;
    const from = { ink: [...f.ink], flood: [...f.flood] };
    const to = { ink: rgb(p.ink), flood: rgb(p.flood) };
    const t = { k: 0 };
    f.busy++;
    wake.current();
    gsap.to(t, {
      k: 1,
      duration: reduce.current ? 0 : 0.6,
      ease: "power2.inOut",
      onUpdate: () => {
        f.ink = from.ink.map((v, i) => v + (to.ink[i] - v) * t.k) as unknown as Rgb;
        f.flood = from.flood.map((v, i) => v + (to.flood[i] - v) * t.k) as unknown as Rgb;
      },
      onComplete: () => f.busy--,
    });
  }, [proof]);

  const fallback = PRINTS[index].photo || PRINTS[0].photo;

  return (
    <div className={className}>
      {status === "off" && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={fallback} alt="" className="absolute inset-0 size-full object-cover" />
      )}
      <canvas
        ref={canvas}
        aria-hidden
        className={`absolute inset-0 size-full touch-pan-y transition-opacity duration-700 ${status === "on" ? "cursor-crosshair opacity-100" : "opacity-0"}`}
      />
    </div>
  );
}

