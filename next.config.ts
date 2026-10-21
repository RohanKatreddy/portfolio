import type { NextConfig } from "next";

// Static export: `npm run build` writes a plain static site to `out/`.
const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  reactStrictMode: true,
};

export default nextConfig;
