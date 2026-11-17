"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    instgrm?: { Embeds: { process: () => void } };
  }
}

const SCRIPT = "https://www.instagram.com/embed.js";

/**
 * An Instagram reel, played in place with Instagram's own embed. Its script is loaded once, and run again for
 * any reel that mounts later. Until it loads (or if it's blocked), a plain link to the reel stands in.
 */
export function InstagramReel({ url, title }: { url: string; title: string }) {
  useEffect(() => {
    if (window.instgrm) {
      window.instgrm.Embeds.process();
      return;
    }
    if (document.querySelector(`script[src="${SCRIPT}"]`)) return;
    const s = document.createElement("script");
    s.src = SCRIPT;
    s.async = true;
    document.body.appendChild(s);
  }, []);

  return (
    <blockquote
      className="instagram-media"
      data-instgrm-permalink={url}
      data-instgrm-version="14"
      style={{ background: "#000", border: 0, margin: 0, maxWidth: "100%", minWidth: 326, width: "100%", padding: 0 }}
    >
      <a href={url} target="_blank" rel="noreferrer" className="t-small underline decoration-1 underline-offset-[4px] hover:text-hover hover:decoration-hover">
        {title} on Instagram<span aria-hidden>&nbsp;&#8599;</span>
      </a>
    </blockquote>
  );
}
