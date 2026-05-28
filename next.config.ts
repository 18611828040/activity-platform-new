import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  reactStrictMode: false,
  basePath: process.env.NODE_ENV === 'production' ? '/activity-analytics' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/activity-analytics/' : '',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;