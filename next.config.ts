import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  reactStrictMode: false,
  basePath: '/activity-analytics', // 和你的仓库名保持一致！
  assetPrefix: '/activity-analytics/',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;