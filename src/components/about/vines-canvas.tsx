"use client";

import { useEffect, useRef, type ComponentProps, type RefObject } from "react";
import { gsap } from "@/lib/gsap";
import { createVines } from "./vines-gl";

/** Shared, mutable state the scroll timeline tweens and the canvas reads every frame. */
export type VinesFx = {
  /** where the frame is on its way through the screen: -1 entering below, 1 leaving at the top */
  drift: number;
  /** extra scale, eased down to 1 as the frame arrives */
  zoom: number;
};

/** the photograph, its depth map, and the object-position of the crop (the two of them in the middle) */
export const VINES = {
  src: "/about/vines.webp",
  depth: "/about/vines-depth.png",
  position: [0.5, 0.45] as const,
};

type Props = Omit<ComponentProps<"canvas">, "ref"> & {
  fx: RefObject<VinesFx>;
  /** the rendered <img>, used as the texture */
  source: RefObject<HTMLImageElement | null>;
  onStatus?: (status: "on" | "off") => void;
};

export function VinesCanvas({ fx, source, onStatus, ...props }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);
  const statusRef = useRef(onStatus);
  useEffect(() => {
    statusRef.current = onStatus;
  });

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const stage = createVines(canvas, VINES.position);
    if (!stage) {
      statusRef.current?.("off");
      return;
    }

    let visible = false;
    let lost = false;
    let quality = 1;
    let slow = 0;
    let shown = false;

    const size = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2) * quality;
      return { width: Math.max(1, Math.round(canvas.clientWidth * dpr)), height: Math.max(1, Math.round(canvas.clientHeight * dpr)) };
    };
    const draw = (time: number) => {
      if (lost || !stage.ready()) return;
      stage.draw({ ...size(), drift: fx.current.drift, zoom: fx.current.zoom, time, sway: reduce ? 0 : 1 });
      if (!shown) {
        shown = true;
        statusRef.current?.("on");
      }
    };

    // the breeze keeps the leaves alive while the section is on screen; off screen nothing draws
    const tick = (time: number, deltaMs: number) => {
      if (!visible) return;
      // a GPU that can't keep up draws at a lower resolution rather than stutter the scroll
      if (deltaMs > 24 && quality > 0.6) {
        if (++slow > 45) {
          quality *= 0.85;
          slow = 0;
        }
      } else slow = Math.max(0, slow - 1);
      draw(time);
    };

    // photo: the decoded <img> (whatever srcset size the browser picked); depth: fetched once, exact
    const img = source.current;
    const loadPhoto = () => {
      if (lost || !img?.naturalWidth) return;
      stage.setPhoto(img, img.naturalWidth, img.naturalHeight);
      draw(gsap.ticker.time);
    };
    const depth = new Image();
    depth.decoding = "async";
    depth.onload = () => {
      if (lost) return;
      stage.setDepth(depth);
      draw(gsap.ticker.time);
    };
    depth.onerror = () => statusRef.current?.("off");
    depth.src = VINES.depth;

    img?.addEventListener("load", loadPhoto);
    if (img?.complete && img.naturalWidth) loadPhoto();

    const io = new IntersectionObserver(
      (entries) => {
        visible = entries[entries.length - 1].isIntersecting;
        if (visible) draw(reduce ? 0 : gsap.ticker.time);
      },
      { rootMargin: "20% 0px" },
    );
    io.observe(canvas);

    const onLost = (e: Event) => {
      e.preventDefault();
      lost = true;
      statusRef.current?.("off");
    };
    canvas.addEventListener("webglcontextlost", onLost);
    // reduced motion: one still frame, redrawn only when the size changes
    const ro = new ResizeObserver(() => draw(0));
    if (reduce) ro.observe(canvas);
    else gsap.ticker.add(tick);

    return () => {
      gsap.ticker.remove(tick);
      ro.disconnect();
      io.disconnect();
      img?.removeEventListener("load", loadPhoto);
      depth.onload = null;
      canvas.removeEventListener("webglcontextlost", onLost);
      stage.dispose();
    };
  }, [fx, source]);

  return <canvas ref={ref} aria-hidden {...props} />;
}
