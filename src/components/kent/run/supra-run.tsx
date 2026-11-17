"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Noto_Sans_Georgian } from "next/font/google";
import { gsap } from "@/lib/gsap";
import { cn } from "@/lib/utils";
import { proofOf, rgb, useProof } from "../proofs";
import { Kent, LINK, bottle, dog, hole, inkHead, laundry, letter, sparks, supra, type Pose, type Spark } from "./figures";
import { GROUND, VIEW_H, buildCity, css, drawLayer, gondolaAt, palette, rng, type City, type Palette } from "./world";

// the Georgian letters, on the street and in the corner
const georgian = Noto_Sans_Georgian({ subsets: ["georgian"], weight: ["500", "600"], variable: "--font-georgian", display: "swap" });

/** four words every newcomer trips over, in the order you meet them on the way to dinner */
export const WORDS = [
  { ka: "ღვინო", lat: "gvino", en: "wine" },
  { ka: "გმადლობთ", lat: "gmadlobt", en: "thank you" },
  { ka: "გვფრცქვნი", lat: "gvprtskvni", en: "you peel us. Eight consonants in a row." },
  { ka: "გაუმარჯოს", lat: "gaumarjos", en: "cheers. Literally, victory to you." },
] as const;
const LETTERS = WORDS.map((w) => [...w.ka]);

/** where Kent runs from the left of the view, and the physics, in world units and seconds */
const PLAYER_X = 46;
const GRAVITY = 816;
const JUMP_V = 262;
const SPEED = 77;
/** how far one stride carries him (two steps) */
const STRIDE = 34;
const LIVES = 3;
const LILAC = "#b7a6e6";

type Kind = "letter" | "bottle" | "dog" | "hole" | "laundry" | "supra";
type Thing = { id: number; kind: Kind; x: number; y: number; w: number; h: number; taken?: boolean; glyph?: string; seed?: number; alert?: number };
type Mode = "title" | "play" | "word" | "over" | "win";
type Hud = { mode: Mode; word: number; letter: number; lives: number; wine: number; time: number; paused: boolean };

/**
 * Supra Run: the P.S. Kent is late for a supra, a Georgian feast, on the other side of Tbilisi at dusk. On
 * the way he picks up the letters of four Georgian words in order, and wine for the table; he jumps the
 * street dogs and the open manholes and ducks under the laundry. Spell all four and he makes it to the
 * table: gaumarjos. ↑ jumps (hold it to go higher), ↓ ducks, ← and → slow down and speed up; on a phone,
 * the buttons. The keys belong to the game only while it has focus, so the page scrolls as usual.
 *
 * The city is a silhouette printed in the proof picked in the hero (see world.ts), so picking another proof
 * re-inks it while you play; Kent is the one figure in colour (see figures.ts).
 */
export function SupraRun() {
  const box = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [hud, setHud] = useState<Hud>({ mode: "title", word: 0, letter: 0, lives: LIVES, wine: 0, time: 0, paused: false });
  const keys = useRef({ up: false, down: false, left: false, right: false, jumpQueued: 0 });
  const api = useRef<{ start: () => void; pause: (p: boolean) => void } | null>(null);
  const proof = proofOf(useProof());
  const pal = useRef<Palette>(palette(rgb(proof.ink), rgb(proof.flood)));
  const repaint = useRef<() => void>(() => {});

  // a new proof re-inks the whole street
  useEffect(() => {
    pal.current = palette(rgb(proof.ink), rgb(proof.flood));
    repaint.current();
  }, [proof]);

  useEffect(() => {
    const el = canvas.current;
    const host = box.current;
    if (!el || !host) return;
    const ctx = el.getContext("2d");
    if (!ctx) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // ---- the city and Kent ----------------------------------------------------------------------------------
    let city: City | null = null;
    const kent = new Kent();
    const headImg = new Image();
    headImg.decoding = "async";
    headImg.src = "/kent/run/kent-head.png";
    let head: ReturnType<typeof inkHead> | null = null;
    let headFor = "";
    let family = "sans-serif";
    void document.fonts.load(`600 15px ${getComputedStyle(host).getPropertyValue("--font-georgian").trim() || "sans-serif"}`, "ღვინო").then(() => {
      family = getComputedStyle(host).getPropertyValue("--font-georgian").trim() || "sans-serif";
    });
    const r0 = rng(3);
    const motes = Array.from({ length: 28 }, () => ({ x: r0() * 320, y: 18 + r0() * 62, v: 1.5 + r0() * 3, f: 0.4 + r0() * 0.8, p: r0() * 6, s: 0.14 + r0() * 0.22 }));

    // ---- the state of play --------------------------------------------------------------------------------------
    let W = 250;
    let k = 4;
    const g = {
      mode: "title" as Mode,
      paused: false,
      cam: 0,
      lift: 0,
      y: GROUND,
      vy: 0,
      grounded: true,
      coyote: 0,
      duck: false,
      inv: 0,
      phase: 0,
      lives: LIVES,
      wine: 0,
      word: 0,
      letter: 0,
      time: 0,
      wordHold: 0,
      spawnX: 0,
      supraPlaced: false,
      things: [] as Thing[],
      sparks: [] as (Spark & { g: number })[],
      nextId: 1,
      rand: rng(7),
    };
    const publish = () => setHud({ mode: g.mode, word: g.word, letter: g.letter, lives: g.lives, wine: g.wine, time: g.time, paused: g.paused });

    const reset = () => {
      Object.assign(g, { cam: 0, y: GROUND, vy: 0, grounded: true, coyote: 0, duck: false, inv: 0, lives: LIVES, wine: 0, word: 0, letter: 0, time: 0, wordHold: 0, supraPlaced: false });
      g.things = [];
      g.sparks = [];
      g.spawnX = W + 30;
      g.rand = rng(Math.floor(Math.random() * 1e9));
    };

    // ---- the course, laid out just ahead of the camera ----------------------------------------------------------
    const add = (t: Omit<Thing, "id">) => g.things.push({ ...t, id: g.nextId++ });
    const speed = () => {
      const kk = keys.current;
      const narrow = Math.max(0.72, Math.min(1, W / 248));
      return SPEED * narrow * (1 + Math.min(g.word, 3) * 0.12) * (kk.left ? 0.62 : kk.right ? 1.3 : 1);
    };
    const spawn = () => {
      const r = g.rand;
      while (g.spawnX < g.cam + W + 70) {
        if (g.word >= WORDS.length) {
          if (!g.supraPlaced) {
            add({ kind: "supra", x: g.spawnX + 50, y: GROUND - 43, w: 80, h: 43 });
            g.supraPlaced = true;
          }
          g.spawnX += 100;
          continue;
        }
        const s = SPEED * (1 + g.word * 0.12);
        const gap = s * (0.72 + r() * 0.55);
        const needLetter = !g.things.some((t) => t.kind === "letter" && !t.taken);
        const glyph = LETTERS[g.word][g.letter];
        const roll = r();
        if (needLetter && roll < 0.6) {
          const high = r() < 0.4;
          add({ kind: "letter", x: g.spawnX, y: high ? GROUND - 72 : GROUND - 38, w: 16, h: 18, glyph });
          g.spawnX += 16 + gap * 0.7;
        } else if (roll < 0.74) {
          add({ kind: "dog", x: g.spawnX, y: GROUND - 9, w: 18, h: 9, alert: 0 });
          if (r() < 0.55) add({ kind: "bottle", x: g.spawnX + 7, y: GROUND - 60, w: 6, h: 12.5 });
          g.spawnX += 18 + gap;
        } else if (roll < 0.86) {
          add({ kind: "hole", x: g.spawnX, y: GROUND - 4, w: 25, h: 10 });
          if (needLetter && r() < 0.5) add({ kind: "letter", x: g.spawnX + 4, y: GROUND - 70, w: 16, h: 18, glyph });
          else add({ kind: "bottle", x: g.spawnX + 8, y: GROUND - 58, w: 6, h: 12.5 });
          g.spawnX += 25 + gap;
        } else if (roll < 0.94) {
          add({ kind: "laundry", x: g.spawnX, y: GROUND - 55, w: 46, h: 52, seed: Math.floor(r() * 3) });
          add({ kind: "bottle", x: g.spawnX + 21, y: GROUND - 13, w: 6, h: 12.5 });
          g.spawnX += 46 + gap;
        } else {
          for (let i = 0; i < 3; i++) add({ kind: "bottle", x: g.spawnX + i * 12.5, y: GROUND - (i === 1 ? 43 : 25), w: 6, h: 12.5 });
          g.spawnX += 37 + gap;
        }
      }
    };

    const burst = (x: number, y: number, colors: string[], n = 14, grav = 60) => {
      for (let i = 0; i < n; i++) {
        const a = (i / n) * Math.PI * 2 + Math.random() * 0.3;
        const v = 18 + Math.random() * 30;
        g.sparks.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 14, life: 0.55 + Math.random() * 0.3, color: colors[i % colors.length], size: 0.32 + Math.random() * 0.3, g: grav });
      }
    };

    // ---- one step of the game -----------------------------------------------------------------------------------
    const overlap = (ax: number, ay: number, aw: number, ah: number, bx: number, by: number, bw: number, bh: number) => ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by;

    const step = (dt: number) => {
      const kk = keys.current;
      if (g.mode === "title") {
        // the street drifts by while it waits, unless motion should stay still
        if (!reduce) {
          g.cam += 40 * dt;
          g.phase += ((dt * 40) / STRIDE) * Math.PI * 2;
        }
        return;
      }
      if (g.mode === "word") {
        g.wordHold -= dt;
        if (g.wordHold <= 0) {
          g.word += 1;
          g.letter = 0;
          // a word learned gives back a life
          g.lives = Math.min(LIVES, g.lives + 1);
          g.mode = "play";
          publish();
        }
        return;
      }
      if (g.mode !== "play" || g.paused) return;

      const v = speed();
      g.time += dt;
      g.cam += v * dt;
      g.phase += ((dt * v) / STRIDE) * Math.PI * 2;
      g.inv = Math.max(0, g.inv - dt);

      // jumping: a press counts for a moment before landing, and a moment after leaving an edge
      if (kk.jumpQueued > 0) kk.jumpQueued -= dt;
      if (kk.jumpQueued > 0 && (g.grounded || g.coyote > 0)) {
        g.vy = -JUMP_V;
        g.grounded = false;
        g.coyote = 0;
        kk.jumpQueued = 0;
      }
      const hold = kk.up && g.vy < 0 ? 0.7 : 1;
      g.vy += GRAVITY * hold * dt + (kk.down && !g.grounded ? GRAVITY * 0.9 * dt : 0);
      g.y += g.vy * dt;
      if (g.y >= GROUND) {
        if (!g.grounded && g.vy > 120) burst(PLAYER_X + 5, GROUND, [css(pal.current.horizon, 0.8)], 7, -20);
        g.y = GROUND;
        g.vy = 0;
        g.grounded = true;
        g.coyote = 0.08;
      } else {
        g.grounded = false;
        g.coyote -= dt;
      }
      g.duck = kk.down && g.grounded;

      spawn();

      // what Kent touches: his body, a little inside the drawing, 10 wide, 27 tall standing, 18 ducking
      const px = g.cam + PLAYER_X;
      const ph = g.duck ? 18 : 27;
      const py = g.y - ph;
      for (const t of g.things) {
        if (t.taken) continue;
        if (t.kind === "dog") t.alert = Math.min(1, Math.max(0, (t.alert ?? 0) + (t.x - px < 60 && t.x - px > -24 ? dt * 5 : -dt * 2)));
        if (t.kind === "letter" && overlap(px, py, 10, ph, t.x, t.y, t.w, t.h)) {
          t.taken = true;
          g.letter += 1;
          burst(t.x + 8 - g.cam, t.y + 9, [LINK, "#ffffff", css(pal.current.halo)]);
          if (g.letter >= LETTERS[g.word].length) {
            g.mode = "word";
            g.wordHold = 2.4;
            // clear the street ahead, so the next word starts fresh
            g.things = g.things.filter((o) => o.x < g.cam + W * 0.6 || o.kind === "supra");
            g.spawnX = g.cam + W + 30;
          }
          publish();
        } else if (t.kind === "bottle" && overlap(px, py, 10, ph, t.x, t.y, t.w, t.h)) {
          t.taken = true;
          g.wine += 1;
          burst(t.x + 3 - g.cam, t.y + 6, [LILAC, "#ffffff"], 10);
          publish();
        } else if (g.inv <= 0) {
          const hit =
            (t.kind === "dog" && overlap(px, py, 10, ph, t.x + 1.7, t.y + 2.5, 14, 6.6)) ||
            (t.kind === "hole" && g.grounded && px + 5 > t.x + 5 && px + 5 < t.x + 17.5) ||
            (t.kind === "laundry" && overlap(px, py, 10, ph, t.x + 4, t.y + 10, 38, 25));
          if (hit) {
            g.lives -= 1;
            g.inv = 1.4;
            g.vy = -142;
            g.grounded = false;
            if (g.lives <= 0) g.mode = "over";
            publish();
          }
        }
        if (t.kind === "supra" && g.cam + PLAYER_X + 7 >= t.x + 3) {
          g.mode = "win";
          publish();
        }
      }
      g.things = g.things.filter((t) => t.x + t.w > g.cam - 40 && !(t.taken && t.kind !== "supra"));
    };

    // ---- drawing -----------------------------------------------------------------------------------------------
    const haze = (p: Palette, y0: number, y1: number, a: number, par: number) => {
      const off = g.lift * par;
      const gr = ctx.createLinearGradient(0, y0 + off, 0, y1 + off);
      gr.addColorStop(0, css(p.haze, 0));
      gr.addColorStop(1, css(p.haze, a));
      ctx.fillStyle = gr;
      ctx.fillRect(0, y0 + off, W, VIEW_H - y0 + 40);
    };
    const glow = (x: number, y: number, r: number, color: readonly [number, number, number], a: number) => {
      const gr = ctx.createRadialGradient(x, y, 0, x, y, r);
      gr.addColorStop(0, css(color, a));
      gr.addColorStop(1, css(color, 0));
      ctx.fillStyle = gr;
      ctx.fillRect(x - r, y - r, r * 2, r * 2);
    };

    const draw = (time: number) => {
      if (!city) city = buildCity();
      const p = pal.current;
      const c = city;
      if (headImg.complete && headImg.naturalWidth && headFor !== `${k}${p.body}`) {
        head = inkHead(headImg, k, p.body);
        headFor = `${k}${p.body}`;
      }
      ctx.setTransform(k, 0, 0, k, 0, 0);
      // the sky, and the sun going down behind the hills
      const sky = ctx.createLinearGradient(0, 0, 0, VIEW_H);
      sky.addColorStop(0, p.skyTop);
      sky.addColorStop(0.7, p.skyLow);
      sky.addColorStop(1, p.skyLow);
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, W, VIEW_H);
      const sunY = 41 + g.lift * 0.03;
      glow(W * 0.74, sunY, 30, p.halo, 0.55);
      ctx.fillStyle = p.sun;
      ctx.beginPath();
      ctx.arc(W * 0.74, sunY, 7.5, 0, Math.PI * 2);
      ctx.fill();

      // Mtatsminda, the TV tower's light
      drawLayer(ctx, k, c.mountains, g.cam, g.lift, W, () => {
        ctx.fillStyle = p.far;
        ctx.fill(c.mountains.fill);
        ctx.strokeStyle = p.far;
        ctx.lineWidth = 0.34;
        ctx.stroke(c.mountains.lines!);
        for (const [x, y] of c.mountains.glows ?? []) glow(x, y, 2.4, p.lightRgb, 0.9);
      });
      haze(p, 36, 84, 0.5, 0.05);
      // Narikala, Mother of Georgia, Sameba, the cable car going up and down
      drawLayer(ctx, k, c.hills, g.cam, g.lift, W, () => {
        ctx.fillStyle = p.hill;
        ctx.fill(c.hills.fill);
        ctx.fillStyle = p.light;
        ctx.fill(c.hills.lights!);
        ctx.strokeStyle = p.hill;
        ctx.lineWidth = 0.16;
        ctx.stroke(c.hills.lines!);
        for (let i = 0; i < 2; i++) {
          const u = (((reduce ? 0.3 : time * 0.022) + i * 0.5) % 1) * 2;
          const [gx, gy] = gondolaAt(u < 1 ? u : 2 - u);
          ctx.fillStyle = p.hill;
          ctx.fillRect(gx - 0.08, gy, 0.16, 0.9);
          ctx.fillRect(gx - 0.9, gy + 0.9, 1.8, 1.4);
          ctx.fillStyle = p.light;
          ctx.fillRect(gx - 0.55, gy + 1.15, 1.1, 0.5);
        }
      });
      haze(p, 52, 90, 0.42, 0.14);
      // the old town
      drawLayer(ctx, k, c.town, g.cam, g.lift, W, () => {
        ctx.fillStyle = p.town;
        ctx.fill(c.town.fill);
        ctx.fillStyle = p.light;
        ctx.fill(c.town.lights!);
      });
      haze(p, 64, 92, 0.34, 0.3);
      // the street side: lamps lit, plane trees, the railing, the Lada
      drawLayer(ctx, k, c.street, g.cam, g.lift, W, () => {
        for (const [x, y, r] of c.street.glows ?? []) glow(x, y, r, p.lightRgb, 0.32);
        ctx.fillStyle = p.street;
        ctx.fill(c.street.fill);
        ctx.fillStyle = p.light;
        ctx.fill(c.street.lights!);
      });
      // dust in the last of the light
      ctx.setTransform(k, 0, 0, k, 0, 0);
      for (const m of motes) {
        const span = W + 20;
        const x = ((((m.x - (reduce ? 0 : time * m.v) - g.cam * 0.45) % span) + span) % span) - 10;
        const y = m.y + Math.sin(time * m.f + m.p) * 1.4 + g.lift * 0.5;
        ctx.fillStyle = css(p.halo, 0.5);
        ctx.beginPath();
        ctx.arc(x, y, m.s, 0, Math.PI * 2);
        ctx.fill();
      }
      // the pavement
      drawLayer(ctx, k, c.pavement, g.cam, g.lift, W, () => {
        ctx.fillStyle = p.ground;
        ctx.fill(c.pavement.fill);
        ctx.strokeStyle = p.joint;
        ctx.lineWidth = 0.12;
        ctx.stroke(c.pavement.lines!);
        ctx.fillStyle = p.edge;
        ctx.fillRect(0, GROUND - 0.15, c.pavement.period, 0.4);
      });

      // what's on the street, then Kent, then the sparks
      ctx.setTransform(k, 0, 0, k, 0, g.lift * k);
      for (const holes of [true, false]) {
        for (const t of g.things) {
          if ((t.kind === "hole") !== holes) continue;
          const sx = t.x - g.cam;
          if (sx > W + 10 || sx + t.w < -12) continue;
          const bob = reduce ? 0 : Math.sin(time * 3 + t.id) * 1.2;
          if (t.kind === "letter" && t.glyph) letter(ctx, sx, t.y + bob, t.glyph, family, k, p);
          else if (t.kind === "bottle") bottle(ctx, sx, t.y + bob * 0.6, p);
          else if (t.kind === "dog") dog(ctx, sx, t.y, t.alert ?? 0, time, p);
          else if (t.kind === "hole") hole(ctx, sx, p);
          else if (t.kind === "laundry") laundry(ctx, sx, t.y, t.seed ?? 0, reduce ? 0 : time, p);
          else if (t.kind === "supra") supra(ctx, sx, t.y, time, k, p);
        }
      }
      const blink = g.inv > 0 && Math.floor(time * 10) % 2 === 0;
      kent.draw(ctx, PLAYER_X + 5, g.y, p, head, blink ? 0.35 : 1);
      sparks(ctx, g.sparks);
      ctx.setTransform(k, 0, 0, k, 0, 0);
    };

    // ---- the loop ----------------------------------------------------------------------------------------------
    let visible = false;
    let acc = 0;
    let lastPublish = 0;
    const STEP = 1 / 120;
    const tick = (time: number, deltaMs: number) => {
      if (!visible) return;
      if (g.mode === "play" && !g.paused && time - lastPublish > 0.2) {
        lastPublish = time;
        publish();
      }
      const dt = Math.min(deltaMs / 1000, 0.05);
      acc += dt;
      while (acc >= STEP) {
        step(STEP);
        for (const s of g.sparks) {
          s.x += s.vx * STEP;
          s.y += s.vy * STEP;
          s.vy += s.g * STEP;
          s.life -= STEP;
        }
        g.sparks = g.sparks.filter((s) => s.life > 0);
        acc -= STEP;
      }
      // the camera rises with him when he jumps high
      const top = g.y - 30;
      g.lift += (Math.min(12, Math.max(0, 8 - top)) - g.lift) * (1 - Math.exp(-dt * 6));
      let pose: Pose = "run";
      if (g.mode === "play") pose = !g.grounded ? (g.vy < 0 ? "jump" : "fall") : g.duck ? "duck" : "run";
      else if (g.mode === "word" || g.mode === "win") pose = "cheer";
      else if (g.mode === "over") pose = "sad";
      else if (reduce) pose = "stand";
      kent.update(g.mode === "play" && g.paused ? 0 : dt, pose, g.phase);
      draw(time);
    };
    gsap.ticker.add(tick);
    repaint.current = () => {
      if (visible) draw(gsap.ticker.time);
    };

    // ---- size: the view is 100 units tall, as tall as fits ---------------------------------------------------
    const size = () => {
      const cw = host.clientWidth;
      const maxH = Math.max(240, Math.min(560, window.innerHeight * 0.64));
      const scale = Math.min(maxH / VIEW_H, cw / 150);
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = cw / scale;
      k = scale * dpr;
      el.width = Math.round(cw * dpr);
      el.height = Math.round(VIEW_H * scale * dpr);
      el.style.width = `${cw}px`;
      el.style.height = `${VIEW_H * scale}px`;
      if (g.mode === "title") g.spawnX = W + 30;
      if (visible) draw(gsap.ticker.time);
    };
    const ro = new ResizeObserver(size);
    ro.observe(host);
    size();

    const io = new IntersectionObserver(
      ([e]) => {
        visible = e.isIntersecting;
        if (visible) draw(gsap.ticker.time);
        else if (g.mode === "play" && !g.paused) {
          g.paused = true;
          publish();
        }
      },
      { rootMargin: "120px 0px" },
    );
    io.observe(host);

    api.current = {
      start: () => {
        if (g.mode === "play" && g.paused) {
          g.paused = false;
          publish();
          return;
        }
        if (g.mode === "play" || g.mode === "word") return;
        reset();
        g.mode = "play";
        g.paused = false;
        publish();
      },
      pause: (p) => {
        if (g.mode !== "play" || g.paused === p) return;
        g.paused = p;
        publish();
      },
    };

    return () => {
      gsap.ticker.remove(tick);
      ro.disconnect();
      io.disconnect();
      api.current = null;
      repaint.current = () => {};
    };
  }, []);

  // ---- the keys belong to the game only while it has focus -----------------------------------------------------
  const press = (key: string, down: boolean) => {
    const kk = keys.current;
    if (key === "ArrowUp" || key === " " || key === "w" || key === "W") {
      if (down && !kk.up) kk.jumpQueued = 0.12;
      kk.up = down;
    } else if (key === "ArrowDown" || key === "s" || key === "S") kk.down = down;
    else if (key === "ArrowLeft" || key === "a" || key === "A") kk.left = down;
    else if (key === "ArrowRight" || key === "d" || key === "D") kk.right = down;
    else return false;
    return true;
  };
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || ((e.key === "ArrowUp" || e.key === " ") && hud.mode !== "play")) {
      e.preventDefault();
      api.current?.start();
      if (e.key !== "Enter") press(e.key, true);
      return;
    }
    if (e.key === "Escape") return api.current?.pause(true);
    if (press(e.key, true)) e.preventDefault();
  };
  const onKeyUp = (e: React.KeyboardEvent) => {
    if (press(e.key, false)) e.preventDefault();
  };
  const hold = (key: string) => ({
    onPointerDown: (e: React.PointerEvent) => {
      e.preventDefault();
      api.current?.start();
      press(key, true);
    },
    onPointerUp: () => press(key, false),
    onPointerLeave: () => press(key, false),
    onPointerCancel: () => press(key, false),
  });

  const word = WORDS[Math.min(hud.word, WORDS.length - 1)];
  const letters = [...word.ka];
  const allLearned = hud.word >= WORDS.length;
  const seconds = hud.time.toFixed(1);
  const georgianType = { fontFamily: "var(--font-georgian)" } as CSSProperties;
  const veil = "bg-[linear-gradient(to_left,rgb(235_234_231/0.9)_0%,rgb(235_234_231/0.72)_40%,rgb(235_234_231/0)_72%)] max-sm:bg-[rgb(235_234_231/0.78)]";

  return (
    <div className={cn(georgian.variable, "select-none")}>
      <div
        ref={box}
        tabIndex={0}
        role="application"
        aria-label="Supra Run, a game. Press Enter to start. Up jumps, down ducks, left and right slow down and speed up."
        onKeyDown={onKeyDown}
        onKeyUp={onKeyUp}
        onBlur={() => api.current?.pause(true)}
        onPointerDown={() => {
          if (hud.mode !== "play" || hud.paused) api.current?.start();
          else keys.current.jumpQueued = 0.12;
        }}
        className="relative overflow-hidden outline-offset-4"
        style={{ background: proof.flood }}
      >
        <canvas ref={canvas} className="block" />

        {/* the word being spelled, set like the list up top: done in ink, the next letter blue, the rest grey */}
        {hud.mode !== "title" && (
          <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between gap-6 px-[clamp(14px,2vw,28px)] pt-[clamp(12px,1.7vw,24px)]">
            {allLearned ? (
              <p className="mono text-ink/75">All four words. Now, to the table.</p>
            ) : (
              <div>
                <p className="flex text-[clamp(24px,2.7vw,40px)] leading-none font-medium" style={georgianType}>
                  {letters.map((l, i) => (
                    <span key={i} className={cn("transition-colors duration-300", i < hud.letter || hud.mode === "word" ? "text-ink/75" : i === hud.letter ? "text-link" : "text-ink/20")}>
                      {l}
                    </span>
                  ))}
                </p>
                <p className="mono mt-2 text-ink/60">
                  {word.lat}, {word.en.split(".")[0]}
                </p>
              </div>
            )}
            <p className="mono text-right leading-relaxed text-ink/70 tabular-nums">
              Wine {String(hud.wine).padStart(2, "0")}
              <br />
              <span aria-label={`${hud.lives} of ${LIVES} lives`}>
                {"●".repeat(Math.max(0, hud.lives))}
                <span className="text-ink/25">{"●".repeat(Math.max(0, LIVES - hud.lives))}</span>
              </span>
              <br />
              {seconds}s
            </p>
          </div>
        )}

        {/* between runs: type on the street, no boxes */}
        {(hud.mode === "title" || hud.mode === "over" || (hud.mode === "play" && hud.paused)) && (
          <div className={cn("pointer-events-none absolute inset-0 flex items-center justify-end px-[clamp(18px,4.5vw,72px)] max-sm:justify-center", veil)}>
            <div className="max-w-[400px]">
              {hud.mode === "title" && (
                <>
                  <p className="text-[clamp(30px,3.4vw,52px)] leading-[1.02] tracking-[-0.025em] text-ink/80">Supra Run</p>
                  <p className="mt-3 text-[clamp(15px,1.15vw,17px)] leading-snug text-pretty text-ink/75">
                    Kent is late for dinner. Run him across Tbilisi, pick up the letters of four Georgian words in order, and some wine for the table.
                  </p>
                  <p className="mono mt-4 text-ink/55">↑ jump, hold to go higher · ↓ duck · ← → slower, faster</p>
                  <p className="mono mt-4 text-link">Press Enter, or tap, to start</p>
                </>
              )}
              {hud.mode === "play" && hud.paused && (
                <>
                  <p className="text-[clamp(26px,2.6vw,40px)] leading-tight text-ink/80">Paused</p>
                  <p className="mono mt-3 text-link">Press Enter, or tap, to carry on</p>
                </>
              )}
              {hud.mode === "over" && (
                <>
                  <p className="text-[clamp(30px,3.4vw,52px)] leading-[1.02] tracking-[-0.025em] text-ink/80">Tripped up.</p>
                  <p className="mt-3 text-[clamp(15px,1.15vw,17px)] text-ink/75">
                    {hud.word} of {WORDS.length} words, {hud.wine} bottles of wine.
                  </p>
                  <p className="mono mt-4 text-link">Press Enter, or tap, to run again</p>
                </>
              )}
            </div>
          </div>
        )}
        {(hud.mode === "word" || hud.mode === "win") && (
          <div className="pointer-events-none absolute inset-0 grid place-items-center bg-[radial-gradient(closest-side,rgb(235_234_231/0.82),rgb(235_234_231/0))] px-4 text-center">
            {hud.mode === "word" ? (
              <div>
                <p className="text-[clamp(44px,6vw,96px)] leading-none font-medium text-ink/80" style={georgianType}>
                  {WORDS[hud.word].ka}
                </p>
                <p className="mt-3 text-[clamp(18px,1.6vw,24px)] text-ink/80">{WORDS[hud.word].lat}</p>
                <p className="mono mt-1 text-ink/60">{WORDS[hud.word].en}</p>
              </div>
            ) : (
              <div>
                <p className="text-[clamp(44px,6vw,96px)] leading-none font-medium text-link" style={georgianType}>
                  გაუმარჯოს!
                </p>
                <p className="mt-3 text-[clamp(18px,1.6vw,24px)] text-ink/80">Gaumarjos. You made it to dinner.</p>
                <p className="mono mt-1 text-ink/60">
                  Four words, {hud.wine} bottles of wine, {seconds}s.
                </p>
                <p className="mono mt-4 text-link">Press Enter, or tap, to run again</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* on a phone: the buttons */}
      <div className="mt-3 grid grid-cols-4 gap-2 [@media(pointer:fine)]:hidden">
        {(
          [
            ["ArrowLeft", "←", "Slower"],
            ["ArrowDown", "↓", "Duck"],
            ["ArrowUp", "↑", "Jump"],
            ["ArrowRight", "→", "Faster"],
          ] as const
        ).map(([key, glyph, label]) => (
          <button key={key} type="button" aria-label={label} {...hold(key)} className="mono h-12 touch-none border border-fg/25 text-[18px] text-fg/80 active:bg-fg active:text-bg">
            {glyph}
          </button>
        ))}
      </div>
    </div>
  );
}
