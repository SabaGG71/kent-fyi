"use client";

import { countdown, nextFullMoon } from "@/lib/moon";
import { useMinute } from "./time";

/** how long until the full moon, the night the Lunar Society meets nearest to: one quiet line, live */
export function FullMoonCountdown() {
  const minute = useMinute();
  if (!minute) return <p aria-hidden className="mono">&nbsp;</p>;
  const full = nextFullMoon(minute);
  const date = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", timeZone: "Asia/Tbilisi" }).format(full);
  return (
    <p className="mono">
      <span className="text-ink/55">Next full moon</span> {date}, in {countdown(full - minute)}.
    </p>
  );
}
