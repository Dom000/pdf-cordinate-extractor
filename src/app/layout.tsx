import "./globals.css";
import { Inter, Fredoka, IBM_Plex_Mono } from "next/font/google";
import type React from "react";
import Footer from "@/components/Footer";
import { Analytics } from "@vercel/analytics/next";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const fredoka = Fredoka({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-fredoka",
});
const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plex-mono",
});

export const metadata = {
  title: "X Marks the Spot — PDF Coordinate Viewer",
  description:
    "Hover, click, or drag on any PDF to get exact X/Y coordinates in points, inches, mm, or cm.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${fredoka.variable} ${plexMono.variable}`}
    >
      <body className="bg-grid bg-paper font-body text-ink">
        {children}
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
