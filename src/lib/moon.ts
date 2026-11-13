/**
 * The moon, for dinner.fyi: when the next full moon is.
 *
 * Full moons follow Jean Meeus, Astronomical Algorithms (2nd ed.), chapter 49: the mean lunation, then the
 * periodic and planetary corrections for a full moon. Good to about a minute. Dynamical time is turned into
 * UTC with ΔT ≈ 69 s, close enough for the 2020s.
 */

const DAY = 86_400_000;
const SYNODIC = 29.530588861;
const JD_UNIX_EPOCH = 2440587.5;
const DELTA_T_DAYS = 69 / 86_400;

const rad = (deg: number) => (deg * Math.PI) / 180;
const toJd = (ms: number) => ms / DAY + JD_UNIX_EPOCH;
const fromJd = (jd: number) => (jd - JD_UNIX_EPOCH) * DAY;

/** the full moon of lunation k (k ends in .5), in Julian days (UTC) */
function fullMoonJd(k: number) {
  const T = k / 1236.85;
  const T2 = T * T;
  const T3 = T2 * T;
  const T4 = T3 * T;
  let jde = 2451550.09766 + SYNODIC * k + 0.00015437 * T2 - 0.00000015 * T3 + 0.00000000073 * T4;

  const E = 1 - 0.002516 * T - 0.0000074 * T2;
  const M = rad(2.5534 + 29.1053567 * k - 0.0000014 * T2 - 0.00000011 * T3);
  const Mp = rad(201.5643 + 385.81693528 * k + 0.0107582 * T2 + 0.00001238 * T3 - 0.000000058 * T4);
  const F = rad(160.7108 + 390.67050284 * k - 0.0016118 * T2 - 0.00000227 * T3 + 0.000000011 * T4);
  const O = rad(124.7746 - 1.56375588 * k + 0.0020672 * T2 + 0.00000215 * T3);
  const sin = Math.sin;

  jde +=
    -0.40614 * sin(Mp) +
    0.17302 * E * sin(M) +
    0.01614 * sin(2 * Mp) +
    0.01043 * sin(2 * F) +
    0.00734 * E * sin(Mp - M) -
    0.00515 * E * sin(Mp + M) +
    0.00209 * E * E * sin(2 * M) -
    0.00111 * sin(Mp - 2 * F) -
    0.00057 * sin(Mp + 2 * F) +
    0.00056 * E * sin(2 * Mp + M) -
    0.00042 * sin(3 * Mp) +
    0.00042 * E * sin(M + 2 * F) +
    0.00038 * E * sin(M - 2 * F) -
    0.00024 * E * sin(2 * Mp - M) -
    0.00017 * sin(O) -
    0.00007 * sin(Mp + 2 * M) +
    0.00004 * sin(2 * Mp - 2 * F) +
    0.00004 * sin(3 * M) +
    0.00003 * sin(Mp + M - 2 * F) +
    0.00003 * sin(2 * Mp + 2 * F) -
    0.00003 * sin(Mp + M + 2 * F) +
    0.00003 * sin(Mp - M + 2 * F) -
    0.00002 * sin(Mp - M - 2 * F) -
    0.00002 * sin(3 * Mp + M) +
    0.00002 * sin(4 * Mp);

  // the planetary arguments
  const A = [
    [299.77 + 0.107408 * k - 0.009173 * T2, 0.000325],
    [251.88 + 0.016321 * k, 0.000165],
    [251.83 + 26.651886 * k, 0.000164],
    [349.42 + 36.412478 * k, 0.000126],
    [84.66 + 18.206239 * k, 0.00011],
    [141.74 + 53.303771 * k, 0.000062],
    [207.14 + 2.453732 * k, 0.00006],
    [154.84 + 7.30686 * k, 0.000056],
    [34.52 + 27.261239 * k, 0.000047],
    [207.19 + 0.121824 * k, 0.000042],
    [291.34 + 1.844379 * k, 0.00004],
    [161.72 + 24.198154 * k, 0.000037],
    [239.56 + 25.513099 * k, 0.000035],
    [331.55 + 3.592518 * k, 0.000023],
  ];
  for (const [arg, c] of A) jde += c * sin(rad(arg));

  return jde - DELTA_T_DAYS;
}

/** the next full moon after a moment (ms since the epoch), as ms since the epoch */
export function nextFullMoon(now: number) {
  const jd = toJd(now);
  let k = Math.floor((jd - 2451550.09766) / SYNODIC) - 1 + 0.5;
  while (fullMoonJd(k) <= jd) k += 1;
  return fromJd(fullMoonJd(k));
}

/** "10d 20h 54m" */
export function countdown(ms: number) {
  const m = Math.max(0, Math.floor(ms / 60_000));
  return `${Math.floor(m / 1440)}d ${Math.floor((m % 1440) / 60)}h ${m % 60}m`;
}
