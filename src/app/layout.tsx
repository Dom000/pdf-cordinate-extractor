import "./globals.css";
import { Inter } from "next/font/google";
import type React from "react";
import Footer from "@/components/Footer";
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "PDF Coordinate Viewer",
  description: "View PDF coordinates with pixel zoom effect",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Footer />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
