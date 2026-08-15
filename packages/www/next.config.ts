import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  turbopack: {
    // Stops Turbopack walking up to ~/Documents/Programming/yarn.lock
    root: path.resolve(__dirname, "../.."),
  },
  allowedDevOrigins: ["overbook.test", "*.overbook.test", "localhost"],
};

export default nextConfig;
