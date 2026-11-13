"use client";

import { useSyncExternalStore } from "react";
import { cn } from "@/lib/utils";
import type { Rgb } from "./print-gl";

/**
 * The five proofs: Kent's marble printed in five colourways (the FYI artwork, then prints 1, 2, 4 and 5).
 * Picking one re-inks the live print in the hero and swaps the marble band at the foot of the page. The
 * choice lives on <html data-proof> (set before first paint by the layout) and in localStorage.
 */
export const PROOFS = [
  { key: "fyi", name: "FYI", ink: "#0b0e10", flood: "#bed3d8", band: "/kent/proofs/fyi.webp" },
  { key: "blue", name: "Blue", ink: "#063c5a", flood: "#cfe4ec", band: "/kent/proofs/blue.webp" },
  { key: "mint", name: "Mint", ink: "#0c4b5c", flood: "#a8e0cf", band: "/kent/proofs/mint.webp" },
  { key: "peach", name: "Peach", ink: "#2b8d96", flood: "#f3c5a3", band: "/kent/proofs/peach.webp" },
  { key: "lavender", name: "Lavender", ink: "#46469a", flood: "#b9ddf2", band: "/kent/proofs/lavender.webp" },
] as const;

export type ProofKey = (typeof PROOFS)[number]["key"];
/** the proof a first visit is printed in */
export const DEFAULT_PROOF: ProofKey = "lavender";
const KEY = "kentfyi:proof";
const listeners = new Set<() => void>();

export const rgb = (hex: string): Rgb => [parseInt(hex.slice(1, 3), 16) / 255, parseInt(hex.slice(3, 5), 16) / 255, parseInt(hex.slice(5, 7), 16) / 255];

const read = (): ProofKey => {
  const v = document.documentElement.dataset.proof;
  return PROOFS.some((p) => p.key === v) ? (v as ProofKey) : DEFAULT_PROOF;
};

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function setProof(key: ProofKey) {
  document.documentElement.dataset.proof = key;
  try {
    localStorage.setItem(KEY, key);
  } catch {
    // private mode or blocked storage: the choice lasts for this page only
  }
  listeners.forEach((l) => l());
}

export const useProof = () => useSyncExternalStore(subscribe, read, () => DEFAULT_PROOF);
export const proofOf = (key: ProofKey) => PROOFS.find((p) => p.key === key) ?? PROOFS[0];

/** a row of five small proofs: each a square split between its ink and its flood */
export function ProofPicker({ className }: { className?: string }) {
  const current = useProof();
  return (
    <div role="group" aria-label="Print colour" className={cn("flex flex-wrap items-center gap-x-3 gap-y-2", className)}>
      {PROOFS.map((p, i) => (
        <button
          key={p.key}
          type="button"
          onClick={() => setProof(p.key)}
          aria-pressed={current === p.key}
          className={cn("group/proof inline-flex cursor-pointer items-center gap-1.5", current === p.key ? "text-ink" : "text-ink/45 hover:text-ink")}
        >
          <span
            aria-hidden
            className={cn("size-3.5 outline-offset-2 transition-[outline-color]", current === p.key ? "outline outline-1 outline-ink" : "outline outline-1 outline-transparent")}
            style={{ background: `linear-gradient(135deg, ${p.ink} 50%, ${p.flood} 50%)` }}
          />
          <span>
            {i + 1}. {p.name}
          </span>
        </button>
      ))}
    </div>
  );
}
