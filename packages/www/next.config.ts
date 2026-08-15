import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.join(__dirname, "../.."),
  },
  allowedDevOrigins: ["overbook.test", "*.overbook.test", "localhost"],
  experimental: {
    turbopackFileSystemCacheForDev: true,
  },
};

export default nextConfig;
