/**
 * Supra Run's Tbilisi at dusk, printed in two inks: the ink and the flood of the proof picked in the hero.
 * Five layers of silhouette, each a little further into the haze than the one in front: Mtatsminda with
 * its TV tower; Narikala's walls, Mother of Georgia and Sameba's dome catching the last light, the cable
 * car crawling up to the fortress; the old town's houses and balconies with their windows lit, a Georgian
 * church's cone among them; the street's lamps, plane trees and railings; then the pavement Kent runs on.
 * The shapes are built once, in world units (the view is 100 tall), and filled in whatever proof is
 * picked, so a new proof re-inks the city on the spot.
 */

export const VIEW_H = 100;
/** where feet touch the pavement */
export const GROUND = 84;

export type Rgb = readonly [number, number, number];

/** a deterministic random, so the city comes out the same every time */
export function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const WHITE: Rgb = [1, 1, 1];
const mixRgb = (a: Rgb, b: Rgb, t: number): Rgb => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
export const css = (c: Rgb, alpha = 1) => `rgba(${Math.round(c[0] * 255)},${Math.round(c[1] * 255)},${Math.round(c[2] * 255)},${alpha})`;

/** every colour in the scene, from the proof's two inks */
export function palette(ink: Rgb, flood: Rgb) {
  const horizon = mixRgb(flood, WHITE, 0.42);
  const layer = (t: number) => mixRgb(horizon, ink, t);
  const warm: Rgb = [1, 0.93, 0.8];
  return {
    ink,
    flood,
    horizon,
    skyTop: css(mixRgb(flood, ink, 0.1)),
    skyLow: css(horizon),
    sun: css(mixRgb(flood, WHITE, 0.9)),
    halo: mixRgb(flood, WHITE, 0.75),
    far: css(layer(0.15)),
    hill: css(layer(0.29)),
    town: css(layer(0.47)),
    street: css(layer(0.66)),
    ground: css(layer(0.86)),
    edge: css(mixRgb(layer(0.86), horizon, 0.4)),
    joint: css(mixRgb(layer(0.86), horizon, 0.12)),
    /** lit windows, lamps, the light on Sameba's dome */
    light: css(mixRgb(mixRgb(flood, WHITE, 0.78), warm, 0.55)),
    lightRgb: mixRgb(mixRgb(flood, WHITE, 0.78), warm, 0.55),
    /** the haze between layers */
    haze: horizon,
    body: css(ink),
    farBody: css(mixRgb(ink, horizon, 0.2)),
  };
}
export type Palette = ReturnType<typeof palette>;

/** one layer of the city: its shapes, how wide before it repeats, and how fast it goes by */
export type Layer = { period: number; parallax: number; fill: Path2D; lines?: Path2D; lights?: Path2D; glows?: [number, number, number][] };

const TAU = Math.PI * 2;
const bump = (x: number, at: number, height: number, width: number) => height * Math.exp(-(((x - at) / width) ** 2));

/** a ridge from `bottom` up to top(x), across one period */
function ridge(p: Path2D, period: number, bottom: number, top: (x: number) => number, step = 2.5) {
  // a unit past each end, so neighbouring copies overlap and never show a seam
  p.moveTo(-1, bottom);
  p.lineTo(-1, top(-1));
  for (let x = 0; x <= period; x += step) p.lineTo(x, top(x));
  p.lineTo(period + 1, top(period + 1));
  p.lineTo(period + 1, bottom);
  p.closePath();
}

/** Mtatsminda and the hills round the city, the TV tower on the highest point */
function mountains(): Layer {
  const P = 1000;
  const fill = new Path2D();
  const top = (x: number) => 51 + 5.5 * Math.sin((TAU * 2 * x) / P + 0.3) + 2.6 * Math.sin((TAU * 5 * x) / P + 1.1) + 0.9 * Math.sin((TAU * 13 * x) / P + 2.3) - bump(x, P * 0.62, 11, 70);
  ridge(fill, P, 100, top);
  // the tower: two legs leaning in, braced, a platform, a mast
  const lines = new Path2D();
  const tx = P * 0.62;
  const ty = top(tx) + 1;
  const H = 24;
  const half = (h: number) => 4.4 - (h / H) * 3.6;
  lines.moveTo(tx - half(0), ty);
  lines.lineTo(tx - half(H), ty - H);
  lines.moveTo(tx + half(0), ty);
  lines.lineTo(tx + half(H), ty - H);
  for (let h = 0; h < H - 2; h += 4) {
    lines.moveTo(tx - half(h), ty - h);
    lines.lineTo(tx + half(h + 4), ty - h - 4);
    lines.moveTo(tx + half(h), ty - h);
    lines.lineTo(tx - half(h + 4), ty - h - 4);
  }
  lines.moveTo(tx, ty - H);
  lines.lineTo(tx, ty - H - 8);
  fill.rect(tx - 2.2, ty - 17.5, 4.4, 1.2);
  fill.rect(tx - 1.4, ty - H - 0.6, 2.8, 1);
  return { period: P, parallax: 0.05, fill, lines, glows: [[tx, ty - H - 8.4, 0.9]] };
}

/** Narikala on its hill, Mother of Georgia on the ridge, Sameba across the valley, the cable car */
function hills(): Layer {
  const P = 820;
  const fill = new Path2D();
  const lines = new Path2D();
  const lights = new Path2D();
  const nk = P * 0.22;
  const sb = P * 0.72;
  const top = (x: number) => 66 + 4 * Math.sin((TAU * 3 * x) / P + 0.4) + 1.6 * Math.sin((TAU * 7 * x) / P + 1.7) - bump(x, nk, 13, 60) - bump(x, sb, 10, 55);
  ridge(fill, P, 100, top);

  // Narikala: a crenellated wall stepping along the slope, three towers, the little church inside
  const w0 = P * 0.15;
  const w1 = P * 0.3;
  fill.moveTo(w0, top(w0) + 2);
  for (let x = w0; x < w1; x += 1.6) {
    const t = top(x) - 4.4;
    fill.lineTo(x, t);
    fill.lineTo(x + 0.9, t);
    fill.lineTo(x + 0.9, t + 1.1);
    fill.lineTo(x + 1.6, t + 1.1);
  }
  fill.lineTo(w1, top(w1) + 2);
  fill.closePath();
  for (const [x, w, h] of [
    [P * 0.163, 3.6, 9],
    [P * 0.205, 4.4, 12],
    [P * 0.275, 3.2, 7.5],
  ]) {
    const b = top(x) + 1;
    fill.rect(x - w / 2, b - h, w, h);
    for (let m = -w / 2; m < w / 2 - 0.4; m += 1.3) fill.rect(x + m, b - h - 1, 0.8, 1.1);
  }
  const ch = P * 0.238;
  const chb = top(ch);
  fill.rect(ch - 2.2, chb - 3.2, 4.4, 3.4);
  fill.rect(ch - 0.8, chb - 5, 1.6, 1.9);
  fill.moveTo(ch - 1, chb - 5);
  fill.lineTo(ch, chb - 7.4);
  fill.lineTo(ch + 1, chb - 5);
  fill.closePath();

  // Mother of Georgia: a bowl of wine in one hand for friends, a sword in the other for enemies
  const mx = P * 0.335;
  const mb = top(mx) + 0.5;
  fill.rect(mx - 0.9, mb - 2, 1.8, 2.2);
  fill.moveTo(mx - 1.1, mb - 2);
  fill.lineTo(mx - 0.45, mb - 8.4);
  fill.lineTo(mx + 0.45, mb - 8.4);
  fill.lineTo(mx + 1.1, mb - 2);
  fill.closePath();
  fill.moveTo(mx + 0.55, mb - 9);
  fill.arc(mx, mb - 9, 0.55, 0, TAU);
  fill.rect(mx - 2.6, mb - 7.8, 2.2, 0.4);
  fill.moveTo(mx - 3.3, mb - 8.2);
  fill.lineTo(mx - 2.1, mb - 8.2);
  fill.lineTo(mx - 2.4, mb - 7.6);
  fill.lineTo(mx - 3, mb - 7.6);
  fill.closePath();
  fill.moveTo(mx + 0.3, mb - 7.7);
  fill.lineTo(mx + 3.4, mb - 5.6);
  fill.lineTo(mx + 3.25, mb - 5.35);
  fill.lineTo(mx + 0.3, mb - 7.3);
  fill.closePath();

  // Sameba: a platform, two tiers with little cone domes, the drum, the dome in the last light, a cross
  const sbb = top(sb) + 1;
  fill.rect(sb - 11, sbb - 2, 22, 2.4);
  fill.rect(sb - 7.5, sbb - 8, 15, 6.2);
  fill.rect(sb - 5, sbb - 12.4, 10, 4.6);
  for (const dx of [-6.2, 6.2]) {
    fill.rect(sb + dx - 0.9, sbb - 10.6, 1.8, 2.8);
    fill.moveTo(sb + dx - 1.05, sbb - 10.6);
    fill.lineTo(sb + dx, sbb - 12.6);
    fill.lineTo(sb + dx + 1.05, sbb - 10.6);
    fill.closePath();
  }
  fill.rect(sb - 2.3, sbb - 17.6, 4.6, 5.4);
  fill.rect(sb - 0.18, sbb - 23.6, 0.36, 3.6);
  fill.rect(sb - 1, sbb - 22.6, 2, 0.34);
  lights.moveTo(sb - 2.5, sbb - 17.5);
  lights.ellipse(sb, sbb - 17.5, 2.5, 2.9, 0, Math.PI, 0);
  lights.closePath();

  // a scatter of houses on the lower slopes
  const r = rng(31);
  for (let i = 0; i < 26; i++) {
    const x = r() * P;
    if (Math.abs(x - sb) < 14 || (x > w0 - 4 && x < w1 + 4)) continue;
    const w = 2.5 + r() * 3.5;
    const h = 2 + r() * 3.5;
    const b = Math.max(top(x), top(x + w)) + 2.5 + r() * 4;
    fill.rect(x, b - h, w, h + 6);
    if (r() < 0.45) lights.rect(x + w * 0.3, b - h + 0.8, 0.7, 0.9);
  }

  // the cable car's rope, from the river up to the fortress
  lines.moveTo(P * 0.06, 84);
  lines.lineTo(P * 0.19, top(P * 0.19) - 7);
  return { period: P, parallax: 0.14, fill, lines, lights };
}
/** where a gondola hangs on the cable car's rope, t from the bottom (0) to the top (1) */
export function gondolaAt(t: number): [number, number] {
  const P = 820;
  const x1 = P * 0.19;
  const top = 66 + 4 * Math.sin((TAU * 3 * x1) / P + 0.4) + 1.6 * Math.sin((TAU * 7 * x1) / P + 1.7) - bump(x1, P * 0.22, 13, 60) - bump(x1, P * 0.72, 10, 55) - 7;
  return [P * 0.06 + (x1 - P * 0.06) * t, 84 + (top - 84) * t];
}

/** the old town: houses with carved balconies and lit windows, a church with a cone, cypresses, planes */
function town(): Layer {
  const r = rng(11);
  const base = 92;
  type House = { x: number; w: number; h: number; roof: number; balcony: boolean; church: boolean };
  type Tree = { x: number; h: number; kind: "cypress" | "plane" };
  const plan: (House | Tree)[] = [];
  let x = 0;
  while (x < 680) {
    const roll = r();
    if (roll < 0.1) {
      plan.push({ x: x + 2, h: 18 + r() * 9, kind: "cypress" });
      x += 5;
      continue;
    }
    if (roll < 0.17) {
      plan.push({ x: x + 6, h: 13 + r() * 6, kind: "plane" });
      x += 12;
      continue;
    }
    const church = roll > 0.95;
    const w = church ? 15 : 12 + r() * 13;
    plan.push({ x, w, h: church ? 15 : 14 + r() * 12, roof: r(), balcony: !church && r() < 0.7, church });
    x += w + r() * 1.5;
  }
  const P = Math.ceil(x);
  const fill = new Path2D();
  const lights = new Path2D();
  for (const it of plan) {
    if ("kind" in it) {
      if (it.kind === "cypress") {
        fill.moveTo(it.x + 1.7, base - it.h / 2);
        fill.ellipse(it.x, base - it.h / 2, 1.7, it.h / 2, 0, 0, TAU);
      } else {
        fill.rect(it.x - 0.5, base - it.h * 0.55, 1, it.h * 0.55);
        for (const [dx, dy, rr] of [
          [0, 0.72, 4.6],
          [-3.4, 0.6, 3.4],
          [3.6, 0.62, 3.6],
          [-1.2, 0.9, 3.2],
        ]) {
          fill.moveTo(it.x + dx + rr, base - it.h * dy);
          fill.arc(it.x + dx, base - it.h * dy, rr, 0, TAU);
        }
      }
      continue;
    }
    const t = base - it.h;
    fill.rect(it.x, t, it.w, it.h);
    if (it.church) {
      // a Georgian church: a long body, a drum, and the cone on top
      const cx = it.x + it.w / 2;
      fill.rect(cx - 2, t - 5.5, 4, 5.6);
      fill.moveTo(cx - 2.3, t - 5.5);
      fill.lineTo(cx, t - 10);
      fill.lineTo(cx + 2.3, t - 5.5);
      fill.closePath();
      fill.moveTo(it.x - 0.6, t + 0.2);
      fill.lineTo(it.x + it.w / 2, t - 2.6);
      fill.lineTo(it.x + it.w + 0.6, t + 0.2);
      fill.closePath();
      lights.rect(cx - 0.35, t + 3, 0.7, 2.2);
      continue;
    }
    // the roof: a low pitch in tin, or flat behind a parapet
    if (it.roof < 0.6) {
      fill.moveTo(it.x - 0.7, t + 0.2);
      fill.lineTo(it.x + 1.6, t - 2.4 - it.roof * 2);
      fill.lineTo(it.x + it.w - 1.6, t - 2.4 - it.roof * 2);
      fill.lineTo(it.x + it.w + 0.7, t + 0.2);
      fill.closePath();
    } else {
      fill.rect(it.x - 0.3, t - 0.9, it.w + 0.6, 1);
      if (it.roof > 0.85) fill.rect(it.x + it.w * 0.7, t - 3.4, 1.1, 2.6);
    }
    // windows, a few lit
    const rows = Math.max(1, Math.floor((it.h - 9) / 5));
    for (let row = 0; row < rows; row++) {
      for (let c = it.x + 2; c < it.x + it.w - 2.2; c += 3.4) {
        if (r() < 0.38) lights.rect(c, t + 2.4 + row * 5, 1.4, 2.4);
      }
    }
    // the carved balcony along the first floor: a deck, a rail, posts, the roof over it
    if (it.balcony) {
      const by = t + 2 + rows * 5;
      fill.rect(it.x - 1.6, by + 3.6, it.w + 3.2, 0.7);
      fill.rect(it.x - 1.6, by, it.w + 3.2, 0.5);
      fill.rect(it.x - 1.6, by + 1.7, it.w + 3.2, 0.35);
      for (let p = it.x - 1.6; p <= it.x + it.w + 1.6; p += 1.2) fill.rect(p, by, 0.28, 4.3);
    }
  }
  return { period: P, parallax: 0.3, fill, lights };
}

/** the near side of the street: lamps, plane trees, a railing, an old Lada parked under a tree */
function street(): Layer {
  const P = 520;
  const fill = new Path2D();
  const lights = new Path2D();
  const glows: [number, number, number][] = [];
  // the railing along the river side
  fill.rect(-0.5, 77.4, P + 1, 0.55);
  fill.rect(-0.5, 80.2, P + 1, 0.35);
  for (let x = 0.6; x < P; x += 2.2) fill.rect(x, 77.4, 0.3, 6.8);
  for (const lx of [40, 205, 380]) {
    // a lamp post, its lantern lit
    fill.rect(lx - 0.45, 58, 0.9, 26);
    fill.rect(lx - 1.1, 82.4, 2.2, 1.8);
    fill.moveTo(lx - 1.8, 54.6);
    fill.lineTo(lx + 1.8, 54.6);
    fill.lineTo(lx + 1.1, 53.2);
    fill.lineTo(lx - 1.1, 53.2);
    fill.closePath();
    fill.rect(lx - 1.4, 58, 2.8, 0.6);
    lights.rect(lx - 1.15, 54.7, 2.3, 3.3);
    glows.push([lx, 56.3, 9]);
  }
  const tr = rng(17);
  for (const [tx, s] of [
    [120, 0.85],
    [300, 1],
    [455, 0.78],
  ]) {
    // a plane tree: a slim trunk that forks, a loose crown of small rounds
    const crown = 84 - 30 * s;
    fill.moveTo(tx - 0.7 * s, 84);
    fill.lineTo(tx - 0.4 * s, crown + 7 * s);
    fill.lineTo(tx - 3 * s, crown + 1 * s);
    fill.lineTo(tx - 2.5 * s, crown + 0.6 * s);
    fill.lineTo(tx, crown + 5 * s);
    fill.lineTo(tx + 2.6 * s, crown + 0.4 * s);
    fill.lineTo(tx + 3.1 * s, crown + 0.9 * s);
    fill.lineTo(tx + 0.4 * s, crown + 7 * s);
    fill.lineTo(tx + 0.7 * s, 84);
    fill.closePath();
    for (let i = 0; i < 22; i++) {
      const a = tr() * TAU;
      const d = Math.sqrt(tr());
      const rr = (1.3 + tr() * 2.1) * s;
      const cx = tx + Math.cos(a) * d * 9.5 * s;
      const cy = crown - 2 * s + Math.sin(a) * d * 5.2 * s;
      fill.moveTo(cx + rr, cy);
      fill.arc(cx, cy, rr, 0, TAU);
    }
  }
  // an old Lada, boxy, parked under the second tree
  const cx = 286;
  fill.moveTo(cx, 82.6);
  fill.lineTo(cx, 79.6);
  fill.lineTo(cx + 3.4, 79);
  fill.lineTo(cx + 5.4, 76.4);
  fill.lineTo(cx + 12.2, 76.4);
  fill.lineTo(cx + 14.4, 79);
  fill.lineTo(cx + 17.6, 79.4);
  fill.lineTo(cx + 17.6, 82.6);
  fill.closePath();
  for (const wx of [cx + 3.6, cx + 14]) {
    fill.moveTo(wx + 1.5, 82.8);
    fill.arc(wx, 82.8, 1.5, 0, TAU);
  }
  return { period: P, parallax: 0.6, fill, lights, glows };
}

/** the pavement: stones in courses, the kerb catching the light */
function pavement(): Layer {
  const P = 120;
  const fill = new Path2D();
  fill.rect(-0.5, GROUND, P + 1, VIEW_H - GROUND + 2);
  const lines = new Path2D();
  const r = rng(5);
  for (let row = 0; row < 4; row++) {
    const y = GROUND + 3.2 + row * 3.6;
    lines.moveTo(0, y);
    lines.lineTo(P, y);
    let x = row % 2 ? 2.6 : 0;
    while (x < P - 2) {
      lines.moveTo(x, y);
      lines.lineTo(x, y + 3.6);
      x += 4 + r() * 3.4;
    }
  }
  return { period: P, parallax: 1, fill, lines };
}

export function buildCity() {
  return { mountains: mountains(), hills: hills(), town: town(), street: street(), pavement: pavement() };
}
export type City = ReturnType<typeof buildCity>;

/** a layer, repeated across the view at its own speed */
export function drawLayer(ctx: CanvasRenderingContext2D, k: number, layer: Layer, cam: number, lift: number, viewW: number, paint: (copy: number) => void) {
  const o = cam * layer.parallax;
  let x = -(((o % layer.period) + layer.period) % layer.period);
  while (x < viewW) {
    ctx.setTransform(k, 0, 0, k, x * k, lift * layer.parallax * k);
    paint(x);
    x += layer.period;
  }
  ctx.setTransform(k, 0, 0, k, 0, 0);
}
