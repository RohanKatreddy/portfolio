import Link from "next/link";
import styles from "./Chrome.module.css";

// 737 silhouette, drawn in a 200×200 box heading right. Shared with the intro.
export const PLANE_PATH =
  "M40 91.5 L178 91.5 C189 91.5 197 95 198.5 100 C197 105 189 108.5 178 108.5 L40 108.5 C25 108 12 104 4 101 L4 99 C12 96 25 92 40 91.5 Z M122 92 L82 12 L76 12.5 L89 70.5 L86 92 Z M122 108 L82 188 L76 187.5 L89 129.5 L86 108 Z M82 12 L78 6 L75 6.5 L76 12.5 Z M82 188 L78 194 L75 193.5 L76 187.5 Z M36 92 L21 65 L14 65.5 L13 92 Z M36 108 L21 135 L14 134.5 L13 108 Z";

/** Lunar maria, emblem units: [cx, cy, rx, ry]. Shared with the intro. */
export const MARIA: ReadonlyArray<readonly [number, number, number, number]> = [
  [330, 470, 130, 190],
  [420, 330, 120, 85],
  [590, 330, 70, 65],
  [640, 450, 85, 70],
  [780, 380, 45, 38],
  [720, 540, 55, 70],
  [430, 620, 75, 55],
  [330, 640, 40, 38],
];

function Plane({ fill }: { fill: string }) {
  return (
    <g transform="translate(640 470) scale(0.9)" fill={fill}>
      <path d={PLANE_PATH} />
      <rect x="104" y="71" width="24" height="10" rx="5" />
      <rect x="104" y="119" width="24" height="10" rx="5" />
    </g>
  );
}

function Trails({ fill }: { fill: string }) {
  return (
    <>
      <polygon points="-340,524.4 733.6,528.3 733.6,548.5 -340,552.4" fill={fill} />
      <polygon points="-340,567.6 733.6,571.5 733.6,591.7 -340,595.6" fill={fill} />
    </>
  );
}

/** Light mode: neutral white sun with a white rim and hairline. */
export function SunLogo({ id = "logo" }: { id?: string }) {
  return (
    <svg
      viewBox="70 70 860 860"
      width="100%"
      height="100%"
      className={styles.logoSun}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <radialGradient id={`${id}-sun`} cx="500" cy="500" r="420" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#fdfdfe" />
          <stop offset="0.6" stopColor="#eef0f2" />
          <stop offset="0.88" stopColor="#e0e3e7" />
          <stop offset="1" stopColor="#c9cdd3" />
        </radialGradient>
        <linearGradient id={`${id}-sun-trail`} x1="733.6" y1="0" x2="583.6" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#2a2d33" stopOpacity="0" />
          <stop offset="0.16" stopColor="#2a2d33" stopOpacity="0.25" />
          <stop offset="1" stopColor="#2a2d33" stopOpacity="1" />
        </linearGradient>
        <clipPath id={`${id}-sun-disc`}>
          <circle cx="500" cy="500" r="420" />
        </clipPath>
      </defs>
      <circle cx="500" cy="500" r="420" fill={`url(#${id}-sun)`} />
      <g clipPath={`url(#${id}-sun-disc)`}>
        <g transform="rotate(-4 500 500)">
          <Trails fill={`url(#${id}-sun-trail)`} />
          <Plane fill="#1c1e23" />
        </g>
      </g>
      <circle cx="500" cy="500" r="413" fill="none" stroke="rgba(255,255,255,0.95)" strokeWidth="12" />
      <circle cx="500" cy="500" r="420" fill="none" stroke="rgba(20,22,28,0.16)" strokeWidth="4" />
    </svg>
  );
}

/** Dark mode: the moon with blurred maria. */
export function MoonLogo({ id = "logo" }: { id?: string }) {
  return (
    <svg viewBox="80 80 840 840" width="100%" height="100%" className={styles.logoMoon} aria-hidden="true" focusable="false">
      <defs>
        <radialGradient id={`${id}-moon`} cx="500" cy="500" r="420" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#f1efe9" />
          <stop offset="0.7" stopColor="#e2dfd7" />
          <stop offset="0.93" stopColor="#cbc7be" />
          <stop offset="1" stopColor="#aeaaa1" />
        </radialGradient>
        <linearGradient id={`${id}-moon-trail`} x1="733.6" y1="0" x2="583.6" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#1b1d22" stopOpacity="0" />
          <stop offset="0.16" stopColor="#1b1d22" stopOpacity="0.25" />
          <stop offset="1" stopColor="#1b1d22" stopOpacity="1" />
        </linearGradient>
        <clipPath id={`${id}-moon-disc`}>
          <circle cx="500" cy="500" r="420" />
        </clipPath>
        <filter id={`${id}-moon-blur`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="14" />
        </filter>
      </defs>
      <circle cx="500" cy="500" r="420" fill={`url(#${id}-moon)`} />
      <g clipPath={`url(#${id}-moon-disc)`}>
        <g fill="#8a867f" opacity="0.5" filter={`url(#${id}-moon-blur)`}>
          {MARIA.map(([cx, cy, rx, ry], i) => (
            <ellipse key={i} cx={cx} cy={cy} rx={rx} ry={ry} />
          ))}
        </g>
        <g transform="rotate(-4 500 500)">
          <Trails fill={`url(#${id}-moon-trail)`} />
          <Plane fill="#0c0d10" />
        </g>
      </g>
    </svg>
  );
}

/** Top-left logo on every page; links Home. Both variants render, CSS shows one. */
export default function Logo() {
  return (
    <Link href="/" aria-label="Home" className={styles.logo} data-logo="">
      <span className="only-light">
        <SunLogo />
      </span>
      <span className="only-dark">
        <MoonLogo />
      </span>
    </Link>
  );
}
