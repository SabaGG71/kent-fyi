"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { gsap } from "@/lib/gsap";
import { cn } from "@/lib/utils";

/**
 * The faces of the box in its own frame (width --w, length --h, thickness --d), lying on its back with the
 * front, VOILA, facing up: the lids and the base are its two ends, the long sides its edges, the back
 * underneath. `edge` is the way an edge faces in the box's plane (degrees: 0 right, 90 toward you), so each
 * one can be lit by how squarely it faces the light as the box turns; the top and the bottom keep theirs.
 */
const FACES = [
  { key: "front", bg: "url(/kent/box/front.webp)", w: "var(--w)", h: "var(--h)", t: "translateZ(calc(var(--d) / 2))", fixed: 1 },
  { key: "back", bg: "#1c2a7a", w: "var(--w)", h: "var(--h)", t: "rotateY(180deg) translateZ(calc(var(--d) / 2))", fixed: 0.6 },
  { key: "lids", bg: "url(/kent/box/top.webp)", w: "var(--w)", h: "var(--d)", t: "rotateX(90deg) translateZ(calc(var(--h) / 2))", edge: -90 },
  { key: "base", bg: "#1c2a7a", w: "var(--w)", h: "var(--d)", t: "rotateX(-90deg) translateZ(calc(var(--h) / 2))", edge: 90 },
  { key: "right", bg: "url(/kent/box/side.webp)", w: "var(--d)", h: "var(--h)", t: "rotateY(90deg) translateZ(calc(var(--w) / 2))", edge: 0 },
  { key: "left", bg: "url(/kent/box/side.webp)", w: "var(--d)", h: "var(--h)", t: "rotateY(-90deg) translateZ(calc(var(--w) / 2))", edge: 180 },
] as const;

/** how far the box is tipped back from facing you, so you look down on it from a little above (degrees) */
const TILT = 36;
/** the turn at which VOILA reads left to right, and how far it sways either side of it (degrees) */
const READ = -90;
const SWAY = 20;
/** where the light comes from: the left, above, in front */
const LIGHT = [-0.45, -0.55, 0.7];
/** how fast it sways at rest and with the pointer on it */
const IDLE = 0.7;
const EAGER = 2.4;

/**
 * The VOILA Labs box, in 3D, lying face up on the corner of the hero's picture: the real packaging (its
 * faces unwrapped from Kent's product photo), seen from a little above, turning slowly on the spot like it's
 * on a shop counter, a soft shadow under it, each edge lit by how squarely it faces the light. It only sways
 * a little either side, so VOILA always reads. Point at it and it sways faster; click it and it spins round
 * once and the hero jumps to the coffee.
 */
export function VoilaBox({ onPick, className }: { onPick: () => void; className?: string }) {
  const spinner = useRef<HTMLSpanElement>(null);
  const faces = useRef<(HTMLSpanElement | null)[]>([]);
  const state = useRef({ angle: READ, phase: 0, speed: IDLE, spin: 0, eager: false });

  useEffect(() => {
    const el = spinner.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const s = state.current;
    const tilt = (TILT * Math.PI) / 180;
    const apply = () => {
      // tipped back to lie face up, then turned about its own upright
      el.style.transform = `rotateX(${TILT}deg) rotateZ(${s.angle}deg)`;
      FACES.forEach((f, i) => {
        const face = faces.current[i];
        if (!face) return;
        let b: number;
        if ("fixed" in f) b = f.fixed;
        else {
          const a = ((f.edge + s.angle) * Math.PI) / 180;
          const lit = Math.cos(a) * LIGHT[0] + Math.sin(a) * Math.cos(tilt) * LIGHT[1] + Math.sin(a) * Math.sin(tilt) * LIGHT[2];
          b = 0.42 + 0.7 * Math.max(0, lit);
        }
        face.style.filter = `brightness(${b.toFixed(3)})`;
      });
    };
    apply();
    if (reduce) return;
    let visible = true;
    const tick = (_: number, deltaMs: number) => {
      if (!visible) return;
      const dt = Math.min(deltaMs / 1000, 0.05);
      s.speed += ((s.eager ? EAGER : IDLE) - s.speed) * (1 - Math.exp(-dt * 1.7));
      s.phase += s.speed * dt;
      s.angle = READ + SWAY * Math.sin(s.phase) + s.spin;
      apply();
    };
    gsap.ticker.add(tick);
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(el);
    return () => {
      gsap.ticker.remove(tick);
      io.disconnect();
    };
  }, []);

  return (
    <button
      type="button"
      aria-label="VOILA Labs. Show the coffee."
      onClick={() => {
        const s = state.current;
        // once round, landing where it reads again
        gsap.to(s, { spin: Math.round(s.spin / 360) * 360 + 360, duration: 1.2, ease: "power3.out" });
        onPick();
      }}
      onPointerEnter={() => (state.current.eager = true)}
      onPointerLeave={() => (state.current.eager = false)}
      onFocus={() => (state.current.eager = true)}
      onBlur={() => (state.current.eager = false)}
      className={cn("grid cursor-pointer place-items-center perspective-[760px]", className)}
      style={{ "--w": "var(--box-w, 96px)", "--h": "calc(var(--w) * 1.4)", "--d": "calc(var(--w) * 0.32)", width: "calc(var(--h) * 1.5)", height: "calc(var(--w) * 1.6)" } as CSSProperties}
    >
      <span ref={spinner} aria-hidden className="relative block size-0 transform-3d">
        {/* its shadow on the paper, a little under it, turning with it */}
        <span
          className="absolute top-0 left-0 block rounded-[4px] bg-ink/35 blur-[7px]"
          style={{ width: "var(--w)", height: "var(--h)", marginLeft: "calc(var(--w) / -2)", marginTop: "calc(var(--h) / -2)", transform: "translateZ(calc(var(--d) / -2 - 12px))" }}
        />
        {FACES.map((f, i) => (
          <span
            key={f.key}
            ref={(el) => {
              faces.current[i] = el;
            }}
            className="absolute top-0 left-0 block bg-cover bg-center backface-hidden"
            style={{
              width: f.w,
              height: f.h,
              marginLeft: `calc(${f.w} / -2)`,
              marginTop: `calc(${f.h} / -2)`,
              transform: f.t,
              background: f.bg.startsWith("url") ? undefined : f.bg,
              backgroundImage: f.bg.startsWith("url") ? f.bg : undefined,
              backgroundSize: "cover",
            }}
          />
        ))}
      </span>
    </button>
  );
}
