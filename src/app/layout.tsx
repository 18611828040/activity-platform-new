import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "营销智能化平台",
  description: "营销智能化平台 - 活动数据分析与管理",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen bg-slate-100">{children}</body>
    </html>
  );
}