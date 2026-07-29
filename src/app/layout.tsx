import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "水族館グッズショップ 商品マスタ管理",
  description: "水族館グッズショップの商品マスタ管理画面",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ja"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-sky-50">
        <header className="relative bg-gradient-to-r from-sky-600 via-cyan-600 to-teal-500 pb-6">
          <div className="mx-auto max-w-5xl px-6 py-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-base font-bold tracking-wide text-white"
            >
              <span className="text-2xl">🐬</span>
              水族館グッズショップ 商品マスタ管理
            </Link>
          </div>
          <svg
            className="absolute inset-x-0 bottom-0 h-6 w-full text-sky-50"
            viewBox="0 0 1440 60"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path
              fill="currentColor"
              d="M0,32 C240,60 480,0 720,24 C960,48 1200,8 1440,32 L1440,60 L0,60 Z"
            />
          </svg>
        </header>
        <main className="mx-auto w-full max-w-5xl flex-1 p-6">{children}</main>
      </body>
    </html>
  );
}
