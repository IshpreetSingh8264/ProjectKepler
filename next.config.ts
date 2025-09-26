import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingRoot: require('path').resolve(__dirname),
};

export default nextConfig;
