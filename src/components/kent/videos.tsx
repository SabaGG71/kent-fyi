"use client";

import { useState } from "react";

/**
 * A YouTube video that costs nothing until it's wanted: its thumbnail and title, and the player only loads
 * when you press play, in the same frame.
 */
export function Video({ id, title }: { id: string; title: string }) {
  const [playing, setPlaying] = useState(false);

  return (
    <figure>
      <div className="relative aspect-video overflow-hidden bg-fg/5">
        {playing ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
            className="absolute inset-0 h-full w-full"
          />
        ) : (
          <button type="button" onClick={() => setPlaying(true)} className="group absolute inset-0 block h-full w-full" aria-label={`Play: ${title}`}>
            {/* eslint-disable-next-line @next/next/no-img-element -- YouTube's own thumbnail, already sized */}
            <img src={`https://i.ytimg.com/vi/${id}/maxresdefault.jpg`} alt="" loading="lazy" className="h-full w-full object-cover" />
            <span className="t-label absolute bottom-3 left-3 bg-bg px-2 py-1 group-hover:text-hover">Play &#9654;</span>
          </button>
        )}
      </div>
      <figcaption className="t-small mt-3">
        <a href={`https://www.youtube.com/watch?v=${id}`} target="_blank" rel="noreferrer" className="underline decoration-1 underline-offset-[4px] hover:text-hover hover:decoration-hover">
          {title}
          <span aria-hidden>&nbsp;&#8599;</span>
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      </figcaption>
    </figure>
  );
}
