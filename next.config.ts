import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  reactStrictMode: false,
  basePath: process.env.NODE_ENV === 'production' ? '/activity-platform' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/activity-platform/' : '',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;