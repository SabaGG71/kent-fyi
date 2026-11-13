"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { ABOUT, DINNER, FYIS, LOCALEYES, PODCASTS, SWIFT, TBILISI, VOILA, WINE } from "@/lib/kent";
import { proofOf, useProof } from "./proofs";

type Line = { text: string; from: string; href: string };

const sentences = (text: string) => text.split(/(?<=[.!?])\s+(?=[A-Z“"])/);
/** everything this page says, sentence by sentence, with where it says it */
const LINES: Line[] = [
  ...FYIS.map((f) => ({ text: f.text, from: `FYI ${f.n}`, href: `#${f.id}` })),
  ...sentences(VOILA.body).map((t) => ({ text: t, from: "Footnote 1, VOILA", href: "#voila" })),
  ...sentences(SWIFT.body).map((t) => ({ text: t, from: "Footnote 2, Swift", href: "#swift" })),
  ...sentences(LOCALEYES.body).map((t) => ({ text: t, from: "Footnote 3, LocalEyes", href: "#localeyes" })),
  ...sentences(DINNER.body).map((t) => ({ text: t, from: "Footnote 4, the Lunar Society", href: "#dinner" })),
  ...sentences(WINE.body).map((t) => ({ text: t, from: "Footnote 5, wine.fyi", href: "#wine" })),
  ...sentences(TBILISI.body).map((t) => ({ text: t, from: "Footnote 7, Tbilisi", href: "#tbilisi" })),
  ...PODCASTS.map((p) => ({ text: `${p.show}: ${p.title}.`, from: "Footnote 8, podcasts", href: "#podcasts" })),
  ...ABOUT.flatMap((p) => sentences(p).map((t) => ({ text: t, from: "About", href: "/about" }))),
  // the mono has no Georgian, and one wide letter would knock the whole grid out of line
].filter((l) => /^[ -~’“”]+$/.test(l.text));

const PAPER = "#ebeae7";
/** the proof's ink, a little lighter: the colour of the sentence you're reading */
const soften = (hex: string) => {
  const c = (o: number, p: number) => Math.round(parseInt(hex.slice(o, o + 2), 16) * 0.74 + p * 0.26);
  return `rgb(${c(1, 0xeb)},${c(3, 0xea)},${c(5, 0xe7)})`;
};

/**
 * The P.S.: Kent's portrait set entirely in type. Every character is from this page, the claims, the
 * footnotes and the about, run line after line in the mono like a typed sheet; where his face is dark the
 * letters are dark, where the sky was they're barely there, and his profile comes up out of the text. A
 * loupe follows the pointer and enlarges the letters under it so you can read them; the whole sentence
 * under it lights up blue wherever it runs through him, and is set large beside him with where it's from.
 * It types itself in the first time it's seen. Printed in the proof picked in the hero.
 */
export function TypedPortrait() {
  const box = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [reading, setReading] = useState<number | null>(null);
  const [count, setCount] = useState(0);
  const proof = proofOf(useProof());
  const ink = useRef(proof.ink);
  const repaint = useRef<() => void>(() => {});

  useEffect(() => {
    ink.current = proof.ink;
    repaint.current();
  }, [proof]);

  useEffect(() => {
    const host = box.current;
    const el = canvas.current;
    if (!host || !el) return;
    const ctx = el.getContext("2d");
    if (!ctx) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mono = getComputedStyle(document.documentElement).getPropertyValue("--font-fragment").trim() || "monospace";

    // the stream: every sentence, one after another, again and again until the sheet is full
    let stream = "";
    const owner: number[] = [];
    const extend = (n: number) => {
      while (stream.length < n) {
        LINES.forEach((l, i) => {
          const s = `${l.text} `;
          stream += s;
          for (let k = 0; k < s.length; k++) owner.push(i);
        });
      }
    };

    // the tone of his portrait: 0 bare paper to 1 full ink
    let tone: Float32Array | null = null;
    let tw = 0;
    let th = 0;
    const img = new Image();
    img.src = "/kent/portrait-tone.png";

    let W = 0;
    let H = 0;
    let dpr = 1;
    let fs = 7;
    let cw = 4;
    let lh = 8;
    let cols = 0;
    let rows = 0;
    let alpha = new Float32Array(0);
    const base = document.createElement("canvas");
    // the sentence under the loupe: each place it runs through him, letter by letter, and how far the blue has run
    let runs: number[][] = [];
    let litT = 0;
    let litFade = 0;
    let revealed = 0;
    let typing = false;
    const loupe = { x: 0, y: 0, tx: 0, ty: 0, a: 0, on: false };
    let hover = -1;
    let demo: gsap.core.Tween | null = null;

    const sample = (u: number, v: number) => {
      if (!tone) return 0;
      const x = Math.min(tw - 1, Math.max(0, u * tw));
      const y = Math.min(th - 1, Math.max(0, v * th));
      const x0 = Math.floor(x);
      const y0 = Math.floor(y);
      const x1 = Math.min(tw - 1, x0 + 1);
      const y1 = Math.min(th - 1, y0 + 1);
      const fx = x - x0;
      const fy = y - y0;
      const a = tone[y0 * tw + x0] * (1 - fx) + tone[y0 * tw + x1] * fx;
      const b = tone[y1 * tw + x0] * (1 - fx) + tone[y1 * tw + x1] * fx;
      return a * (1 - fy) + b * fy;
    };

    /** set the whole sheet once, letter by letter, each as dark as his portrait is there */
    const layout = () => {
      if (!tone || !W) return;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      fs = Math.max(3.8, Math.min(6, W / 124));
      ctx.font = `${fs}px ${mono}`;
      cw = ctx.measureText("M").width;
      // lines set tight, so there are more of them to draw him with
      lh = fs * 1.04;
      cols = Math.floor(W / cw);
      rows = Math.floor(H / lh);
      extend(cols * rows);
      alpha = new Float32Array(cols * rows);
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const t = sample((c + 0.5) / cols, (r + 0.5) / rows);
          // a steep curve: the sky barely there, his skin light, shadow and hair full ink
          alpha[r * cols + c] = 0.03 + 0.97 * t * t;
        }
      }
      setCount(cols * rows);
      paintBase();
      if (hover >= 0) findRuns(hover);
    };

    const paintBase = () => {
      base.width = Math.round(W * dpr);
      base.height = Math.round(H * dpr);
      const b = base.getContext("2d")!;
      b.setTransform(dpr, 0, 0, dpr, 0, 0);
      b.font = `${fs}px ${mono}`;
      b.textBaseline = "top";
      b.fillStyle = ink.current;
      // a few dozen shades, each set in one go
      const LEVELS = 24;
      const buckets: number[][] = Array.from({ length: LEVELS }, () => []);
      for (let i = 0; i < cols * rows; i++) buckets[Math.min(LEVELS - 1, Math.floor(alpha[i] * LEVELS))].push(i);
      b.strokeStyle = ink.current;
      b.lineWidth = fs * 0.085;
      b.lineJoin = "round";
      buckets.forEach((list, level) => {
        b.globalAlpha = (level + 0.5) / LEVELS;
        // the darkest places are set in bold, so his hair and outline hold more ink than any shade can
        const bold = level >= LEVELS * 0.78;
        for (const i of list) {
          const ch = stream[i];
          if (ch === " ") continue;
          const x = (i % cols) * cw;
          const y = Math.floor(i / cols) * lh;
          b.fillText(ch, x, y);
          if (bold) b.strokeText(ch, x, y);
        }
      });
      b.globalAlpha = 1;
    };

    /** every place a sentence runs through the sheet, each as its letters in reading order */
    function findRuns(line: number) {
      runs = [];
      let cur: number[] = [];
      for (let i = 0; i < cols * rows; i++) {
        if (owner[i] === line) cur.push(i);
        else if (cur.length) {
          runs.push(cur);
          cur = [];
        }
      }
      if (cur.length) runs.push(cur);
    }

    const draw = () => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      if (!cols) return;
      // the sheet, typed so far
      const full = Math.floor(revealed / cols);
      const part = revealed % cols;
      if (revealed >= cols * rows) ctx.drawImage(base, 0, 0, W, H);
      else {
        if (full) ctx.drawImage(base, 0, 0, base.width, full * lh * dpr, 0, 0, W, full * lh);
        if (part) ctx.drawImage(base, 0, full * lh * dpr, part * cw * dpr, lh * dpr, 0, full * lh, part * cw, lh);
      }
      // the sentence in bold, running through him as if it were being typed again
      if (runs.length && litFade > 0.01) {
        const p = Math.min(1, litT / 0.5);
        const soft = soften(ink.current);
        ctx.font = `${fs}px ${mono}`;
        ctx.textBaseline = "top";
        ctx.fillStyle = soft;
        ctx.strokeStyle = soft;
        ctx.lineWidth = fs * 0.085;
        ctx.lineJoin = "round";
        for (const run of runs) {
          const n = Math.ceil(run.length * p);
          for (let j = 0; j < n; j++) {
            const i = run[j];
            if (i >= revealed) break;
            const ch = stream[i];
            if (ch === " ") continue;
            const x = (i % cols) * cw;
            const y = Math.floor(i / cols) * lh;
            ctx.globalAlpha = litFade * Math.max(0.75, alpha[i]);
            ctx.fillText(ch, x, y);
            ctx.strokeText(ch, x, y);
          }
        }
        ctx.globalAlpha = 1;
      }
      // the loupe
      if (loupe.a > 0.01) {
        const R = Math.max(56, Math.min(96, W * 0.15));
        const mag = 3.6;
        ctx.save();
        ctx.globalAlpha = loupe.a;
        ctx.shadowColor = "rgba(11,14,16,0.22)";
        ctx.shadowBlur = 18;
        ctx.shadowOffsetY = 6;
        ctx.fillStyle = PAPER;
        ctx.beginPath();
        ctx.arc(loupe.x, loupe.y, R, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowColor = "transparent";
        ctx.clip();
        ctx.font = `${fs * mag}px ${mono}`;
        ctx.textBaseline = "top";
        const soft = soften(ink.current);
        ctx.strokeStyle = soft;
        ctx.lineWidth = fs * mag * 0.06;
        ctx.lineJoin = "round";
        const reach = R / mag + cw * 2;
        const c0 = Math.max(0, Math.floor((loupe.x - reach) / cw));
        const c1 = Math.min(cols - 1, Math.ceil((loupe.x + reach) / cw));
        const r0 = Math.max(0, Math.floor((loupe.y - reach) / lh));
        const r1 = Math.min(rows - 1, Math.ceil((loupe.y + reach) / lh));
        for (let r = r0; r <= r1; r++) {
          for (let c = c0; c <= c1; c++) {
            const i = r * cols + c;
            if (i >= revealed) continue;
            const ch = stream[i];
            if (ch === " ") continue;
            const on = owner[i] === hover;
            const x = loupe.x + (c * cw - loupe.x) * mag;
            const y = loupe.y + (r * lh - loupe.y) * mag;
            // the sentence you're on in bold, the rest stepped back so it reads
            ctx.fillStyle = on ? soft : ink.current;
            ctx.globalAlpha = loupe.a * (on ? 1 : 0.2 + 0.38 * alpha[i]);
            ctx.fillText(ch, x, y);
            if (on) ctx.strokeText(ch, x, y);
          }
        }
        ctx.restore();
        ctx.save();
        ctx.globalAlpha = loupe.a;
        ctx.strokeStyle = "rgba(11,14,16,0.28)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(loupe.x, loupe.y, R, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }
    };

    let visible = false;
    let idle = true;
    const tick = (_: number, deltaMs: number) => {
      if (!visible) return;
      const dt = Math.min(deltaMs / 1000, 0.05);
      let moving = false;
      if (typing) {
        revealed = Math.min(cols * rows, revealed + Math.ceil((cols * rows * dt) / 1.7));
        if (revealed >= cols * rows) typing = false;
        moving = true;
      }
      const k = 1 - Math.exp(-dt * 16);
      if (Math.abs(loupe.tx - loupe.x) + Math.abs(loupe.ty - loupe.y) > 0.1) {
        loupe.x += (loupe.tx - loupe.x) * k;
        loupe.y += (loupe.ty - loupe.y) * k;
        moving = true;
      }
      const a = loupe.on ? 1 : 0;
      if (Math.abs(loupe.a - a) > 0.005) {
        loupe.a += (a - loupe.a) * (1 - Math.exp(-dt * 10));
        moving = true;
      } else loupe.a = a;
      // the blue runs on, and fades when the loupe goes; the sentence stays beside him, to follow to its footnote
      if (runs.length && litT < 0.5) {
        litT += dt;
        moving = true;
      }
      const f = loupe.on ? 1 : 0;
      if (Math.abs(litFade - f) > 0.005) {
        litFade += (f - litFade) * (1 - Math.exp(-dt * (loupe.on ? 14 : 5)));
        moving = true;
      } else litFade = f;
      if (!loupe.on && litFade < 0.01 && hover >= 0) {
        hover = -1;
        runs = [];
        moving = true;
      }
      // the sentence under the middle of the loupe
      if (loupe.on && cols) {
        const c = Math.min(cols - 1, Math.max(0, Math.floor(loupe.x / cw)));
        const r = Math.min(rows - 1, Math.max(0, Math.floor(loupe.y / lh)));
        const line = owner[r * cols + c] ?? -1;
        if (line !== hover) {
          hover = line;
          findRuns(line);
          litT = 0;
          setReading(line);
          moving = true;
        }
      }
      if (moving || !idle) draw();
      idle = !moving;
    };
    gsap.ticker.add(tick);
    const wake = () => (idle = false);
    repaint.current = () => {
      if (!cols) return;
      paintBase();
      wake();
    };

    const size = () => {
      const w = host.clientWidth;
      const h = host.clientHeight;
      if (!w || !h) return;
      W = w;
      H = h;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      el.width = Math.round(w * dpr);
      el.height = Math.round(h * dpr);
      el.style.width = `${w}px`;
      el.style.height = `${h}px`;
      layout();
      if (!typing && (reduce || revealed > 0)) revealed = cols * rows;
      if (visible) intro();
      wake();
    };

    Promise.all([img.decode(), document.fonts.load(`10px ${mono}`, "FYI")]).then(() => {
      const c = document.createElement("canvas");
      tw = c.width = img.naturalWidth;
      th = c.height = img.naturalHeight;
      const x = c.getContext("2d")!;
      x.drawImage(img, 0, 0);
      const d = x.getImageData(0, 0, tw, th).data;
      tone = new Float32Array(tw * th);
      for (let i = 0; i < tw * th; i++) tone[i] = d[i * 4] / 255;
      size();
    }, () => {
      // without the portrait there's nothing to set; the sentence panel still reads
    });
    const ro = new ResizeObserver(size);
    ro.observe(host);

    // the first time it's seen it types itself in, then the loupe reads one line along his profile
    let shown = false;
    const intro = () => {
      if (shown || !cols) return;
      shown = true;
      if (reduce) {
        revealed = cols * rows;
        wake();
        return;
      }
      revealed = 0;
      typing = true;
      const path = { x: W * 0.36, y: H * 0.3 };
      demo = gsap.to(path, {
        x: W * 0.62,
        y: H * 0.5,
        duration: 2.4,
        delay: 1.9,
        ease: "sine.inOut",
        onStart: () => {
          loupe.x = loupe.tx = path.x;
          loupe.y = loupe.ty = path.y;
          loupe.on = true;
        },
        onUpdate: () => {
          loupe.tx = path.x;
          loupe.ty = path.y;
          wake();
        },
        onComplete: () => {
          loupe.on = false;
          demo = null;
          wake();
        },
      });
      wake();
    };
    const io = new IntersectionObserver(
      ([e]) => {
        visible = e.isIntersecting;
        if (visible) wake();
        if (visible && e.intersectionRatio > 0.4) intro();
      },
      { threshold: [0, 0.45] },
    );
    io.observe(host);

    const local = (e: PointerEvent) => {
      const r = host.getBoundingClientRect();
      return [e.clientX - r.left, e.clientY - r.top] as const;
    };
    const onMove = (e: PointerEvent) => {
      demo?.kill();
      demo = null;
      const [x, y] = local(e);
      if (!loupe.on) {
        loupe.x = x;
        loupe.y = y;
      }
      loupe.tx = x;
      loupe.ty = y;
      loupe.on = true;
      wake();
    };
    const onLeave = () => {
      loupe.on = false;
      wake();
    };
    host.addEventListener("pointermove", onMove);
    host.addEventListener("pointerdown", onMove);
    host.addEventListener("pointerleave", onLeave);

    return () => {
      gsap.ticker.remove(tick);
      ro.disconnect();
      io.disconnect();
      demo?.kill();
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerdown", onMove);
      host.removeEventListener("pointerleave", onLeave);
      repaint.current = () => {};
    };
  }, []);

  const line = reading !== null && reading >= 0 ? LINES[reading] : null;

  return (
    <figure className="grid grid-cols-1 gap-x-(--g) gap-y-8 lg:grid-cols-12">
      <div className="lg:col-span-6">
        <div
          ref={box}
          role="img"
          aria-label="A portrait of Kent in profile, set entirely in the text of this page. Move over it to read the letters."
          className="crop-marks relative aspect-[4/5] w-full cursor-none touch-pan-y select-none lg:ml-auto lg:w-[min(100%,calc((100svh-160px)*0.8))]"
        >
          <canvas ref={canvas} className="absolute inset-0" />
        </div>
      </div>
      <div className="flex flex-col lg:col-span-5 lg:col-start-8 lg:pt-[12svh]">
        {line ? (
          <a href={line.href} className="mono self-start text-ink/45 hover:text-link">
            {line.from} ↗
          </a>
        ) : (
          <p className="mono text-ink/45">Reading</p>
        )}
        <p key={line?.text ?? "none"} className="mt-3 min-h-[3lh] animate-[fade-in_400ms_ease_both] text-[clamp(22px,2.3vw,34px)] leading-[1.14] tracking-[-0.02em] text-balance text-ink/75 lg:min-h-[6lh]">
          {line ? line.text : "Move over his face and read what it’s made of."}
        </p>
        <p className="mono mt-auto pt-10 text-ink/55">
          Fig. 9 &nbsp;Kent, set in his own footnotes{count ? `, ${count.toLocaleString("en-US")} letters` : ""}.
        </p>
      </div>
    </figure>
  );
}
