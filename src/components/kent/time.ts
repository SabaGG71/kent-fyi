"use client";

import { useSyncExternalStore } from "react";

// Live values read on the client only: the server renders nothing for them, so the markup always matches.

const every = (ms: number) => (onChange: () => void) => {
  const id = window.setInterval(onChange, ms);
  return () => window.clearInterval(id);
};
const tenSeconds = every(10_000);

const tbilisi = new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Tbilisi", hour: "2-digit", minute: "2-digit" });

/** the time in Tbilisi, to the minute, "14:32" */
export const useTbilisiTime = () => useSyncExternalStore(tenSeconds, () => tbilisi.format(Date.now()), () => "");

/** the current minute, as ms since the epoch (0 on the server) */
export const useMinute = () => useSyncExternalStore(tenSeconds, () => Math.floor(Date.now() / 60_000) * 60_000, () => 0);

/** the current year, "2026" */
export const useYear = () => useSyncExternalStore(tenSeconds, () => String(new Date().getFullYear()), () => "");
