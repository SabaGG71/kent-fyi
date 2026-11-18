"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Photo, Project } from "@/lib/kent";
import { cn } from "@/lib/utils";
import { Out } from "./links";

/**
 * A project index: each project as a row (what kind of thing it is, its name, what it is, where to explore
 * it), and one photograph on the right for whichever row is pointed at or focused,
 * `fallback` until one is. Other names step back while one is lit. On a phone there is no hover, so
 * scrolling does the pointing: one photograph stays pinned at the top while the rows pass under it, and it
 * changes to the project whose row has reached the reading line.
 */
export function ProjectIndex({ projects, fallback, compact = false, children }: { projects: Project[]; fallback: Photo; compact?: boolean; children?: React.ReactNode }) {
  const [active, setActive] = useState<string | null>(null);
  const shown = projects.find((p) => p.id === active)?.photo ?? fallback;
  // on a phone: the row at the reading line
  const [near, setNear] = useState(0);
  const list = useRef<HTMLUListElement>(null);
  useEffect(() => {
    const update = () => {
      const rows = list.current?.children;
      if (!rows) return;
      const line = window.innerHeight * 0.72;
      let at = 0;
      for (let i = 0; i < rows.length; i++) if (rows[i].getBoundingClientRect().top <= line) at = i;
      setNear(at);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);
  const photos = [fallback, ...projects.map((p) => p.photo)].filter((ph, i, all) => all.findIndex((o) => o.src === ph.src) === i);

  return (
    <div className="grid grid-cols-1 gap-x-(--g) lg:grid-cols-12">
      <div className="lg:col-span-7">
        {children}
        {/* on a phone: the pinned photograph, edge to edge */}
        <div className="sticky top-0 z-10 -mx-(--m) bg-bg lg:hidden">
          <div className="relative h-[46svh] overflow-hidden">
            {projects.map((p, i) => (
              <Image key={p.id} src={p.photo.src} alt="" fill sizes="100vw" className={cn("object-cover transition-opacity duration-300", i === near ? "opacity-100" : "opacity-0")} style={{ objectPosition: p.photo.position }} />
            ))}
            <p className="t-label absolute bottom-0 left-0 bg-bg py-1.5 pr-3 pl-(--m) text-[11px]" aria-hidden>
              {String(near + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}
            </p>
          </div>
        </div>
        <ul ref={list} onPointerLeave={() => setActive(null)}>
          {projects.map((p, i) => {
            const lit = active === p.id;
            return (
              <li
                key={p.id}
                id={p.id}
                onPointerEnter={() => setActive(p.id)}
                onFocus={() => setActive(p.id)}
                onBlur={() => setActive(null)}
                className="scroll-mt-[calc(46svh+12px)] border-t border-fg/20 py-[clamp(22px,2.6vw,36px)] first:border-t-0 lg:scroll-mt-6"
              >
                <div>
                  <p className="t-label text-fg/65">{p.kind}</p>
                  <h3
                    className={cn(
                      "mt-2",
                      compact ? "text-[clamp(28px,3.2vw,52px)] leading-none tracking-[-0.03em]" : "t-display",
                      i === near ? "max-lg:text-accent" : "max-lg:text-fg/40",
                      lit ? "lg:text-accent" : active ? "lg:text-fg/40" : "lg:text-fg",
                    )}
                  >
                    {p.page ? <Link href={p.page}>{p.name}</Link> : p.name}
                  </h3>
                  <p className="t-lead mt-4 max-w-[52ch] text-fg/85">{p.what}</p>
                  <p className="t-small mt-3 flex flex-wrap gap-x-5 gap-y-1">
                    {p.links.map((l) => (
                      <Out key={l.label} href={l.href}>
                        {l.label}
                      </Out>
                    ))}
                  </p>
                  {p.press && p.press.length > 0 && (
                    <p className="t-small mt-3 max-w-[60ch] text-fg/60">
                      <span className="t-label mr-2 text-fg/50">Press</span>
                      {p.press.map((l, i) => (
                        <span key={l.label}>
                          {l.href ? <Out href={l.href}>{l.label}</Out> : l.label}
                          {i < p.press!.length - 1 && <span aria-hidden>,&ensp;</span>}
                        </span>
                      ))}
                    </p>
                  )}
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
