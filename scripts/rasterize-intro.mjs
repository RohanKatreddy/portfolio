// Rasterises the intro's procedural SVG textures (sun, moon, contrails) to
// static WebP files in public/intro, so the browser never re-runs the SVG
// filters while the intro scales them. Run with `npm run intro:raster`.
// Sources are copied from design/intro-animation.jsx; output is 2× the
// emblem units (emblem = 1000×1000, trail = 1100×48) for sharp HiDPI rendering.
import { mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import sharp from "sharp";

const OUT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "public", "intro");
const DISC_PX = 2000;
const TRAIL_PX = [2200, 96];

const SUN_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="${DISC_PX}" height="${DISC_PX}" viewBox="0 0 1000 1000">
<defs>
<radialGradient id="g" cx="500" cy="500" r="420" gradientUnits="userSpaceOnUse">
<stop offset="0" stop-color="#f8cf4e"/><stop offset="0.55" stop-color="#f3c242"/><stop offset="0.82" stop-color="#ebb036"/>
<stop offset="0.95" stop-color="#df9b2c"/><stop offset="1" stop-color="#cc8726"/>
</radialGradient>
<clipPath id="c"><circle cx="500" cy="500" r="420"/></clipPath>
<filter id="mot" filterUnits="userSpaceOnUse" x="0" y="0" width="1000" height="1000" color-interpolation-filters="sRGB">
<feTurbulence type="fractalNoise" baseFrequency="0.009" numOctaves="3" seed="5"/>
<feColorMatrix values="0 0 0 0 0.72 0 0 0 0 0.5 0 0 0 0 0.12 -2.5 0 0 0 1.3"/>
<feGaussianBlur stdDeviation="6"/>
</filter>
</defs>
<circle cx="500" cy="500" r="420" fill="url(#g)"/>
<g clip-path="url(#c)">
<rect width="1000" height="1000" filter="url(#mot)" opacity="0.14"/>
</g>
</svg>`;

const MARIA = [[330, 470, 130, 190], [420, 330, 120, 85], [590, 330, 70, 65], [640, 450, 85, 70], [780, 380, 45, 38], [720, 540, 55, 70], [430, 620, 75, 55], [330, 640, 40, 38]];
const mariaEls = MARIA.map(([x, y, rx, ry]) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}"/>`).join("");
const MOON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="${DISC_PX}" height="${DISC_PX}" viewBox="0 0 1000 1000">
<defs>
<radialGradient id="g" cx="500" cy="500" r="420" gradientUnits="userSpaceOnUse">
<stop offset="0" stop-color="#f1efe9"/><stop offset="0.7" stop-color="#e2dfd7"/><stop offset="0.93" stop-color="#cbc7be"/><stop offset="1" stop-color="#aeaaa1"/>
</radialGradient>
<clipPath id="c"><circle cx="500" cy="500" r="420"/></clipPath>
<filter id="mare" filterUnits="userSpaceOnUse" x="0" y="0" width="1000" height="1000" color-interpolation-filters="sRGB">
<feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="4" seed="2" result="n"/>
<feDisplacementMap in="SourceGraphic" in2="n" scale="90" xChannelSelector="R" yChannelSelector="G"/>
<feGaussianBlur stdDeviation="7"/>
</filter>
<filter id="mot" filterUnits="userSpaceOnUse" x="0" y="0" width="1000" height="1000" color-interpolation-filters="sRGB">
<feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="4" seed="13"/>
<feColorMatrix values="0 0 0 0 0.45 0 0 0 0 0.44 0 0 0 0 0.42 -3 0 0 0 1.5"/>
</filter>
<filter id="reg" filterUnits="userSpaceOnUse" x="0" y="0" width="1000" height="1000" color-interpolation-filters="sRGB">
<feTurbulence type="fractalNoise" baseFrequency="0.13" numOctaves="3" seed="6"/>
<feColorMatrix values="0 0 0 0 0.3 0 0 0 0 0.29 0 0 0 0 0.28 -2.4 0 0 0 1.12"/>
</filter>
<filter id="hi" filterUnits="userSpaceOnUse" x="0" y="0" width="1000" height="1000" color-interpolation-filters="sRGB">
<feTurbulence type="fractalNoise" baseFrequency="0.1" numOctaves="3" seed="17"/>
<feColorMatrix values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 2.4 0 0 0 -1.3"/>
</filter>
<radialGradient id="cr" cx="0.44" cy="0.44" r="0.6">
<stop offset="0" stop-color="#3c3a36" stop-opacity="0.22"/><stop offset="0.7" stop-color="#3c3a36" stop-opacity="0.16"/><stop offset="0.86" stop-color="#ffffff" stop-opacity="0.35"/><stop offset="1" stop-color="#ffffff" stop-opacity="0"/>
</radialGradient>
<radialGradient id="ty"><stop offset="0" stop-color="#ffffff" stop-opacity="0.95"/><stop offset="0.25" stop-color="#ffffff" stop-opacity="0.5"/><stop offset="1" stop-color="#ffffff" stop-opacity="0"/></radialGradient>
</defs>
<circle cx="500" cy="500" r="420" fill="url(#g)"/>
<g clip-path="url(#c)">
<g fill="#7f7b74" opacity="0.6" filter="url(#mare)">${mariaEls}</g>
<rect width="1000" height="1000" filter="url(#mot)" opacity="0.35"/>
<rect width="1000" height="1000" filter="url(#reg)" opacity="0.5"/>
<rect width="1000" height="1000" filter="url(#hi)" opacity="0.4"/>
<g fill="url(#cr)">
<circle cx="250" cy="300" r="34"/><circle cx="700" cy="260" r="26"/><circle cx="520" cy="520" r="20"/><circle cx="820" cy="600" r="30"/><circle cx="380" cy="780" r="28"/><circle cx="640" cy="680" r="22"/><circle cx="200" cy="560" r="18"/><circle cx="470" cy="200" r="16"/>
</g>
<circle cx="560" cy="770" r="60" fill="url(#ty)" opacity="0.7"/>
<circle cx="370" cy="420" r="32" fill="url(#ty)" opacity="0.5"/>
</g>
</svg>`;

const trailSvg = (seed, color) => `<svg xmlns="http://www.w3.org/2000/svg" width="${TRAIL_PX[0]}" height="${TRAIL_PX[1]}" viewBox="0 0 1100 48">
<defs><filter id="f" filterUnits="userSpaceOnUse" x="0" y="0" width="1100" height="48" color-interpolation-filters="sRGB">
<feTurbulence type="fractalNoise" baseFrequency="0.03 0.2" numOctaves="3" seed="${seed}" result="n"/>
<feDisplacementMap in="SourceGraphic" in2="n" scale="10" xChannelSelector="R" yChannelSelector="G" result="d"/>
<feGaussianBlur in="d" stdDeviation="1.3" result="b"/>
<feTurbulence type="fractalNoise" baseFrequency="0.012 0.25" numOctaves="2" seed="${seed + 5}" result="n2"/>
<feColorMatrix in="n2" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 2.4 0 0 0 -0.45" result="m"/>
<feComposite in="b" in2="m" operator="in"/>
</filter></defs>
<polygon points="0,9 1100,18 1100,30 0,39" fill="${color}" filter="url(#f)"/>
</svg>`;

const JOBS = [
  ["sun.webp", SUN_SVG],
  ["moon.webp", MOON_SVG],
  ["trail-sun-a.webp", trailSvg(3, "#6b4614")],
  ["trail-sun-b.webp", trailSvg(8, "#6b4614")],
  ["trail-moon-a.webp", trailSvg(3, "#1b1d22")],
  ["trail-moon-b.webp", trailSvg(8, "#1b1d22")],
];

await mkdir(OUT, { recursive: true });
for (const [name, svg] of JOBS) {
  const info = await sharp(Buffer.from(svg)).webp({ quality: 90, alphaQuality: 100 }).toFile(path.join(OUT, name));
  console.log(`${name}  ${info.width}×${info.height}  ${(info.size / 1024).toFixed(0)} KB`);
}
