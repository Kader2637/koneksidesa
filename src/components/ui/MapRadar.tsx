"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Navigation, TrendingUp, ShieldCheck, ArrowRight } from "lucide-react";

interface Hotspot {
  id: number;
  name: string;
  desa: string;
  product: string;
  coords: { x: string; y: string };
  shippingTo: { x: string; y: string };
  skor: string;
  status: string;
}

export default function MapRadar() {
  const [activeHotspot, setActiveHotspot] = useState<Hotspot | null>(null);

  const hotspots: Hotspot[] = [
    {
      id: 1,
      name: "Kelompok Tani Padi Biru Bersama",
      desa: "Desa Agro Rejo, Pekalongan",
      product: "Roast Beans Robusta",
      coords: { x: "25%", y: "42%" },
      shippingTo: { x: "12%", y: "22%" },
      skor: "A+",
      status: "Pengiriman Aktif",
    },
    {
      id: 2,
      name: "Koperasi Kriya Alam Nusantara",
      desa: "Desa Karya Maju, Magelang",
      product: "Tas Anyam Pandan Liar",
      coords: { x: "46%", y: "62%" },
      shippingTo: { x: "12%", y: "22%" },
      skor: "B+",
      status: "Proses Packing",
    },
    {
      id: 3,
      name: "Sentra Keramik Klasik",
      desa: "Desa Sentra Kriya, Malang",
      coords: { x: "78%", y: "72%" },
      product: "Keramik Pola Klasik",
      shippingTo: { x: "12%", y: "22%" },
      skor: "A",
      status: "Siap Dikirim",
    },
    {
      id: 4,
      name: "Madu Fajar Lestari",
      desa: "Desa Tani Sari, Kudus",
      coords: { x: "56%", y: "30%" },
      product: "Madu Fajar Asli Hutan",
      shippingTo: { x: "12%", y: "22%" },
      skor: "A+",
      status: "Pengiriman Aktif",
    },
  ];

  return (
    <div className="relative w-full h-[500px] bg-slate-950 dark:bg-zinc-950 rounded-[2.5rem] overflow-hidden border border-slate-800 shadow-2xl flex flex-col items-center justify-center p-4">
      {/* Dynamic Grid Background with Glowing Laser effect */}
      <div className="absolute inset-0 grid-bg-dark opacity-40 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/90 to-transparent pointer-events-none" />

      {/* Decorative Radar Sweep Light */}
      <motion.div
        animate={{
          rotate: 360,
        }}
        transition={{
          repeat: Infinity,
          duration: 10,
          ease: "linear",
        }}
        className="absolute w-[800px] h-[800px] bg-gradient-to-tr from-emerald-500/5 via-transparent to-transparent rounded-full origin-center pointer-events-none"
        style={{ top: "calc(50% - 400px)", left: "calc(50% - 400px)" }}
      />

      {/* Grid Coordinates Label Overlay */}
      <div className="absolute top-6 left-8 font-mono text-[9px] text-slate-500 tracking-widest hidden md:block">
        RADAR MONITOR: SYSTEM_ONLINE // REGION_JAVA_DENSE_1
      </div>

      {/* Map Content SVG Frame */}
      <div className="relative w-full max-w-4xl h-full flex items-center justify-center">
        
        {/* Animated Shipping Route Lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
          <defs>
            <linearGradient id="routeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.2" />
            </linearGradient>
          </defs>

          {hotspots.map((spot) => {
            const isActive = activeHotspot?.id === spot.id;
            return (
              <g key={`route-${spot.id}`}>
                {/* Connection Line */}
                <motion.line
                  x1={spot.coords.x}
                  y1={spot.coords.y}
                  x2={spot.shippingTo.x}
                  y2={spot.shippingTo.y}
                  stroke="url(#routeGrad)"
                  strokeWidth={isActive ? "2" : "1"}
                  strokeDasharray="6,4"
                  initial={{ strokeDashoffset: 0 }}
                  animate={{ strokeDashoffset: -20 }}
                  transition={{
                    repeat: Infinity,
                    duration: isActive ? 1 : 2,
                    ease: "linear",
                  }}
                  className="transition-all duration-300"
                />

                {/* Pulsing signal flowing along path */}
                <motion.circle
                  r="3.5"
                  fill="#10b981"
                  initial={{ offset: 0 }}
                  animate={{
                    cx: [spot.coords.x, spot.shippingTo.x],
                    cy: [spot.coords.y, spot.shippingTo.y],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 3,
                    ease: "easeInOut",
                    delay: spot.id * 0.4,
                  }}
                  style={{ filter: "drop-shadow(0px 0px 4px #10b981)" }}
                />
              </g>
            );
          })}
        </svg>

        {/* Central Hub Marker (Hub Distribusi Utama) */}
        <div
          className="absolute z-20"
          style={{ left: "12%", top: "22%", transform: "translate(-50%, -50%)" }}
        >
          <div className="relative flex items-center justify-center">
            <span className="absolute w-12 h-12 rounded-full bg-blue-500/20 animate-ping opacity-75" />
            <div className="relative w-7 h-7 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl border border-white/20 shadow-lg flex items-center justify-center text-white">
              <Navigation className="w-3.5 h-3.5 rotate-45" />
            </div>
            <div className="absolute top-8 bg-slate-900/90 border border-slate-800 text-[9px] font-bold text-white px-2 py-0.5 rounded-md whitespace-nowrap shadow-md">
              Hub Distribusi Utama
            </div>
          </div>
        </div>

        {/* Dynamic Interactive Hotspots (Pings) */}
        {hotspots.map((spot) => {
          const isActive = activeHotspot?.id === spot.id;
          return (
            <div
              key={spot.id}
              className="absolute z-20"
              style={{
                left: spot.coords.x,
                top: spot.coords.y,
                transform: "translate(-50%, -50%)",
              }}
              onMouseEnter={() => setActiveHotspot(spot)}
              onMouseLeave={() => setActiveHotspot(null)}
              onClick={() => setActiveHotspot(isActive ? null : spot)}
            >
              <div className="relative flex items-center justify-center cursor-pointer group">
                {/* Ping rings */}
                <span className={`absolute w-10 h-10 rounded-full transition-all duration-300 animate-ping opacity-60 ${
                  isActive ? "bg-emerald-400" : "bg-emerald-500/30 group-hover:bg-emerald-400/40"
                }`} />
                <div className={`relative w-4 h-4 rounded-full border-2 border-slate-950 shadow-xl transition-all duration-300 ${
                  isActive ? "bg-emerald-400 scale-125" : "bg-emerald-500 group-hover:bg-emerald-400"
                }`} />
              </div>
            </div>
          );
        })}

        {/* Stylized Floating Information Card Overlay */}
        <div className="absolute right-6 bottom-6 w-full max-w-sm z-30">
          <AnimatePresence mode="wait">
            {activeHotspot ? (
              <motion.div
                key={`card-${activeHotspot.id}`}
                initial={{ opacity: 0, y: 15, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 15, scale: 0.98 }}
                transition={{ type: "spring", duration: 0.4 }}
                className="glass-card-dark p-6 rounded-[2rem] border border-slate-800 shadow-2xl relative overflow-hidden w-full backdrop-blur-xl bg-slate-900/90 text-white"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-emerald-500/10 to-transparent pointer-events-none" />
                
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="space-y-1">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 rounded-full text-[9px] font-bold uppercase tracking-wider">
                      Live Hotspot
                    </span>
                    <h4 className="font-heading font-extrabold text-lg tracking-tight leading-tight">
                      {activeHotspot.name}
                    </h4>
                  </div>
                  <div className="bg-emerald-500 text-slate-950 font-black rounded-lg w-10 h-10 flex items-center justify-center shadow-lg shadow-emerald-500/15 text-sm">
                    {activeHotspot.skor}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 border-t border-slate-800/80 pt-4 mb-4 text-xs">
                  <div>
                    <span className="text-slate-500 block mb-0.5 font-bold uppercase tracking-wider text-[9px]">Wilayah Desa</span>
                    <span className="font-semibold text-slate-200">{activeHotspot.desa}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block mb-0.5 font-bold uppercase tracking-wider text-[9px]">Produk Utama</span>
                    <span className="font-semibold text-slate-200">{activeHotspot.product}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between bg-black/35 rounded-xl px-4 py-2 text-xs border border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-slate-400 font-bold uppercase tracking-wider text-[8px]">Status</span>
                  </div>
                  <span className="font-bold text-emerald-400">{activeHotspot.status}</span>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="default-card"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 15 }}
                className="glass-card-dark p-6 rounded-[2rem] border border-slate-800/50 shadow-xl w-full backdrop-blur-xl bg-slate-900/40 text-slate-400 text-xs text-center border-dashed flex flex-col items-center justify-center min-h-[160px]"
              >
                <MapPin className="w-7 h-7 text-slate-600 mb-3 animate-bounce" />
                <p className="font-bold text-slate-300">Radar Kepadatan Komoditas Aktif</p>
                <p className="mt-1 text-slate-500 max-w-[200px]">Arahkan kursor atau sentuh salah satu titik hijau berkilau untuk memantau detail UMKM secara langsung.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
