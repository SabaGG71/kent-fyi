/**
 * Who and what is on the street in Supra Run, drawn as silhouettes in the proof's ink, in world units.
 *
 * Kent is a figure at real proportions with his own head: the profile and hair cut from his portrait,
 * on a body that runs with a proper stride (thigh, knee, shin, shoe; shoulder, elbow, hand), and he wears
 * the red striped shirt from the same photo, the one thing on the street that isn't ink. The stray dogs
 * of Tbilisi (yellow tag in the ear: vaccinated), open manholes, laundry across the pavement, wine, the
 * letters, and the supra at the end of the street.
 */

import { GROUND, css, type Palette, type Rgb } from "./world";

type Ctx = CanvasRenderingContext2D;
const TAU = Math.PI * 2;
const LILAC = "#b7a6e6";
export const LINK = "#2233ff";

/** a limb: round at both ends, from radius r1 at (x1, y1) to r2 at (x2, y2) */
function capsule(p: Path2D, x1: number, y1: number, r1: number, x2: number, y2: number, r2: number) {
  const a = Math.atan2(y2 - y1, x2 - x1);
  p.moveTo(x1 + r1 * Math.cos(a + Math.PI / 2), y1 + r1 * Math.sin(a + Math.PI / 2));
  p.arc(x1, y1, r1, a + Math.PI / 2, a + (3 * Math.PI) / 2);
  p.lineTo(x2 + r2 * Math.cos(a - Math.PI / 2), y2 + r2 * Math.sin(a - Math.PI / 2));
  p.arc(x2, y2, r2, a - Math.PI / 2, a + Math.PI / 2);
  p.closePath();
}
const along = (x: number, y: number, len: number, a: number): [number, number] => [x + len * Math.sin(a), y + len * Math.cos(a)];

// ---- Kent ----------------------------------------------------------------------------------------------------

const THIGH = 7;
const SHIN = 6.6;
const TORSO = 9;
const UPPER = 5;
const FORE = 4.5;
/** the head cut-out, top of the hair to the foot of the neck, and where the neck sits on the collar */
const HEAD_H = 5.66;
const NECK: readonly [number, number] = [0.447, 0.95];
const SHIRT = "#b5404f";
const SHIRT_FAR = "#8a2f3c";
const STRIPE = "rgba(246,239,233,0.92)";

export type Pose = "run" | "jump" | "fall" | "duck" | "cheer" | "sad" | "stand";
/** angles are radians from hanging straight down, positive forward; [near, far] */
type Stance = { hip: number; lean: number; head: number; thigh: number[]; knee: number[]; foot: number[]; upper: number[]; elbow: number[] };

/** where every joint is for a pose; `phase` runs the stride, a full turn per two steps */
function stance(pose: Pose, phase: number): Stance {
  switch (pose) {
    case "run": {
      const legs = [phase, phase + Math.PI];
      return {
        hip: 14 + 0.55 * (Math.abs(Math.sin(phase)) - 0.4),
        lean: 0.15,
        head: -0.1,
        thigh: legs.map((p) => 0.6 * Math.sin(p) + 0.1),
        // the knee folds as the leg swings through, then straightens to land
        knee: legs.map((p) => 0.28 + 1.45 * Math.max(0, Math.cos(p + 0.5)) ** 1.3),
        foot: legs.map((p) => 0.3 * Math.max(0, Math.cos(p + 0.5))),
        upper: legs.map((p) => -0.55 * Math.sin(p) + 0.05),
        elbow: legs.map((p) => 1.3 + 0.35 * Math.max(0, -Math.sin(p))),
      };
    }
    case "jump":
      return { hip: 12.6, lean: 0.1, head: -0.12, thigh: [1.05, -0.4], knee: [1.6, 0.85], foot: [0.25, 0.5], upper: [2.15, -0.85], elbow: [0.45, 0.75] };
    case "fall":
      return { hip: 13.6, lean: 0.08, head: -0.04, thigh: [0.55, -0.15], knee: [0.65, 0.55], foot: [0.1, 0.3], upper: [1.35, -0.55], elbow: [0.55, 0.6] };
    case "duck":
      return { hip: 8.2, lean: 0.86, head: -0.45, thigh: [1.2, 0.95], knee: [2.05, 1.85], foot: [0, 0.2], upper: [0.75, 0.3], elbow: [1.1, 1.2] };
    case "cheer":
      return { hip: 14.5, lean: -0.04, head: -0.14, thigh: [0.06, -0.06], knee: [0.06, 0.08], foot: [0, 0], upper: [2.85, 2.6], elbow: [0.25, 0.35] };
    case "sad":
      return { hip: 14.3, lean: 0.1, head: 0.32, thigh: [0.04, -0.04], knee: [0.08, 0.08], foot: [0, 0], upper: [0.08, -0.05], elbow: [0.18, 0.12] };
    default:
      return { hip: 14.5, lean: 0.02, head: 0, thigh: [0.04, -0.04], knee: [0.06, 0.06], foot: [0, 0], upper: [0.1, -0.08], elbow: [0.3, 0.25] };
  }
}

const lerpStance = (a: Stance, b: Stance, t: number): Stance => {
  const n = (x: number, y: number) => x + (y - x) * t;
  const v = (x: number[], y: number[]) => x.map((xi, i) => n(xi, y[i]));
  return { hip: n(a.hip, b.hip), lean: n(a.lean, b.lean), head: n(a.head, b.head), thigh: v(a.thigh, b.thigh), knee: v(a.knee, b.knee), foot: v(a.foot, b.foot), upper: v(a.upper, b.upper), elbow: v(a.elbow, b.elbow) };
};

/** Kent's head as a silhouette in the ink, cut at the size it's drawn */
export function inkHead(img: HTMLImageElement, k: number, color: string) {
  const h = HEAD_H;
  const w = (h * img.naturalWidth) / img.naturalHeight;
  const c = document.createElement("canvas");
  c.width = Math.max(1, Math.round(w * k * 1.5));
  c.height = Math.max(1, Math.round(h * k * 1.5));
  const x = c.getContext("2d")!;
  x.imageSmoothingQuality = "high";
  x.drawImage(img, 0, 0, c.width, c.height);
  x.globalCompositeOperation = "source-in";
  x.fillStyle = color;
  x.fillRect(0, 0, c.width, c.height);
  return { c, w, h };
}

/** Kent, moving from pose to pose without snapping */
export class Kent {
  private from: Stance = stance("stand", 0);
  private pose: Pose = "stand";
  private since = 1;
  current: Stance = stance("stand", 0);

  update(dt: number, pose: Pose, phase: number) {
    if (pose !== this.pose) {
      this.from = this.current;
      this.pose = pose;
      this.since = 0;
    }
    this.since += dt;
    const t = Math.min(1, this.since / (pose === "run" ? 0.16 : 0.12));
    const e = t * t * (3 - 2 * t);
    this.current = lerpStance(this.from, stance(pose, phase), e);
  }

  draw(ctx: Ctx, cx: number, feet: number, pal: Palette, head: ReturnType<typeof inkHead> | null, alpha: number) {
    const s = this.current;
    const hx = cx;
    const hy = feet - s.hip;
    const legs = [0, 1].map((i) => {
      const x0 = hx + (i ? -0.5 : 0.5);
      const knee = along(x0, hy, THIGH, s.thigh[i]);
      const ankle = along(knee[0], knee[1], SHIN, s.thigh[i] - s.knee[i]);
      return { x0, knee, ankle, foot: s.foot[i] };
    });
    const up: [number, number] = [Math.sin(s.lean), -Math.cos(s.lean)];
    const at = (d: number, side = 0): [number, number] => [hx + up[0] * d - up[1] * side, hy + up[1] * d + up[0] * side];
    const shoulder = at(TORSO - 1.5, -0.2);
    const arms = [0, 1].map((i) => {
      const s0: [number, number] = [shoulder[0] + (i ? -0.35 : 0.35), shoulder[1]];
      const elbow = along(s0[0], s0[1], UPPER, s.upper[i]);
      const hand = along(elbow[0], elbow[1], FORE, s.upper[i] + s.elbow[i]);
      return { s0, elbow, hand };
    });

    ctx.save();
    ctx.globalAlpha = alpha;
    // his shadow on the pavement, smaller the higher he goes
    const lift = Math.max(0, GROUND - feet);
    const sh = Math.max(0.3, 1 - lift / 45);
    ctx.fillStyle = css(pal.ink, 0.28 * sh);
    ctx.beginPath();
    ctx.ellipse(cx + 0.6, GROUND + 0.5, 5.5 * sh, 0.8 * sh, 0, 0, TAU);
    ctx.fill();

    const leg = (i: number) => {
      const l = legs[i];
      const p = new Path2D();
      capsule(p, l.x0, hy, 1.55, l.knee[0], l.knee[1], 1.05);
      capsule(p, l.knee[0], l.knee[1], 1.05, l.ankle[0], l.ankle[1], 0.62);
      // the shoe, toe forward, tipped down as the heel lifts
      const a = l.foot;
      const ax = l.ankle[0];
      const ay = l.ankle[1];
      const pt = (fx: number, fy: number): [number, number] => [ax + fx * Math.cos(a) - fy * Math.sin(a), ay + fx * Math.sin(a) + fy * Math.cos(a)];
      const shoe = [pt(-0.75, -0.5), pt(0.9, -0.55), pt(2.55, 0.25), pt(2.6, 0.95), pt(-0.85, 0.95)];
      p.moveTo(shoe[0][0], shoe[0][1]);
      for (const q of shoe.slice(1)) p.lineTo(q[0], q[1]);
      p.closePath();
      return p;
    };
    const sleeve = (i: number) => {
      const a = arms[i];
      const p = new Path2D();
      capsule(p, a.s0[0], a.s0[1], 1.05, a.elbow[0], a.elbow[1], 0.78);
      capsule(p, a.elbow[0], a.elbow[1], 0.78, a.hand[0], a.hand[1], 0.6);
      return p;
    };
    const hand = (i: number) => {
      const p = new Path2D();
      const a = arms[i];
      const d = along(a.hand[0], a.hand[1], 0.55, s.upper[i] + s.elbow[i]);
      p.arc(d[0], d[1], 0.62, 0, TAU);
      return p;
    };
    const stripes = (clip: Path2D, angle: number, ox: number, oy: number, color: string) => {
      ctx.save();
      ctx.clip(clip);
      ctx.translate(ox, oy);
      ctx.rotate(angle);
      ctx.fillStyle = color;
      for (let x = -12; x < 12; x += 0.78) ctx.fillRect(x, -16, 0.26, 32);
      ctx.restore();
    };

    // the far arm and leg, a shade back
    const farArm = sleeve(1);
    ctx.fillStyle = SHIRT_FAR;
    ctx.fill(farArm);
    stripes(farArm, s.lean, hx, hy, "rgba(246,239,233,0.5)");
    ctx.fillStyle = pal.farBody;
    ctx.fill(hand(1));
    ctx.fill(leg(1));
    ctx.fillStyle = pal.body;
    ctx.fill(leg(0));

    // the head, then the shirt over the foot of the neck
    if (head) {
      const neck = at(TORSO - 0.1, 0.15);
      ctx.save();
      ctx.translate(neck[0], neck[1]);
      ctx.rotate(s.lean + s.head);
      ctx.drawImage(head.c, -NECK[0] * head.w, -NECK[1] * head.h, head.w, head.h);
      ctx.restore();
    }
    const torso = new Path2D();
    const P = (d: number, side: number) => at(d, side);
    const pts = [P(-0.6, -2.05), P(3.5, -2.3), P(TORSO - 1.2, -2.25), P(TORSO - 0.1, -1.1), P(TORSO, 0.6), P(TORSO - 1.6, 2.3), P(4.4, 2.35), P(0.6, 2.1), P(-0.7, 2.15)];
    torso.moveTo(pts[0][0], pts[0][1]);
    for (const q of pts.slice(1)) torso.lineTo(q[0], q[1]);
    torso.closePath();
    ctx.fillStyle = SHIRT;
    ctx.fill(torso);
    stripes(torso, s.lean, hx, hy, STRIPE);

    // the near arm swings over the shirt, edged so it reads against it
    const nearArm = sleeve(0);
    ctx.strokeStyle = SHIRT_FAR;
    ctx.lineWidth = 0.32;
    ctx.stroke(nearArm);
    ctx.fillStyle = SHIRT;
    ctx.fill(nearArm);
    stripes(nearArm, s.upper[0] * 0.6, arms[0].s0[0], arms[0].s0[1], STRIPE);
    ctx.fillStyle = pal.body;
    ctx.fill(hand(0));
    ctx.restore();
  }
}

// ---- the street ---------------------------------------------------------------------------------------------

/** a street dog lying on the pavement, facing the way Kent comes; it lifts its head as he gets close */
export function dog(ctx: Ctx, x: number, y: number, alert: number, t: number, pal: Palette) {
  const p = new Path2D();
  p.ellipse(x + 10, y + 6.3, 6.4, 2.6, 0, 0, TAU);
  p.moveTo(x + 17.2, y + 6.2);
  p.ellipse(x + 14.3, y + 6.1, 2.9, 2.85, 0, 0, TAU);
  capsule(p, x + 2.2, y + 8.25, 0.55, x + 8.5, y + 8.25, 0.6);
  // the head: down on the paws, or up and watching
  const hy = y + 5.9 - alert * 2.9;
  const hx = x + 3.3 + alert * 0.5;
  capsule(p, x + 6.5, y + 5.6, 1.9, hx + 0.6, hy + 0.2, 1.5);
  p.moveTo(hx + 2, hy);
  p.ellipse(hx, hy, 2.15, 1.75, 0, 0, TAU);
  p.moveTo(hx - 1.2, hy - 0.1);
  p.ellipse(hx - 2, hy + 0.55, 1.35, 0.95, 0.15, 0, TAU);
  // the ear, floppy or up
  if (alert > 0.5) {
    p.moveTo(hx + 0.3, hy - 1.2);
    p.lineTo(hx + 1.2, hy - 3.3);
    p.lineTo(hx + 1.9, hy - 1);
    p.closePath();
  } else {
    p.moveTo(hx + 1.8, hy - 0.4);
    p.ellipse(hx + 0.9, hy + 0.2, 0.9, 1.6, 0.6, 0, TAU);
  }
  ctx.fillStyle = pal.body;
  ctx.fill(p);
  // the tail
  const wag = Math.sin(t * (alert > 0.5 ? 14 : 2.2)) * (alert > 0.5 ? 0.9 : 0.3);
  ctx.strokeStyle = pal.body;
  ctx.lineWidth = 0.75;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(x + 16.8, y + 6.2);
  ctx.quadraticCurveTo(x + 19, y + 5.4, x + 19.3, y + 3.2 + wag);
  ctx.stroke();
  // the yellow tag in its ear: vaccinated, and friendly
  ctx.fillStyle = "#f2c94c";
  ctx.beginPath();
  ctx.arc(hx + (alert > 0.5 ? 1.1 : 1.3), hy + (alert > 0.5 ? -1.4 : 1.2), 0.38, 0, TAU);
  ctx.fill();
}

/** an open manhole, its lid stood up beside it */
export function hole(ctx: Ctx, x: number, pal: Palette) {
  ctx.fillStyle = pal.edge;
  ctx.beginPath();
  ctx.ellipse(x + 11, GROUND + 1.7, 9.2, 2.2, 0, 0, TAU);
  ctx.fill();
  ctx.fillStyle = css(pal.ink);
  ctx.beginPath();
  ctx.ellipse(x + 11, GROUND + 1.85, 8.2, 1.75, 0, 0, TAU);
  ctx.fill();
  ctx.fillStyle = pal.street;
  ctx.beginPath();
  ctx.ellipse(x + 22.4, GROUND - 3.6, 1.5, 5.1, 0.12, 0, TAU);
  ctx.fill();
}

/** wine for the table, the lilac capsule of wine.fyi */
export function bottle(ctx: Ctx, x: number, y: number, pal: Palette) {
  ctx.fillStyle = pal.body;
  ctx.beginPath();
  ctx.moveTo(x + 0.5, y + 12.5);
  ctx.lineTo(x + 0.5, y + 6.4);
  ctx.quadraticCurveTo(x + 0.5, y + 4.7, x + 2.05, y + 4.1);
  ctx.lineTo(x + 2.05, y + 1.2);
  ctx.lineTo(x + 3.95, y + 1.2);
  ctx.lineTo(x + 3.95, y + 4.1);
  ctx.quadraticCurveTo(x + 5.5, y + 4.7, x + 5.5, y + 6.4);
  ctx.lineTo(x + 5.5, y + 12.5);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = LILAC;
  ctx.fillRect(x + 1.85, y, 2.3, 2.6);
  ctx.fillStyle = pal.light;
  ctx.fillRect(x + 1.1, y + 7.4, 3.8, 3.2);
  ctx.fillStyle = "rgba(255,255,255,0.35)";
  ctx.fillRect(x + 1, y + 5, 0.5, 1.8);
}

/** a letter of the word being learned, in the link blue, with a little light round it */
export function letter(ctx: Ctx, x: number, y: number, glyph: string, family: string, k: number, pal: Palette) {
  ctx.save();
  ctx.font = `600 15px ${family}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.shadowColor = css(pal.halo, 0.95);
  ctx.shadowBlur = 5 * k;
  ctx.fillStyle = LINK;
  ctx.fillText(glyph, x + 8, y + 9);
  ctx.shadowBlur = 0;
  ctx.fillText(glyph, x + 8, y + 9);
  ctx.restore();
}

/** laundry on a line across the pavement, low enough that you have to duck; one shirt is Kent's */
export function laundry(ctx: Ctx, x: number, y: number, seed: number, t: number, pal: Palette) {
  ctx.fillStyle = pal.body;
  ctx.fillRect(x + 0.4, y + 7, 1.1, 48);
  ctx.fillRect(x + 44.5, y + 7, 1.1, 48);
  ctx.strokeStyle = pal.body;
  ctx.lineWidth = 0.3;
  ctx.beginPath();
  ctx.moveTo(x + 1.5, y + 8.5);
  ctx.quadraticCurveTo(x + 23, y + 16, x + 44.5, y + 8.5);
  ctx.stroke();
  let s = seed * 9301 + 49297;
  const r = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
  const tints = [pal.light, css(pal.halo), css(pal.flood), pal.light];
  let i = 4.5;
  let n = 0;
  while (i < 39) {
    const kind = Math.floor(r() * 3);
    const w = kind === 2 ? 3.6 : 5.6 + r() * 4;
    const u = (i + w / 2 - 1.5) / 43;
    const ropeY = y + 8.5 + 15 * u * (1 - u);
    const h = Math.min(kind === 2 ? 6 : 9 + r() * 8, y + 31.5 - ropeY);
    const kent = seed === 1 && n === 1;
    ctx.save();
    ctx.translate(x + i + w / 2, ropeY);
    ctx.rotate(Math.sin(t * 1.8 + i * 0.7) * 0.06);
    const p = new Path2D();
    if (kind === 0 || kent) {
      const hw = w / 2;
      p.moveTo(-hw, 0);
      p.lineTo(-1, 0);
      p.lineTo(0, 0.9);
      p.lineTo(1, 0);
      p.lineTo(hw, 0);
      p.lineTo(hw + 2, 2.8);
      p.lineTo(hw + 0.6, 3.8);
      p.lineTo(hw, 3.2);
      p.lineTo(hw, h);
      p.lineTo(-hw, h);
      p.lineTo(-hw, 3.2);
      p.lineTo(-hw - 0.6, 3.8);
      p.lineTo(-hw - 2, 2.8);
      p.closePath();
    } else if (kind === 2) {
      p.moveTo(-1.8, 0);
      p.lineTo(-0.4, 0);
      p.lineTo(-0.4, h - 1.6);
      p.lineTo(1.2, h - 1.6);
      p.lineTo(1.2, h);
      p.lineTo(-1.8, h);
      p.closePath();
    } else {
      p.rect(-w / 2, 0, w, h);
    }
    ctx.fillStyle = kent ? SHIRT : tints[n % tints.length];
    ctx.fill(p);
    if (kent) {
      ctx.save();
      ctx.clip(p);
      ctx.fillStyle = STRIPE;
      for (let sx = -w; sx < w; sx += 0.78) ctx.fillRect(sx, 0, 0.26, h);
      ctx.restore();
    }
    ctx.fillStyle = pal.body;
    ctx.fillRect(-w / 2 + 0.5, -0.9, 0.5, 1.8);
    ctx.fillRect(w / 2 - 1, -0.9, 0.5, 1.8);
    ctx.restore();
    i += w + 1.4 + r() * 2;
    n++;
  }
}

/** the supra at the end of the street: a long table, the guests, the tamada with his horn up, the lights */
export function supra(ctx: Ctx, x: number, y: number, t: number, k: number, pal: Palette) {
  const lightRgb: Rgb = pal.lightRgb;
  // the string of lights between two poles
  ctx.fillStyle = pal.body;
  ctx.fillRect(x - 2, y + 2, 0.8, 41);
  ctx.fillRect(x + 81, y + 2, 0.8, 41);
  ctx.strokeStyle = pal.body;
  ctx.lineWidth = 0.25;
  ctx.beginPath();
  ctx.moveTo(x - 1.6, y + 2.5);
  ctx.quadraticCurveTo(x + 40, y + 12, x + 81.4, y + 2.5);
  ctx.stroke();
  ctx.save();
  ctx.shadowColor = css(lightRgb, 0.9);
  ctx.shadowBlur = 4 * k;
  for (let i = 2; i < 80; i += 5.5) {
    const u = (i + 1.6) / 83;
    ctx.fillStyle = css(lightRgb, 0.75 + 0.25 * Math.sin(t * 2.4 + i));
    ctx.beginPath();
    ctx.arc(x + i, y + 2.5 + 19 * u * (1 - u) + 0.9, 0.55, 0, TAU);
    ctx.fill();
  }
  ctx.restore();
  // the guests behind the table, and the tamada standing with his horn raised for a toast
  const p = new Path2D();
  for (let g = 0; g < 7; g++) {
    const gx = x + 7 + g * 11;
    const stand = g === 3;
    const top = y + (stand ? 15 : 21);
    p.moveTo(gx + 1.5, top);
    p.arc(gx, top, 1.5, 0, TAU);
    p.moveTo(gx - 2.6, y + 31);
    p.lineTo(gx - 2.2, top + 3);
    p.quadraticCurveTo(gx, top + 1.6, gx + 2.2, top + 3);
    p.lineTo(gx + 2.6, y + 31);
    p.closePath();
    if (stand) {
      capsule(p, gx + 1.8, top + 3.2, 0.55, gx + 4.2, top - 2.4, 0.45);
      p.moveTo(gx + 3.6, top - 2.2);
      p.quadraticCurveTo(gx + 5.6, top - 4.6, gx + 4.4, top - 7.4);
      p.lineTo(gx + 5.4, top - 7);
      p.quadraticCurveTo(gx + 6.2, top - 4, gx + 4.8, top - 1.9);
      p.closePath();
    }
  }
  ctx.fillStyle = pal.body;
  ctx.fill(p);
  // the table: a white cloth, wine and glasses on it
  ctx.fillStyle = pal.light;
  ctx.fillRect(x, y + 30.6, 80, 4.6);
  ctx.fillStyle = pal.body;
  ctx.fillRect(x + 3, y + 35.2, 1.4, 7.8);
  ctx.fillRect(x + 75.6, y + 35.2, 1.4, 7.8);
  for (let i = 6; i < 78; i += 12) {
    ctx.fillStyle = pal.body;
    ctx.fillRect(x + i, y + 25.4, 1.9, 5.2);
    ctx.fillRect(x + i + 0.55, y + 23.6, 0.8, 2);
    ctx.fillStyle = LILAC;
    ctx.fillRect(x + i + 0.45, y + 23, 1, 0.9);
  }
}

/** sparks: the letters burst into the link blue and white, the wine into lilac */
export type Spark = { x: number; y: number; vx: number; vy: number; life: number; color: string; size: number };
export function sparks(ctx: Ctx, list: Spark[]) {
  for (const s of list) {
    ctx.globalAlpha = Math.max(0, Math.min(1, s.life * 2.2));
    ctx.fillStyle = s.color;
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.size, 0, TAU);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}
