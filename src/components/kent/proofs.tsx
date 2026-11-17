/**
 * The inks Supra Run (/run) is printed in: Kent's marble proofs, Lavender by default. The game reads the
 * proof's ink and flood colour to tint the whole street.
 */
import type { Rgb } from "./run/world";

export const PROOFS = [
  { key: "fyi", name: "FYI", ink: "#0b0e10", flood: "#bed3d8" },
  { key: "blue", name: "Blue", ink: "#063c5a", flood: "#cfe4ec" },
  { key: "mint", name: "Mint", ink: "#0c4b5c", flood: "#a8e0cf" },
  { key: "peach", name: "Peach", ink: "#2b8d96", flood: "#f3c5a3" },
  { key: "lavender", name: "Lavender", ink: "#46469a", flood: "#b9ddf2" },
] as const;

export type ProofKey = (typeof PROOFS)[number]["key"];
export const DEFAULT_PROOF: ProofKey = "lavender";

export const rgb = (hex: string): Rgb => [parseInt(hex.slice(1, 3), 16) / 255, parseInt(hex.slice(3, 5), 16) / 255, parseInt(hex.slice(5, 7), 16) / 255];
export const proofOf = (key: ProofKey) => PROOFS.find((p) => p.key === key) ?? PROOFS[4];
/** the proof the game is printed in */
export const useProof = (): ProofKey => DEFAULT_PROOF;
