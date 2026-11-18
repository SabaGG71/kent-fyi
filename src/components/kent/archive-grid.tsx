"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import type { Photo } from "@/lib/kent";

/**
 * The image archive. On a wide screen, loose columns. On a phone it is a camera roll: small squares, three
 * across, edge to edge, and a tap opens the photograph full screen, where a swipe goes to the next.
 */
export function ArchiveGrid({ photos }: { photos: Photo[] }) {
  const [open, setOpen] = useState<number | null>(null);
  const [at, setAt] = useState(0);
  const track = useRef<HTMLUListElement>(null);

  // open on the photograph that was tapped
  useLayoutEffect(() => {
    if (open === null || !track.current) return;
    track.current.scrollLeft = open * track.current.clientWidth;
    setAt(open);
  }, [open]);

  // while it's open the page behind stays put, and Escape closes it
  useEffect(() => {
    if (open === null) return;
    const before = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    const key = (e: KeyboardEvent) => e.key === "Escape" && setOpen(null);
    window.addEventListener("keydown", key);
    return () => {
      document.documentElement.style.overflow = before;
      window.removeEventListener("keydown", key);
    };
  }, [open]);

  return (
    <>
      <ul className="-mx-(--m) mt-[clamp(22px,2.6vw,36px)] grid grid-cols-3 gap-[2px] md:hidden">
        {photos.map((p, i) => (
          <li key={p.src}>
            <button type="button" onClick={() => setOpen(i)} aria-label={`Open photo ${i + 1} of ${photos.length}: ${p.alt}`} className="relative block aspect-square w-full overflow-hidden">
              <Image src={p.src} alt="" fill sizes="34vw" className="object-cover" style={{ objectPosition: p.position }} />
            </button>
          </li>
        ))}
      </ul>

      <ul className="mt-[clamp(22px,2.6vw,36px)] hidden columns-3 gap-(--g) md:block xl:columns-4">
        {photos.map((p) => (
          <li key={p.src} className="mb-(--g) break-inside-avoid">
            <Image src={p.src} alt={p.alt} width={1200} height={1500} sizes="(min-width: 1280px) 25vw, 33vw" className="h-auto w-full" />
          </li>
        ))}
      </ul>

      {open !== null && (
        <div role="dialog" aria-modal="true" aria-label="Image archive" className="fixed inset-0 z-50 bg-bg md:hidden">
          <ul
            ref={track}
            onScroll={(e) => setAt(Math.round(e.currentTarget.scrollLeft / e.currentTarget.clientWidth))}
            className="flex h-full snap-x snap-mandatory overflow-x-auto overscroll-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {photos.map((p, i) => (
              <li key={p.src} className="relative h-full w-full shrink-0 snap-center snap-always">
                {/* only the photographs near the one on screen are loaded */}
                {Math.abs(i - at) <= 1 && <Image src={p.src} alt={p.alt} fill sizes="100vw" className="object-contain" />}
              </li>
            ))}
          </ul>
          <div className="t-label pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between px-(--m) pt-[max(14px,env(safe-area-inset-top))]">
            <p className="bg-bg/70 px-1.5 py-1">
              {String(at + 1).padStart(2, "0")} / {String(photos.length).padStart(2, "0")}
            </p>
            <button type="button" autoFocus onClick={() => setOpen(null)} className="pointer-events-auto border border-fg bg-bg px-2.5 py-1.5">
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
