"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Leaf, ArrowUpRight } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const accessLinks = [
    { name: "Katalog Produk UMKM", href: "/katalog" },
    { name: "Pendanaan AI Score", href: "/investasi" },
    { name: "Radar Geografis UMKM", href: "/peta" },
  ];

  const transparencyLinks = [
    { name: "Pertumbuhan Finansial", href: "/statistik" },
    { name: "Penjaminan Hukum & FAQ", href: "/faq" },
  ];

  return (
    <footer className="bg-slate-950 pt-24 pb-12 border-t border-slate-900 text-slate-400 relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-16 mb-20 relative z-10">
        <div className="col-span-1 md:col-span-2 space-y-6">
          <div className="flex items-center gap-2.5">
            <div className="relative h-14 w-56 overflow-hidden">
              <Image 
                src="/logo1.png" 
                alt="KoneksiDesa" 
                fill
                className="object-contain brightness-0 invert transition-all duration-300"
              />
            </div>
          </div>
          <p className="text-slate-400 text-sm leading-relaxed max-w-sm font-medium">
            Revolusi ekonomi sirkular modern yang memusatkan kekuatan produksi pedalaman ke tangan pemodal ritel nusantara secara cerdas, aman, dan transparan.
          </p>
        </div>

        <div>
          <h5 className="text-white font-bold mb-6 text-xs uppercase tracking-widest font-heading">
            Akses Langsung
          </h5>
          <ul className="space-y-4 text-sm font-semibold">
            {accessLinks.map((link) => (
              <li key={link.name}>
                <Link
                  href={link.href}
                  className="hover:text-white transition-colors duration-200 flex items-center gap-1 group w-fit"
                >
                  {link.name}
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h5 className="text-white font-bold mb-6 text-xs uppercase tracking-widest font-heading">
            Transparansi
          </h5>
          <ul className="space-y-4 text-sm font-semibold">
            {transparencyLinks.map((link) => (
              <li key={link.name}>
                <Link
                  href={link.href}
                  className="hover:text-white transition-colors duration-200 flex items-center gap-1 group w-fit"
                >
                  {link.name}
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-10 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-bold uppercase tracking-wider text-slate-500 relative z-10">
        <p>&copy; {currentYear} Platform Ekosistem KoneksiDesa. Hak Cipta Dilindungi.</p>
        <p className="flex items-center gap-1">
          Rancang Antarmuka: 
          <span className="text-emerald-500 hover:text-emerald-400 transition-colors font-black">
            Kharisma Khoirunisa P
          </span>
        </p>
      </div>
    </footer>
  );
}
