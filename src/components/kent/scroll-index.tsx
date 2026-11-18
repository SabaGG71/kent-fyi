"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * The index box: once the top nav has scrolled away, a white-outlined box on the right lists the sections,
 * and a dot moves down it as you scroll through them. On a phone it is a small pill at the foot of the
 * screen, under the thumb, naming the section you're in; a tap opens the list above it.
 */
export function ScrollIndex({ sections }: { sections: { id: string; label: string }[] }) {
  const [shown, setShown] = useState(false);
  const [active, setActive] = useState(0);
  // the phone's pill: in once the first screen (the photograph) is mostly past, and whether its list is open
  const [past, setPast] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const update = () => {
      // in once the header (about 60px) is gone
      setShown(window.scrollY > 80);
      setPast(window.scrollY > window.innerHeight * 0.6);
      // the section you're in: the last one whose top has passed 40% of the way down the screen
      const line = window.innerHeight * 0.4;
      let at = 0;
      sections.forEach((s, i) => {
        const el = document.getElementById(s.id);
        if (el && el.getBoundingClientRect().top <= line) at = i;
      });
      // at the very bottom, the last section is the one you're in, even if it's short
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) at = sections.length - 1;
      setActive(at);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [sections]);

  return (
    <>
    <nav
      aria-label="On this page"
      className={cn(
        // bottom right, under the project photograph that stays beside the index at the top of the page
        "fixed right-(--m) bottom-(--m) z-40 hidden border border-fg bg-bg px-3.5 py-2.5 xl:block",
        shown ? "visible opacity-100" : "invisible opacity-0",
      )}
    >
      <ol className="relative">
        {sections.map((s, i) => (
          <li key={s.id}>
            <a href={`#${s.id}`} aria-current={i === active ? "location" : undefined} className={cn("t-label flex items-center gap-2 py-[2px] pr-1 text-[11px] hover:text-hover", i === active ? "text-fg" : "text-fg/55")}>
              <span aria-hidden className={cn("size-[6px] rounded-full", i === active ? "bg-accent" : "bg-transparent")} />
              {s.label}
            </a>
          </li>
        ))}
      </ol>
    </nav>

      {/* the phone's pill */}
      <nav aria-label="On this page" className={cn("fixed inset-x-0 bottom-[max(14px,env(safe-area-inset-bottom))] z-40 flex flex-col items-center gap-2 xl:hidden", past ? "visible" : "invisible")}>
        {open && (
          <>
            <button type="button" aria-label="Close the list" onClick={() => setOpen(false)} className="fixed inset-0 -z-10 bg-bg/60" />
            <ol className="border border-fg bg-bg px-4 py-2.5">
              {sections.map((s, i) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} onClick={() => setOpen(false)} aria-current={i === active ? "location" : undefined} className={cn("t-label flex items-center gap-2.5 py-[7px] pr-2", i === active ? "text-fg" : "text-fg/60")}>
                    <span aria-hidden className={cn("size-[6px] rounded-full", i === active ? "bg-accent" : "bg-transparent")} />
                    {s.label}
                  </a>
                </li>
              ))}
            </ol>
          </>
        )}
        <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} className="t-label flex items-center gap-2.5 border border-fg bg-bg py-2 pr-3.5 pl-3 text-[12px]">
          <span aria-hidden className="size-[6px] rounded-full bg-accent" />
          {sections[active]?.label}
          <span aria-hidden className="text-fg/55">
            {open ? "×" : `${String(active + 1).padStart(2, "0")}/${String(sections.length).padStart(2, "0")}`}
          </span>
        </button>
      </nav>
    </>
  );
}
