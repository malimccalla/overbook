import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["overbook.test", "*.overbook.test", "localhost"],
};

export default nextConfig;
