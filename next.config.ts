import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  reactStrictMode: false,
  basePath: process.env.NODE_ENV === 'production' ? '/activity-platform-new' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/activity-platform-new/' : '',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;