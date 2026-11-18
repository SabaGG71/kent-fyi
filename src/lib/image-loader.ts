/**
 * Where next/image gets a photograph at a given width: one of the copies scripts/photo-sizes.mjs made ahead of
 * time, or the original for the largest. Nothing is resized on request, so nothing runs into Vercel's paid
 * image optimization. Anything else (a remote image, another format) is served as it is.
 */
const SIZES = [384, 640, 1080, 1600]; // keep in step with scripts/photo-sizes.mjs and next.config.ts

export default function imageLoader({ src, width }: { src: string; width: number; quality?: number }) {
  const m = src.match(/^\/kent\/(?:photos\/)?([^/]+)\.webp$/);
  if (!m) return src;
  const w = SIZES.find((s) => s >= width);
  return w ? `/kent/sized/${m[1]}-${w}.webp` : src;
}
