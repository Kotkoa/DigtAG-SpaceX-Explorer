import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { Geist } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SpaceX Explorer",
  description: "Explore SpaceX launches, rockets, and launchpads",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-dvh flex flex-col bg-white text-gray-900">
        <Providers>
          <header className="border-b border-gray-200 bg-white sticky top-0 z-10">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="text-2xl" aria-hidden="true">🚀</span>
                <Link
                  href="/"
                  className="text-xl font-semibold tracking-tight hover:text-blue-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
                >
                  SpaceX Explorer
                </Link>
              </div>
              <nav aria-label="Main navigation">
                <Link
                  href="/favorites"
                  className="text-sm font-medium text-gray-600 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded px-2 py-1 transition-colors"
                >
                  ★ Favorites
                </Link>
              </nav>
            </div>
          </header>
          <main className="flex-1 flex flex-col min-h-0 max-w-6xl mx-auto w-full px-4 sm:px-6 py-8">
            {children}
          </main>
          <footer className="border-t border-gray-200 py-6 text-center text-sm text-gray-500">
            Data provided by{" "}
            <a
              href="https://github.com/r-spacex/SpaceX-API"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-gray-700"
            >
              SpaceX API
            </a>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
