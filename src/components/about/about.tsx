"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { VinesCanvas, VINES, type VinesFx } from "./vines-canvas";
import { SIGNATURE } from "./signature-data";
import { InkHeading } from "@/components/site/ink-heading";

/** the opening line: the first sentence in full cream, the second a step back */
const LEAD = ["It started with a coffee cart on the back of a bike.", "Nobody knew it existed."];

const STORY = [
  "That was 2014. I spent the year fixing burst water lines and popped circuits at farmers markets, then closed it. I blamed the equipment. The truth was simpler: outside the few dozen people who walked past on a Saturday, nobody knew I was there.",
  "So I started over. Zane and I spent six years building VOILA, an instant coffee that made The Wall Street Journal and Forbes. We learned ecommerce the hard way: conversion rates, brand, and earning trust before anyone tastes a cup.",
  "LocalEyes Growth is the thing I needed in 2014. We only work with coffee carts, dessert carts and mobile bars. You rarely lose to the better cart. You lose to the one that shows up first.",
];

const PRESS = ["The Wall Street Journal", "Forbes", "Gear Patrol", "Uncrate"];

/**
 * About, set like a magazine page. The opening line fills in with the scroll like ink. The photo opens out
 * of its frame and lives: a depth map lets the near vine leaves slide a touch faster than the two of them
 * as you scroll, and sway in a breeze, while the photo itself stays sharp. The story sits beside it, signed
 * off with one line and the press VOILA earned. One screen and a bit, nothing pinned.
 */
export function About() {
  const root = useRef<HTMLElement>(null);
  const photo = useRef<HTMLImageElement>(null);
  const fx = useRef<VinesFx>({ drift: 0, zoom: 1 });

  const onStatus = (status: "on" | "off") => root.current?.setAttribute("data-webgl", status);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const q = gsap.utils.selector(root);
      const arrive = (trigger: Element, start = "top 82%") => ({ trigger, start, once: true });

      // the photo opens out of its frame and settles
      const frame = q("[data-frame]")[0];
      gsap.fromTo(
        frame,
        { clipPath: "inset(12% 14% 12% 14% round 4px)" },
        { clipPath: "inset(0% 0% 0% 0% round 4px)", duration: 1.6, ease: "expo.out", scrollTrigger: arrive(frame) },
      );
      gsap.fromTo(fx.current, { zoom: 1.18 }, { zoom: 1, duration: 2.2, ease: "expo.out", scrollTrigger: arrive(frame) });
      // and its near leaves slide past the two of them as it travels up the screen
      gsap.fromTo(fx.current, { drift: -1 }, { drift: 1, ease: "none", scrollTrigger: { trigger: frame, start: "top bottom", end: "bottom top", scrub: true } });

      // the story and the sign-off rise in, a beat apart
      const story = q("[data-story]")[0];
      gsap.from(q("[data-rise]"), { y: 28, opacity: 0, duration: 1.1, ease: "expo.out", stagger: 0.08, scrollTrigger: arrive(story, "top 80%") });
      gsap.from(q("[data-rule]"), { scaleX: 0, duration: 1.2, ease: "expo.out", scrollTrigger: arrive(story, "top 80%") });

      // his name writes itself in, left to right, like a pen across the page
      const signature = q("[data-signature]")[0];
      gsap.fromTo(
        signature,
        { clipPath: "inset(-20% 100% -20% 0%)" },
        { clipPath: "inset(-20% 0% -20% 0%)", duration: 1.6, ease: "power2.inOut", scrollTrigger: arrive(signature, "top 88%") },
      );
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="about"
      aria-labelledby="about-title"
      className="relative bg-coal pt-[clamp(104px,11vw,168px)] pr-[var(--pad-r)] pb-[clamp(96px,10vw,152px)] pl-[var(--pad-l)]"
    >
      <div className="grid grid-cols-1 gap-y-8 lg:grid-cols-12 lg:gap-x-8">
        <p className="text-[12px] font-semibold tracking-[0.02em] text-cream/60 uppercase lg:col-span-3 lg:pt-[0.7em]">
          <span aria-hidden className="mr-2 inline-block size-[6px] -translate-y-px rounded-full bg-ember align-middle" />
          About
        </p>
        {/* fills in with the scroll, like ink */}
        <InkHeading
          id="about-title"
          parts={[{ text: LEAD[0] }, { text: LEAD[1], tone: "soft" }]}
          className="text-[clamp(34px,4.4vw,72px)] leading-[1.04] lg:col-span-9"
        />
      </div>

      <div className="mt-[clamp(48px,6vw,96px)] grid grid-cols-1 gap-y-10 lg:grid-cols-12 lg:gap-x-8">
        {/* the photograph, alive: it holds its place while the story beside it is read */}
        <figure className="lg:sticky lg:top-[14vh] lg:col-span-7 lg:self-start">
          <div data-frame className="relative aspect-[4/3] overflow-hidden rounded-[4px] bg-[#1c0705] sm:aspect-[1345/889]">
            <Image
              ref={photo}
              data-photo-fallback
              src={VINES.src}
              alt="Kent and a friend under autumn grapevines, arms out, in red work gloves"
              fill
              quality={90}
              sizes="(min-width: 1024px) 56vw, 100vw"
              className="object-cover transition-opacity duration-700"
              style={{ objectPosition: `${VINES.position[0] * 100}% ${VINES.position[1] * 100}%` }}
            />
            <VinesCanvas data-vines fx={fx} source={photo} onStatus={onStatus} className="absolute inset-0 size-full opacity-0 transition-opacity duration-700" />
            <div aria-hidden className="grain pointer-events-none absolute inset-0" />
          </div>
          <figcaption className="mt-4 flex items-center justify-between text-[12px] font-semibold tracking-[0.02em] text-cream/55 uppercase">
            <span>Autumn, in the vines</span>
            <span>Off the clock</span>
          </figcaption>
        </figure>

        <div data-story className="lg:col-span-5 lg:col-start-8">
          <div className="space-y-6">
            {STORY.map((paragraph, i) => (
              <p
                key={i}
                data-rise
                className={
                  i === 0
                    ? "text-[19px] leading-[1.55] font-medium tracking-[-0.01em] text-cream md:text-[21px]"
                    : "text-[16px] leading-[1.65] text-cream/70 md:text-[17px]"
                }
              >
                {paragraph}
              </p>
            ))}
          </div>

          <div className="mt-10">
            <span data-rule aria-hidden className="block h-px origin-left bg-cream/15" />
            <p data-rise className="mt-8 font-display text-[clamp(28px,2.6vw,40px)] leading-[1.08] font-medium tracking-[-0.03em] text-balance text-cream">
              I know what an empty calendar feels like.
            </p>
            <svg data-signature role="img" aria-label="Signed, Kent" viewBox={SIGNATURE.viewBox} className="mt-6 h-[clamp(64px,5.6vw,84px)] w-auto fill-cream">
              <path d={SIGNATURE.d} />
            </svg>
            <p data-rise className="mt-3 text-[12px] font-semibold tracking-[0.02em] text-cream/60 uppercase">
              Kent Sheridan, co-founder of LocalEyes Growth
            </p>
          </div>

          {/* the press VOILA earned */}
          <div data-rise className="mt-12">
            <p className="text-[12px] font-semibold tracking-[0.02em] text-cream/45 uppercase">VOILA, written up in</p>
            <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1 font-display text-[clamp(18px,1.42vw,21px)] leading-[1.3] tracking-[-0.02em] text-cream/55">
              {PRESS.map((name) => (
                <li key={name} className="transition-colors duration-500 hover:text-cream">
                  {name}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
