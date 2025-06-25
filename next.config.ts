import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: [
        "fantastic-rotary-phone-97qq9x55pj6pc75pp-3000.app.github.dev",
        "localhost:3000",
      ],
    },
  },
};

export default nextConfig;
