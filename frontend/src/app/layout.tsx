import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import InitialLoader from "@/components/layout/InitialLoader";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-heading",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Koneksi Desa - Integrasi Ekonomi Akar Rumput",
  description: "Membuka koneksi baru ekonomi sirkular modern yang menghubungkan pembeli ritel, pemodal ventura, dan pengrajin desa Nusantara.",
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="scroll-smooth">
      <body className={`${inter.variable} ${outfit.variable} font-sans antialiased text-slate-800 bg-white min-h-screen overflow-x-hidden`}>
        <InitialLoader>
          {children}
        </InitialLoader>
      </body>
    </html>
  );
}
