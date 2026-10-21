"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { MARIA, PLANE_PATH } from "@/components/Logo";
import { INTRO_ASSETS } from "@/lib/site";
import { ENG_Y, FLIGHT_Y, HEADING, PLANE, TOTAL, TRAIL_H, TRAIL_L, TRAIL_W, frame, type Layout } from "./timeline";
import styles from "./Intro.module.css";

const GLOW_SUN =
  "radial-gradient(circle closest-side, rgba(240,190,70,0.28) 0%, rgba(240,190,70,0.28) 63%, rgba(220,160,50,0.1) 68%, rgba(200,140,40,0.03) 80%, rgba(200,140,40,0) 100%)";
const GLOW_MOON =
  "radial-gradient(circle closest-side, rgba(205,218,238,0.32) 0%, rgba(205,218,238,0.32) 63%, rgba(175,195,225,0.13) 68%, rgba(140,160,200,0.05) 80%, rgba(140,160,200,0) 100%)";
const FLAT_SUN = "radial-gradient(circle closest-side, #fdfdfe 0%, #eef0f2 60%, #e0e3e7 88%, #c9cdd3 100%)";
const PAL = {
  sun: { field: "#15120e", ink: "#0e0b08", trail: "#2a2d33", ping: "#9aa0a8", trailOp: 0.42 },
  moon: { field: "#07080b", ink: "#0c0d10", trail: "#1b1d22", ping: "#c9d3e0", trailOp: 0.94 },
};

/** Fallback if the textures take too long; the field just stays dark meanwhile. */
const MAX_WAIT_MS = 1200;
const SKIP_FADE_MS = 300;

type Phase = "pending" | "playing" | "leaving" | "done";

function measure(): Layout {
  const logo = document.querySelector<HTMLElement>("[data-logo]");
  const r = logo?.getBoundingClientRect();
  const d = r ? r.width : 96;
  return {
    w: window.innerWidth,
    h: window.innerHeight,
    logoCx: r ? r.left + r.width / 2 : 88,
    logoCy: r ? r.top + r.height / 2 : 88,
    logoD: d,
  };
}

/**
 * Full-viewport intro over Home: a plane crosses the sun (light) or moon
 * (dark), then everything condenses into the logo. Plays once per session on
 * landing at `/` (decided by BOOT_SCRIPT, which sets html[data-intro="play"]).
 * Skip with the button, a click anywhere, or Esc.
 */
export default function Intro() {
  const [phase, setPhase] = useState<Phase>("pending");
  const [night, setNight] = useState(false);
  const [layout, setLayout] = useState<Layout | null>(null);
  const [T, setT] = useState(0);
  const phaseRef = useRef<Phase>("pending");
  const rafRef = useRef(0);

  const go = (p: Phase) => {
    phaseRef.current = p;
    setPhase(p);
  };

  const finish = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    document.documentElement.dataset.intro = "done";
    go("done");
  }, []);

  const skip = useCallback(() => {
    if (phaseRef.current === "leaving" || phaseRef.current === "done") return;
    cancelAnimationFrame(rafRef.current);
    go("leaving");
    window.setTimeout(finish, SKIP_FADE_MS);
  }, [finish]);

  useEffect(() => {
    const root = document.documentElement;
    // Dev only: `/?introT=3.2` freezes the intro at that time, for inspecting frames.
    const frozen =
      process.env.NODE_ENV !== "production" ? new URLSearchParams(location.search).get("introT") : null;
    if (frozen !== null) {
      root.dataset.intro = "play";
      setNight(root.dataset.mode === "dark");
      setLayout(measure());
      setT(Number(frozen));
      go("playing");
      return;
    }
    if (root.dataset.intro !== "play") {
      go("done");
      return;
    }
    const isNight = root.dataset.mode === "dark";
    setNight(isNight);
    setLayout(measure());

    let cancelled = false;
    const onResize = () => setLayout(measure());
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") skip();
    };
    window.addEventListener("resize", onResize);
    window.addEventListener("keydown", onKey);

    const decode = Promise.all(
      INTRO_ASSETS[isNight ? "dark" : "light"].map((src) => {
        const img = new Image();
        img.src = src;
        return img.decode().catch(() => undefined);
      }),
    );
    const timeout = new Promise((r) => window.setTimeout(r, MAX_WAIT_MS));
    Promise.race([decode, timeout]).then(() => {
      if (cancelled || phaseRef.current !== "pending") return;
      go("playing");
      const t0 = performance.now();
      const tick = (now: number) => {
        const t = (now - t0) / 1000;
        if (t >= TOTAL) {
          finish();
          return;
        }
        setT(t);
        rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("keydown", onKey);
    };
  }, [finish, skip]);

  if (phase === "done") return null;

  const pal = night ? PAL.moon : PAL.sun;
  const f = layout && phase !== "pending" ? frame(T, layout, night) : null;
  const [disc, trailA, trailB] = INTRO_ASSETS[night ? "dark" : "light"];

  return (
    <div
      className={styles.intro}
      data-leaving={phase === "leaving" || undefined}
      style={f && !f.interactive ? { pointerEvents: "none" } : undefined}
      onClick={skip}
      aria-hidden={phase === "leaving" || undefined}
    >
      {/* The page background, revealed as the dark field fades during the zoom. */}
      <div className={styles.ground} style={f ? { opacity: f.reveal } : undefined} />
      <div
        className={styles.field}
        style={f ? { background: pal.field, opacity: f.fieldOpacity * f.reveal } : undefined}
      />

      {f && (
        <div
          className={styles.emblem}
          style={{ left: f.cx - 500, top: f.cy - 500, transform: `scale(${f.scale})` }}
        >
          <div
            className={styles.ping}
            style={{
              border: `${1.6 / f.scale}px solid ${pal.ping}`,
              opacity: f.pingOpacity,
              transform: `scale(${f.pingScale})`,
            }}
          />
          <div className={styles.layer} style={{ opacity: f.reveal }}>
            <div className={styles.glow} style={{ background: night ? GLOW_MOON : GLOW_SUN, opacity: f.glow }} />
            <img
              src={disc}
              alt=""
              className={styles.disc}
              style={{
                transform: `rotate(${f.rotation}deg)`,
                opacity: f.discOpacity,
                filter: `brightness(${f.brightness})`,
              }}
            />
            {night ? (
              <FlatMoon opacity={f.flatMix} />
            ) : (
              <div className={styles.flatSun} style={{ background: FLAT_SUN, opacity: f.flatMix }} />
            )}
            <div className={styles.layer} style={{ transform: `rotate(${HEADING}deg)` }}>
              <div className={`${styles.layer} ${styles.discMask}`} style={{ opacity: 1 - f.flatMix }}>
                <Trail src={trailA} op={pal.trailOp} y={FLIGHT_Y + ENG_Y} w={f.trailW} />
                <Trail src={trailB} op={pal.trailOp} y={FLIGHT_Y - ENG_Y} w={f.trailW} />
              </div>
              <div className={`${styles.layer} ${styles.discClip}`} style={{ opacity: f.flatMix }}>
                <Trail flat color={pal.trail} y={FLIGHT_Y + ENG_Y} w={f.trailW} />
                <Trail flat color={pal.trail} y={FLIGHT_Y - ENG_Y} w={f.trailW} />
              </div>
              <svg
                viewBox="0 0 200 200"
                width={PLANE}
                height={PLANE}
                className={styles.plane}
                style={{ left: f.px - PLANE / 2, top: FLIGHT_Y - PLANE / 2 }}
              >
                <g fill={pal.ink}>
                  <path d={PLANE_PATH} />
                  <rect x="104" y="71" width="24" height="10" rx="5" />
                  <rect x="104" y="119" width="24" height="10" rx="5" />
                </g>
              </svg>
            </div>
          </div>
        </div>
      )}

      <button
        type="button"
        className={styles.skip}
        style={f ? { opacity: f.skipOpacity, visibility: f.skipOpacity > 0 ? "visible" : "hidden" } : undefined}
        onClick={(e) => {
          e.stopPropagation();
          skip();
        }}
      >
        Skip
      </button>
    </div>
  );
}

function Trail({
  src,
  flat,
  y,
  w,
  color,
  op = 0.94,
}: {
  src?: string;
  flat?: boolean;
  y: number;
  w: number;
  color?: string;
  op?: number;
}) {
  return (
    <div className={styles.trail} style={{ left: TRAIL_L, top: y - TRAIL_H / 2, width: w, height: TRAIL_H }}>
      {flat ? (
        <div className={styles.trailFlat} style={{ width: TRAIL_W, height: TRAIL_H, background: color }} />
      ) : (
        <img
          src={src}
          alt=""
          className={styles.trailImg}
          style={{ width: TRAIL_W, height: TRAIL_H, opacity: op, filter: op < 0.9 ? "blur(3px)" : "none" }}
        />
      )}
    </div>
  );
}

function FlatMoon({ opacity }: { opacity: number }) {
  return (
    <svg viewBox="0 0 1000 1000" width="1000" height="1000" className={styles.flatMoon} style={{ opacity }}>
      <defs>
        <radialGradient id="intro-fm-g" cx="500" cy="500" r="420" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#f1efe9" />
          <stop offset="0.7" stopColor="#e2dfd7" />
          <stop offset="0.93" stopColor="#cbc7be" />
          <stop offset="1" stopColor="#aeaaa1" />
        </radialGradient>
        <clipPath id="intro-fm-c">
          <circle cx="500" cy="500" r="420" />
        </clipPath>
        <filter id="intro-fm-b" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="14" />
        </filter>
      </defs>
      <circle cx="500" cy="500" r="420" fill="url(#intro-fm-g)" />
      <g clipPath="url(#intro-fm-c)" fill="#8a867f" opacity="0.5" filter="url(#intro-fm-b)">
        {MARIA.map(([x, y, rx, ry], i) => (
          <ellipse key={i} cx={x} cy={y} rx={rx} ry={ry} />
        ))}
      </g>
    </svg>
  );
}
