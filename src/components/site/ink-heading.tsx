"use client";

import { Fragment, useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";

/** a sentence of the heading and how bright it ends up: full cream, or a step back */
export type InkPart = { text: string; tone?: "full" | "soft" };

const DIM = "rgba(255, 243, 232, 0.12)";
const FINAL = { full: "rgba(255, 243, 232, 1)", soft: "rgba(255, 243, 232, 0.45)" };

/**
 * A big serif heading that fills in with the scroll. The words start faint and, as the heading travels up
 * the screen, light up one after another into cream, as if the line is being read aloud. Scrolling back
 * dims it again. Without JS or with reduced motion it simply reads in its final colours.
 */
export function InkHeading({ id, parts, className }: { id: string; parts: InkPart[]; className?: string }) {
  const ref = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      const heading = ref.current;
      if (!heading || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const words = gsap.utils.toArray<HTMLElement>("[data-ink]", heading);
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: heading, start: "top 88%", end: "bottom 42%", scrub: 0.6 },
      });
      words.forEach((word, i) => {
        const to = FINAL[(word.dataset.ink as keyof typeof FINAL) ?? "full"];
        tl.fromTo(word, { color: DIM }, { color: to, duration: 1 }, i * 0.32);
      });
    },
    { scope: ref },
  );

  return (
    <h2 ref={ref} id={id} className={cn("font-display font-medium tracking-[-0.03em] text-pretty", className)}>
      {parts.map((part, p) => (
        <span key={p} className={part.tone === "soft" ? "text-cream/45" : "text-cream"}>
          {p > 0 && " "}
          {part.text.split(" ").map((word, w) => (
            <Fragment key={w}>
              {w > 0 && " "}
              <span data-ink={part.tone ?? "full"}>{word}</span>
            </Fragment>
          ))}
        </span>
      ))}
    </h2>
  );
}
