import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  output: "standalone",
  images: {
    unoptimized: true,
  },
  // Ensure trailing slashes for static hosting
  trailingSlash: true,
};

export default nextConfig;
