// Intro choreography, ported from design/intro-animation.jsx.
// Every frame is a pure function of time T (seconds) and the viewport.

export const STAGE = { W: 1920, H: 1080 };
export const R = 420; // disc radius in emblem units (emblem box = 1000×1000)
export const PLANE = 180;
const PK = PLANE / 200;
export const FLIGHT_Y = 560;
export const HEADING = -4;
export const ENG_X = (104 - 100) * PK;
export const ENG_Y = (76 - 100) * PK;
export const TRAIL_L = -340;
export const TRAIL_W = 1100;
export const TRAIL_H = 48;

/** Scene starts, back to back, in authored seconds (the design's 1× timing). */
export const CUES = { Sunrise: 0, Transit: 2.2, Condense: 4.6, Home: 6.4 } as const;
export const TOTAL = 8.0;
/** Playback speed. The 8.0s authored timeline plays in TOTAL / SPEED ≈ 3.6s. */
export const SPEED = 2.2;

// ── Easing / tween helpers (same maths as the prototype's engine) ──
const clamp = (v: number, min = 0, max = 1) => Math.max(min, Math.min(max, v));
const easeOutCubic = (t: number) => {
  const u = t - 1;
  return u * u * u + 1;
};
const easeOutQuart = (t: number) => {
  const u = t - 1;
  return 1 - u * u * u * u;
};
const easeInOutExpo = (t: number) => {
  if (t === 0) return 0;
  if (t === 1) return 1;
  return t < 0.5 ? 0.5 * Math.pow(2, 20 * t - 10) : 1 - 0.5 * Math.pow(2, -20 * t + 10);
};
const MOTION = { enter: easeOutCubic, glide: easeInOutExpo, ping: easeOutQuart };

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
/** Linear map of t from [t0, t1] to [a, b], clamped. */
const interpolate = (t: number, t0: number, t1: number, a: number, b: number) => lerp(a, b, clamp((t - t0) / (t1 - t0)));
/** Eased tween from a to b between start and end. */
const animate = (t: number, start: number, end: number, a: number, b: number, ease: (x: number) => number) =>
  t <= start ? a : t >= end ? b : lerp(a, b, ease((t - start) / (end - start)));

export type Layout = {
  /** Viewport size, px. */
  w: number;
  h: number;
  /** Centre and size of the real logo element, px. */
  logoCx: number;
  logoCy: number;
  logoD: number;
};

export type Frame = ReturnType<typeof frame>;

export function frame(T: number, L: Layout, night: boolean) {
  const { Sunrise: S, Transit: TR, Condense: CD, Home: HM } = CUES;
  const g0 = CD + 0.25;
  const g1 = CD + 1.65;
  const e = animate(T, g0, g1, 0, 1, MOTION.glide);

  // The 1920×1080 composition covers the viewport. On narrow portrait
  // screens it is capped so the whole emblem stays in view.
  const k = Math.min(Math.max(L.w / STAGE.W, L.h / STAGE.H), L.w / 1000);

  // Camera: slow push + drift, then a log-space zoom down into the logo.
  // The sun logo's viewBox is 860 wide around the disc, the moon's 840.
  const push = interpolate(T, S, g0, 0.965, 1.04) * k;
  const endScale = L.logoD / (night ? 2 * R : 860);
  const scale = Math.exp(Math.log(push) + (Math.log(endScale) - Math.log(push)) * e);
  const drift = interpolate(T, S, g0, 16, -16) * k;
  const cx0 = L.w / 2 + drift;
  const cx = cx0 + (L.logoCx - cx0) * e;
  const cy = L.h / 2 + (L.logoCy - L.h / 2) * e;

  const rise = animate(T, S + 0.1, S + 1.9, 0, 1, MOTION.enter);
  const glowIn = animate(T, S, S + 1.4, 0, 1, MOTION.enter);
  const glowOut = 1 - clamp((e - 0.25) / 0.5);
  const brightness = 0.35 + 0.65 * rise;

  // Plane: off-screen, then a constant-speed streak, then eases into its logo pose.
  const px =
    T < TR - 1.0
      ? -620
      : T < CD
        ? interpolate(T, TR - 1.0, CD, -620, 600)
        : animate(T, CD, CD + 1.1, 600, 730, MOTION.enter);
  const trailW = Math.max(0, px + ENG_X - TRAIL_L);

  // Textured disc/trails crossfade to the flat logo versions (55–90% of the zoom).
  const flatMix = clamp((e - 0.55) / 0.35);
  // The dark field crossfades to the page background so the hand-off is seamless.
  const fieldMix = clamp((e - 0.3) / 0.55);

  // Home scene: the landed logo pings while the overlay fades to reveal Home.
  const pingP = animate(T, HM + 0.05, HM + 1.3, 0, 1, MOTION.ping);
  const pingOn = T >= HM + 0.05 && T < HM + 1.3;
  const reveal = animate(T, HM, HM + 0.6, 1, 0, MOTION.enter);

  return {
    cx,
    cy,
    scale,
    glow: glowIn * glowOut,
    discOpacity: rise * (1 - flatMix),
    brightness,
    rotation: T * 0.5,
    px,
    trailW,
    flatMix,
    fieldOpacity: 1 - fieldMix,
    pingOpacity: pingOn ? (1 - pingP) * 0.75 : 0,
    pingScale: 1 + 0.75 * pingP,
    reveal,
    /** Skip control: shown during the first two scenes. */
    skipOpacity: T < 0.4 ? interpolate(T, 0, 0.4, 0, 1) : 1 - clamp((T - g0) / 0.3),
    interactive: T < HM,
  };
}
