/**
 * The stir: a small grid of offsets over the picture, kept on the CPU. Dragging writes your movement into
 * it (the picture there is pushed along with you, like ink floating on water), a press drops a ring of it
 * outward, and every frame it curls a little, spreads a little and heals back toward still.
 */
export class Stir {
  w = 48;
  h = 60;
  data = new Float32Array(this.w * this.h * 2);
  private next = new Float32Array(this.w * this.h * 2);
  energy = 0;

  /** keep about 48 cells across, as many down as the frame's shape needs */
  resize(aspect: number) {
    // a frame with no size yet (hidden, or mid-layout) has no shape to follow
    if (!Number.isFinite(aspect) || aspect <= 0) return;
    const h = Math.min(240, Math.max(24, Math.round(this.w / aspect)));
    if (h === this.h) return;
    this.h = h;
    this.data = new Float32Array(this.w * h * 2);
    this.next = new Float32Array(this.w * h * 2);
    this.energy = 0;
  }

  private add(fn: (cx: number, cy: number) => [number, number] | null, x: number, y: number, radius: number) {
    const { w, h, data } = this;
    const x0 = Math.max(0, Math.floor((x - radius) * w));
    const x1 = Math.min(w - 1, Math.ceil((x + radius) * w));
    const y0 = Math.max(0, Math.floor((y - radius) * h));
    const y1 = Math.min(h - 1, Math.ceil((y + radius) * h));
    for (let j = y0; j <= y1; j++) {
      for (let i = x0; i <= x1; i++) {
        const v = fn((i + 0.5) / w, (j + 0.5) / h);
        if (!v) continue;
        const k = (j * w + i) * 2;
        data[k] = Math.max(-0.14, Math.min(0.14, data[k] + v[0]));
        data[k + 1] = Math.max(-0.14, Math.min(0.14, data[k + 1] + v[1]));
      }
    }
    this.energy = 1;
  }

  /** a drag from (x, y) by (dx, dy), all in frame uv: the picture under the cursor goes with it */
  drag(x: number, y: number, dx: number, dy: number, radius = 0.09, strength = 0.9) {
    const len = Math.hypot(dx, dy);
    if (len < 1e-5) return;
    // a fast flick is capped, so one swipe can't tear the picture apart
    const cap = Math.min(1, 0.06 / len);
    this.add(
      (cx, cy) => {
        const g = Math.exp(-((cx - x) ** 2 + (cy - y) ** 2) / (radius * radius));
        return g < 0.01 ? null : [dx * cap * strength * g, dy * cap * strength * g];
      },
      x,
      y,
      radius * 1.6,
    );
  }

  /** a press: a ring pushed out from the point, like a drop of ink landing */
  drop(x: number, y: number, radius = 0.16, strength = 0.05) {
    this.add(
      (cx, cy) => {
        const dx = cx - x;
        const dy = cy - y;
        const r = Math.hypot(dx, dy);
        if (r < 1e-4) return null;
        const g = Math.exp(-((r - radius * 0.55) ** 2) / (radius * radius * 0.18));
        return g < 0.01 ? null : [(dx / r) * strength * g, (dy / r) * strength * g];
      },
      x,
      y,
      radius * 1.4,
    );
  }

  /** one frame: curl, spread, heal. Returns whether anything is still moving */
  step(dt: number) {
    if (this.energy <= 0) return false;
    const { w, h, data, next } = this;
    const heal = Math.exp(-dt / 0.75);
    const spread = Math.min(0.25, dt * 7);
    let energy = 0;
    for (let j = 0; j < h; j++) {
      for (let i = 0; i < w; i++) {
        const k = (j * w + i) * 2;
        let x = data[k];
        let y = data[k + 1];
        // the neighbours, for a little spreading
        const l = i > 0 ? k - 2 : k;
        const r = i < w - 1 ? k + 2 : k;
        const t = j > 0 ? k - w * 2 : k;
        const b = j < h - 1 ? k + w * 2 : k;
        x += ((data[l] + data[r] + data[t] + data[b]) / 4 - x) * spread;
        y += ((data[l + 1] + data[r + 1] + data[t + 1] + data[b + 1]) / 4 - y) * spread;
        // and a curl that grows with the push, so strokes wind into marbled feathers
        const a = Math.hypot(x, y) * 14 * dt;
        const c = Math.cos(a);
        const s = Math.sin(a);
        const nx = (x * c - y * s) * heal;
        const ny = (x * s + y * c) * heal;
        next[k] = Math.abs(nx) < 1e-5 ? 0 : nx;
        next[k + 1] = Math.abs(ny) < 1e-5 ? 0 : ny;
        energy += Math.abs(next[k]) + Math.abs(next[k + 1]);
      }
    }
    this.data = next;
    this.next = data;
    this.energy = energy > 1e-3 ? energy : 0;
    if (!this.energy) this.data.fill(0);
    return true;
  }
}
