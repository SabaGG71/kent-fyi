"use client";

import { useState } from "react";
import Image from "next/image";
import type { Photo, Project } from "@/lib/kent";
import { cn } from "@/lib/utils";
import { Out } from "./links";

/**
 * A project index: each project as a row (what kind of thing it is, its name, what it is, where to explore
 * it), and one photograph on the right for whichever row is pointed at or focused,
 * `fallback` until one is. Other names step back while one is lit. On a phone there is no hover, so each
 * row carries its own photograph.
 */
export function ProjectIndex({ projects, fallback, compact = false, children }: { projects: Project[]; fallback: Photo; compact?: boolean; children?: React.ReactNode }) {
  const [active, setActive] = useState<string | null>(null);
  const shown = projects.find((p) => p.id === active)?.photo ?? fallback;
  const photos = [fallback, ...projects.map((p) => p.photo)].filter((ph, i, all) => all.findIndex((o) => o.src === ph.src) === i);

  return (
    <div className="grid grid-cols-1 gap-x-(--g) lg:grid-cols-12">
      <div className="lg:col-span-7">
        {children}
        <ul onPointerLeave={() => setActive(null)}>
          {projects.map((p) => {
            const lit = active === p.id;
            return (
              <li
                key={p.id}
                id={p.id}
                onPointerEnter={() => setActive(p.id)}
                onFocus={() => setActive(p.id)}
                onBlur={() => setActive(null)}
                className="grid scroll-mt-6 grid-cols-[1fr_auto] gap-x-5 border-t border-fg/20 py-[clamp(22px,2.6vw,36px)] first:border-t-0 lg:grid-cols-1"
              >
                <div>
                  <p className="t-label text-fg/65">{p.kind}</p>
                  <h3
                    className={cn(
                      "mt-2 transition-colors duration-300",
                      compact ? "text-[clamp(28px,3.2vw,52px)] leading-none tracking-[-0.03em]" : "t-display",
                      lit ? "text-accent" : active ? "text-fg/40" : "text-fg",
                    )}
                  >
                    {p.name}
                  </h3>
                  <p className="t-lead mt-4 max-w-[52ch] text-fg/85">{p.what}</p>
                  <p className="t-small mt-3 flex flex-wrap gap-x-5 gap-y-1">
                    {p.links.map((l) => (
                      <Out key={l.label} href={l.href}>
                        {l.label}
                      </Out>
                    ))}
                  </p>
                </div>
                {/* on a phone, the photograph sits beside its project */}
                <div className="relative mt-1 aspect-[4/5] w-[28vw] max-w-[160px] overflow-hidden lg:hidden">
                  <Image src={p.photo.src} alt="" fill sizes="30vw" className="object-cover" style={{ objectPosition: p.photo.position }} />
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      {/* on a wide screen: one photograph, for the row you're on */}
      <div className="hidden lg:col-span-4 lg:col-start-9 lg:block">
        <div className="sticky top-[calc(var(--m)+24px)]">
          <div role="img" aria-label={shown.alt} className="relative aspect-[4/5] w-full overflow-hidden bg-fg/5">
            {photos.map((ph) => (
              <Image
                key={ph.src}
                src={ph.src}
                alt=""
                fill
                sizes="34vw"
                className={cn("object-cover transition-opacity duration-500", ph.src === shown.src ? "opacity-100" : "opacity-0")}
                style={{ objectPosition: ph.position }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
