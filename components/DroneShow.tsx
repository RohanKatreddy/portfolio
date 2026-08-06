"use client";

import { useEffect, useRef } from "react";

// ---------------------------------------------------------------
// Drone swarm light show.
// Timeline: drones sit gridded on the ground at dusk → staggered
// takeoff while the sky fades to black → loose hover cloud → then
// loop through formations (name, airframe, quadcopter).
// Rendering: canvas 2D, additive blending, motion trails via
// low-alpha background repaint.
// ---------------------------------------------------------------

type RGB = [number, number, number];

type Drone = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  tx: number;
  ty: number;
  gx: number; // assigned ground slot
  gy: number;
  sx: number; // assigned hover slot (same x, stacked altitude band)
  sy: number;
  row: number; // ground grid row
  delay: number; // takeoff stagger (s)
  depth: number; // perspective scale of this drone's grid slot (far → small)
  s: number; // current render scale, eases between depth and 1
  color: RGB;
  want: RGB;
  phase: number; // personal rng phase for wander/flicker
};

type Formation = {
  label: string;
  color: RGB;
  draw: (ctx: CanvasRenderingContext2D, w: number, h: number) => void;
};

const GROUND_END = 2.2;
const TAKEOFF_DUR = 3.0;
const HOLD_DUR = 0.8; // brief beat with the tilted plane aloft, then formations
const PERSP = 1.7; // perspective strength of the tilted ground plane
const FORMATION_DUR = 7.0;

const DUSK_TOP: RGB = [14, 20, 48];
const DUSK_MID: RGB = [42, 26, 63];
const DUSK_LOW: RGB = [96, 52, 70];
const NIGHT: RGB = [1, 2, 6];

const HOVER_COLOR: RGB = [150, 175, 235];
const GROUND_COLOR: RGB = [255, 190, 120];

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function mixRGB(a: RGB, b: RGB, t: number): RGB {
  return [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];
}

// --- formation shape painters (drawn to an offscreen buffer, then
// sampled into per-drone target points) ---

function drawName(ctx: CanvasRenderingContext2D, w: number, h: number) {
  // Light weight ≈ monoline glyphs — thick fonts turn to blobs when
  // rendered as ~300 dots.
  const family = "'Helvetica Neue', 'Segoe UI', Arial, sans-serif";
  const lines = ["ROHAN", "KATREDDY"];
  let size = h * 0.3;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  for (const line of lines) {
    ctx.font = `200 ${size}px ${family}`;
    ctx.letterSpacing = `${size * 0.08}px`;
    const m = ctx.measureText(line).width;
    if (m > w * 0.88) size *= (w * 0.88) / m;
  }
  ctx.font = `200 ${size}px ${family}`;
  ctx.letterSpacing = `${size * 0.08}px`;
  ctx.fillText(lines[0], w / 2, h * 0.42 - size * 0.62);
  ctx.fillText(lines[1], w / 2, h * 0.42 + size * 0.62);
}

function drawPlane(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const s = Math.min(w, h) * 0.4;
  const cx = w / 2;
  const cy = h * 0.44;
  ctx.lineWidth = Math.max(2.5, s * 0.045);
  const P = (pts: [number, number][]) => {
    ctx.beginPath();
    ctx.moveTo(cx + pts[0][0] * s, cy + pts[0][1] * s);
    for (let i = 1; i < pts.length; i++)
      ctx.lineTo(cx + pts[i][0] * s, cy + pts[i][1] * s);
    ctx.closePath();
    ctx.stroke();
  };
  // fuselage (nose up)
  ctx.beginPath();
  ctx.ellipse(cx, cy, s * 0.09, s * 0.85, 0, 0, Math.PI * 2);
  ctx.stroke();
  // swept main wings
  P([
    [-0.95, 0.3],
    [0, -0.08],
    [0.95, 0.3],
    [0.95, 0.44],
    [0, 0.1],
    [-0.95, 0.44],
  ]);
  // tail plane
  P([
    [-0.34, 0.82],
    [0, 0.62],
    [0.34, 0.82],
    [0.34, 0.92],
    [0, 0.76],
    [-0.34, 0.92],
  ]);
}

function drawQuad(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const s = Math.min(w, h) * 0.33;
  const cx = w / 2;
  const cy = h * 0.44;
  // center body
  ctx.lineWidth = Math.max(2.5, s * 0.05);
  ctx.beginPath();
  ctx.arc(cx, cy, s * 0.17, 0, Math.PI * 2);
  ctx.stroke();
  for (const [dx, dy] of [
    [-1, -1],
    [1, -1],
    [-1, 1],
    [1, 1],
  ]) {
    const mx = cx + dx * s * 0.62;
    const my = cy + dy * s * 0.62;
    // arm
    ctx.beginPath();
    ctx.moveTo(cx + dx * s * 0.12, cy + dy * s * 0.12);
    ctx.lineTo(mx, my);
    ctx.stroke();
    // motor pod
    ctx.beginPath();
    ctx.arc(mx, my, s * 0.09, 0, Math.PI * 2);
    ctx.fill();
    // prop ring
    ctx.lineWidth = s * 0.055;
    ctx.beginPath();
    ctx.arc(mx, my, s * 0.34, 0, Math.PI * 2);
    ctx.stroke();
    ctx.lineWidth = Math.max(2.5, s * 0.05);
  }
}

const SOCIALS = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/rohankatreddy/",
    icon: "M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.55V9h3.57v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.55C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.72C24 .77 23.2 0 22.22 0z",
  },
  {
    label: "Twitter / X",
    href: "https://x.com/rohan_katreddy",
    icon: "M18.24 2.25h3.31l-7.23 8.26 8.5 11.24h-6.66l-5.21-6.82-5.97 6.82H1.67l7.73-8.84L1.25 2.25h6.83l4.71 6.23 5.45-6.23zm-1.16 17.52h1.83L7.08 4.13H5.12l11.96 15.64z",
  },
  {
    label: "Email",
    href: "mailto:rohan.katreddy@gmail.com",
    icon: "M24 5.46v13.09c0 .9-.73 1.64-1.64 1.64h-3.81V12.1l-6.55 4.91-6.55-4.91v8.09H1.64c-.9 0-1.64-.73-1.64-1.64V5.46c0-.98.8-1.64 1.64-1.64h.54L12 10.09l9.82-6.27h.54c.9 0 1.64.73 1.64 1.64z",
  },
];

const FORMATIONS: Formation[] = [
  { label: "CALLSIGN", color: [255, 208, 130], draw: drawName },
  { label: "AIRFRAME", color: [110, 216, 255], draw: drawPlane },
  { label: "QUADCOPTER", color: [255, 110, 72], draw: drawQuad },
];

// Sample opaque pixels of a painted shape into ~count target points.
function sampleTargets(
  w: number,
  h: number,
  count: number,
  painter: Formation["draw"]
): [number, number][] {
  const off = document.createElement("canvas");
  off.width = Math.max(2, Math.floor(w));
  off.height = Math.max(2, Math.floor(h));
  const ctx = off.getContext("2d", { willReadFrequently: true })!;
  ctx.fillStyle = "#fff";
  ctx.strokeStyle = "#fff";
  painter(ctx, off.width, off.height);
  const data = ctx.getImageData(0, 0, off.width, off.height).data;

  const step = 2;
  const raw: [number, number][] = [];
  for (let y = 0; y < off.height; y += step) {
    for (let x = 0; x < off.width; x += step) {
      if (data[(y * off.width + x) * 4 + 3] > 128) raw.push([x, y]);
    }
  }
  if (raw.length === 0) return raw;

  // Uniform coverage: bucket shape pixels into cells of ~one drone each
  // and put the drone at the cell's centroid. On thin strokes the
  // centroid sits on the centerline — crisp monoline glyphs instead of
  // the ragged gaps stride-sampling leaves.
  const area = raw.length * step * step;
  const cell = Math.max(2, Math.sqrt(area / count));
  const buckets = new Map<string, [number, number, number]>();
  for (const [x, y] of raw) {
    const k = `${Math.floor(x / cell)}_${Math.floor(y / cell)}`;
    const b = buckets.get(k);
    if (b) {
      b[0] += x;
      b[1] += y;
      b[2]++;
    } else {
      buckets.set(k, [x, y, 1]);
    }
  }
  let pts: [number, number][] = [...buckets.values()].map((b) => [
    b[0] / b[2],
    b[1] / b[2],
  ]);
  if (pts.length > count) {
    const out: [number, number][] = [];
    for (let i = 0; i < count; i++)
      out.push(pts[Math.floor((i * pts.length) / count)]);
    pts = out;
  } else {
    const orig = pts.length;
    for (let i = 0; pts.length < count; i++) {
      const [x, y] = pts[i % orig];
      pts.push([x + (Math.random() - 0.5) * 3, y + (Math.random() - 0.5) * 3]);
    }
  }
  // left-to-right sweep assignment
  pts.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  return pts;
}

export default function DroneShow() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    let raf = 0;
    let disposed = false;

    let W = 0;
    let H = 0;
    let dpr = 1;
    let drones: Drone[] = [];
    let stars: [number, number, number][] = [];
    let T = 0; // show clock — only advances while rendering
    let last = performance.now();
    let currentFormation = -1;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // pointer evasion — airborne drones dodge the cursor
    const EVADE_R = 130;
    const mouse = { x: -9999, y: -9999, on: false };
    const onPointerMove = (e: PointerEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.on = true;
    };
    const onPointerGone = () => {
      mouse.on = false;
    };
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerdown", onPointerMove);
    document.documentElement.addEventListener("pointerleave", onPointerGone);
    window.addEventListener("blur", onPointerGone);

    let gridRows = 1;
    let gridCols = 1;

    function buildGround() {
      // grid laid out as a plane receding toward the horizon: far rows
      // converge to the center and shrink, near rows spread wide — a
      // trapezoid on screen, not a rectangle facing the viewer
      const cols = gridCols;
      const smin = 1 / (1 + PERSP);
      const farY = H * 0.68;
      const nearY = H * 0.955;
      drones.forEach((d, i) => {
        const c = i % cols;
        const r = Math.floor(i / cols);
        d.row = r;
        const u = cols === 1 ? 0 : (c / (cols - 1)) * 2 - 1; // -1..1 across
        const z = gridRows === 1 ? 0 : 1 - r / (gridRows - 1); // row 0 = far
        const sc = 1 / (1 + PERSP * z);
        d.depth = sc;
        const norm = (sc - smin) / (1 - smin);
        d.gx = W / 2 + u * W * 0.46 * sc + (Math.random() - 0.5) * 3 * sc;
        d.gy = farY + (nearY - farY) * norm + (Math.random() - 0.5) * 2;
        // the whole plane lifts off together
        d.delay = Math.random() * 0.15;
      });
    }

    function buildScatter() {
      // the plane rises as one piece and hovers mid-sky, still tilted
      for (const d of drones) {
        d.sx = d.gx + (Math.random() - 0.5) * 3;
        d.sy = d.gy - H * 0.52 + (Math.random() - 0.5) * 3;
      }
    }

    function buildStars() {
      stars = Array.from({ length: 110 }, () => [
        Math.random() * W,
        Math.random() * H * 0.75,
        0.04 + Math.random() * 0.16,
      ]);
    }

    function applyFormation(idx: number) {
      const f = FORMATIONS[idx % FORMATIONS.length];
      const targets = sampleTargets(W, H, drones.length, f.draw);
      if (targets.length === 0) return;
      const order = drones
        .map((d, i) => ({ i, key: d.x + d.y * 0.25 }))
        .sort((a, b) => a.key - b.key);
      order.forEach(({ i }, rank) => {
        const [tx, ty] = targets[rank % targets.length];
        drones[i].tx = tx;
        drones[i].ty = ty;
        drones[i].want = f.color;
      });
    }

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = Math.floor(W * dpr);
      canvas.height = Math.floor(H * dpr);
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // exact cols×rows fleet so the ground grid has no partial row
      const target = Math.max(240, Math.min(540, Math.floor((W * H) / 2000)));
      gridCols = Math.ceil(Math.sqrt(target * 2.6));
      gridRows = Math.ceil(target / gridCols);
      const n = gridCols * gridRows;
      if (drones.length !== n) {
        drones = Array.from({ length: n }, () => ({
          x: 0, y: 0, vx: 0, vy: 0, tx: 0, ty: 0,
          gx: 0, gy: 0, sx: 0, sy: 0, row: 0, delay: 0,
          depth: 1, s: 1,
          color: [...GROUND_COLOR] as RGB,
          want: [...GROUND_COLOR] as RGB,
          phase: Math.random() * Math.PI * 2,
        }));
        buildGround();
        drones.forEach((d) => {
          d.x = d.gx;
          d.y = d.gy;
          d.s = d.depth;
        });
      } else {
        buildGround();
      }
      buildScatter();
      buildStars();
      if (currentFormation >= 0) applyFormation(currentFormation);
      // full repaint after resize
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, W, H);
      if (reduced && T < GROUND_END + TAKEOFF_DUR + HOLD_DUR) {
        T = GROUND_END + TAKEOFF_DUR + HOLD_DUR; // skip straight to formations
      }
    }

    function skyFactor() {
      // 0 = dusk, 1 = full night; darkens across the takeoff
      return Math.min(1, Math.max(0, (T - GROUND_END + 0.4) / TAKEOFF_DUR));
    }

    function paintBackground(alpha: number) {
      const dk = skyFactor();
      const top = mixRGB(DUSK_TOP, NIGHT, dk);
      const mid = mixRGB(DUSK_MID, NIGHT, dk);
      const low = mixRGB(DUSK_LOW, NIGHT, dk);
      const g = ctx.createLinearGradient(0, 0, 0, H);
      g.addColorStop(0, `rgba(${top[0]},${top[1]},${top[2]},${alpha})`);
      g.addColorStop(0.62, `rgba(${mid[0]},${mid[1]},${mid[2]},${alpha})`);
      g.addColorStop(0.86, `rgba(${low[0]},${low[1]},${low[2]},${alpha})`);
      g.addColorStop(1, `rgba(2,3,8,${alpha})`);
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);
      // ground silhouette
      ctx.fillStyle = `rgba(4,6,11,${alpha})`;
      ctx.fillRect(0, H * 0.965, W, H * 0.035);
    }

    function frame(now: number) {
      if (disposed) return;
      const dt = Math.min(0.033, (now - last) / 1000);
      last = now;
      T += dt;

      // --- phase logic ---
      const showT = T - (GROUND_END + TAKEOFF_DUR + HOLD_DUR);
      let mode: "ground" | "takeoff" | "hold" | "show";
      if (T < GROUND_END) mode = "ground";
      else if (T < GROUND_END + TAKEOFF_DUR) mode = "takeoff";
      else if (showT < 0) mode = "hold";
      else mode = "show";

      if (mode === "show") {
        const idx = Math.floor(showT / FORMATION_DUR) % FORMATIONS.length;
        if (idx !== currentFormation) {
          currentFormation = idx;
          applyFormation(idx);
        }
      }

      // --- render ---
      const trailAlpha = mode === "takeoff" ? 0.14 : mode === "show" ? 0.24 : 0.3;
      paintBackground(trailAlpha);

      // stars fade in with darkness
      const dk = skyFactor();
      if (dk > 0.35) {
        ctx.fillStyle = "#c8d4ff";
        for (const [sx, sy, sa] of stars) {
          ctx.globalAlpha = sa * dk * (0.7 + 0.3 * Math.sin(T * 1.4 + sx));
          ctx.fillRect(sx, sy, 1.2, 1.2);
        }
        ctx.globalAlpha = 1;
      }

      ctx.globalCompositeOperation = "lighter";
      for (const d of drones) {
        // choose target by phase
        let airborne = mode === "show" || mode === "hold";
        if (mode === "ground") {
          d.tx = d.gx;
          d.ty = d.gy;
          d.want = GROUND_COLOR;
        } else if (mode === "takeoff" || mode === "hold") {
          const armed = T - GROUND_END > d.delay;
          d.tx = armed ? d.sx : d.gx;
          d.ty = armed ? d.sy : d.gy;
          d.want = armed ? HOVER_COLOR : GROUND_COLOR;
          airborne = armed;
        }

        // wander + spring integration
        // keep launching planes rigid; loosen slightly while holding
        const wob = mode === "show" ? 0.7 : mode === "takeoff" ? 1.1 : mode === "hold" ? 1.8 : 3;
        const wx = Math.sin(T * 0.9 + d.phase) * wob;
        const wy = Math.cos(T * 0.7 + d.phase * 1.7) * wob;
        const k = mode === "show" ? 30 : 14;
        const damp = mode === "show" ? 9.5 : 6.5;
        d.vx += ((d.tx + wx - d.x) * k - d.vx * damp) * dt;
        d.vy += ((d.ty + wy - d.y) * k - d.vy * damp) * dt;

        // dodge the cursor; spring brings them home afterwards
        if (mouse.on && airborne) {
          const mdx = d.x - mouse.x;
          const mdy = d.y - mouse.y;
          const md2 = mdx * mdx + mdy * mdy;
          if (md2 < EVADE_R * EVADE_R) {
            const md = Math.sqrt(md2) || 1;
            const f = 1 - md / EVADE_R;
            const push = 2600 * f * f;
            d.vx += (mdx / md) * push * dt;
            d.vy += (mdy / md) * push * dt;
          }
        }

        d.x += d.vx * dt;
        d.y += d.vy * dt;

        // color + scale chase (scale eases from perspective depth to
        // uniform 1 as the swarm leaves the plane for formations)
        d.color = mixRGB(d.color, d.want, Math.min(1, dt * 2.5));
        const wantS = mode === "show" ? 1 : d.depth;
        d.s += (wantS - d.s) * Math.min(1, dt * 2.5);

        // brightness: dim on the ground, flicker alive in the air
        const grounded = Math.abs(d.y - d.gy) < 4 && mode !== "show";
        const flick = 0.82 + 0.18 * Math.sin(T * 2.6 + d.phase * 3);
        const b = (grounded ? 0.38 : 1) * flick * (0.55 + 0.45 * d.s);
        const [r, g, bl] = d.color;

        ctx.fillStyle = `rgba(${r | 0},${g | 0},${bl | 0},${0.1 * b})`;
        ctx.beginPath();
        ctx.arc(d.x, d.y, 7.5 * d.s, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = `rgba(${r | 0},${g | 0},${bl | 0},${0.3 * b})`;
        ctx.beginPath();
        ctx.arc(d.x, d.y, 3 * d.s, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = `rgba(255,255,255,${0.85 * b})`;
        ctx.beginPath();
        ctx.arc(d.x, d.y, Math.max(0.6, 1.15 * d.s), 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalCompositeOperation = "source-over";
    }

    const loop = (now: number) => {
      frame(now);
      raf = requestAnimationFrame(loop);
    };

    // Dev-only: RAF stalls in hidden tabs, which would freeze the show
    // while the preview pane is closed. Drive frames on a timer instead.
    let hiddenTimer: ReturnType<typeof setInterval> | null = null;
    const isDev = location.hostname === "localhost";
    const syncDriver = () => {
      if (!isDev) return;
      if (document.hidden && hiddenTimer === null) {
        // Background tabs throttle timers to ~1Hz, so run a burst of
        // fixed 33ms substeps per tick to keep sim time ≈ real time.
        let simNow = performance.now();
        last = simNow;
        hiddenTimer = setInterval(() => {
          for (let i = 0; i < 30; i++) {
            simNow += 33.4;
            frame(simNow);
          }
        }, 1000);
      } else if (!document.hidden && hiddenTimer !== null) {
        clearInterval(hiddenTimer);
        hiddenTimer = null;
        last = performance.now();
      }
    };
    document.addEventListener("visibilitychange", syncDriver);
    if (isDev) {
      (window as unknown as Record<string, unknown>).__show = {
        jump: (t: number) => {
          T = t;
        },
        // jump to time t, then synchronously simulate `steps` frames
        settle: (t: number, steps = 150) => {
          T = t;
          let n = performance.now();
          last = n;
          for (let i = 0; i < steps; i++) {
            n += 33.4;
            frame(n);
          }
        },
      };
    }

    resize();
    window.addEventListener("resize", resize);
    last = performance.now();
    raf = requestAnimationFrame(loop);
    syncDriver();

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      if (hiddenTimer !== null) clearInterval(hiddenTimer);
      document.removeEventListener("visibilitychange", syncDriver);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onPointerMove);
      document.documentElement.removeEventListener("pointerleave", onPointerGone);
      window.removeEventListener("blur", onPointerGone);
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black">
      <canvas ref={canvasRef} className="block h-full w-full" />

      {/* social links */}
      <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-7">
        {SOCIALS.map((s) => (
          <a
            key={s.label}
            href={s.href}
            target={s.href.startsWith("http") ? "_blank" : undefined}
            rel="noreferrer"
            aria-label={s.label}
            title={s.label}
            className="text-white/40 transition-all duration-300 hover:text-white hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
              <path d={s.icon} />
            </svg>
          </a>
        ))}
      </div>
    </div>
  );
}
