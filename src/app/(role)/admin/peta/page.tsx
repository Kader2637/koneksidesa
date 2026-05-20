"use client";

import React from "react";
import { motion } from "framer-motion";
import { Map, MapPin, Eye, Settings } from "lucide-react";
import { useAdmin } from "../layout";

export default function PetaPage() {
  const { petaSettings, setPetaSettings } = useAdmin();

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div>
        <h1 className="text-3xl font-heading font-black tracking-tight text-white mb-2">Pengaturan Peta Wilayah</h1>
        <p className="text-slate-400 text-sm font-semibold">Atur radius jangkauan peta dan sebaran titik koordinat UMKM di peta geospasial desa.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Controls Panel */}
        <div className="bg-slate-950 p-6 rounded-[2.5rem] border border-slate-800 space-y-6 h-fit">
          <h3 className="font-heading font-black text-sm uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <Settings className="w-4 h-4" /> Pengaturan Overlay
          </h3>
          
          <div className="space-y-4 text-xs font-bold">
            <div className="flex justify-between items-center bg-slate-900 p-4 rounded-xl border border-slate-800">
              <div>
                <h4 className="text-white">Pin Mitra UMKM</h4>
                <p className="text-[10px] text-slate-500 font-bold mt-0.5">Tampilkan lokasi fisik toko UMKM.</p>
              </div>
              <button
                onClick={() => setPetaSettings((prev) => ({ ...prev, showUmkm: !prev.showUmkm }))}
                className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase transition ${
                  petaSettings.showUmkm ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-slate-800 text-slate-500 border border-transparent"
                }`}
              >
                {petaSettings.showUmkm ? "Aktif" : "Nonaktif"}
              </button>
            </div>

            <div className="flex justify-between items-center bg-slate-900 p-4 rounded-xl border border-slate-800">
              <div>
                <h4 className="text-white">Fasilitas Desa</h4>
                <p className="text-[10px] text-slate-500 font-bold mt-0.5">Kantor desa, lumbung, BUMDes, dll.</p>
              </div>
              <button
                onClick={() => setPetaSettings((prev) => ({ ...prev, showFasilitas: !prev.showFasilitas }))}
                className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase transition ${
                  petaSettings.showFasilitas ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-slate-800 text-slate-500 border border-transparent"
                }`}
              >
                {petaSettings.showFasilitas ? "Aktif" : "Nonaktif"}
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-slate-400 flex justify-between">
                <span>Radius Tampilan Wilayah</span>
                <span className="text-blue-400">{petaSettings.radius} Km</span>
              </label>
              <input
                type="range"
                min="1"
                max="20"
                value={petaSettings.radius}
                onChange={(e) => setPetaSettings((prev) => ({ ...prev, radius: parseInt(e.target.value) }))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Map Visualization Preview */}
        <div className="lg:col-span-2 bg-slate-950 p-6 rounded-[2.5rem] border border-slate-800 flex flex-col justify-between relative min-h-[400px] overflow-hidden">
          
          {/* Glassmorphic Simulated Grid Map */}
          <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-40" />

          <div className="relative z-10 flex justify-between items-start">
            <div className="bg-slate-900/80 px-4 py-2 rounded-xl border border-slate-800 text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5 backdrop-blur-sm">
              <Eye className="w-3.5 h-3.5" /> Peta Satelit Desa (Simulasi)
            </div>
          </div>

          {/* Map pins positioning */}
          <div className="relative flex-grow flex items-center justify-center">
            
            {/* Center Office point */}
            <div className="relative flex flex-col items-center">
              <div className="bg-blue-600 p-3 rounded-full text-white shadow-lg animate-pulse border border-blue-400 z-10">
                <Map className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-black bg-slate-900/90 px-2 py-0.5 rounded border border-slate-800 mt-1 uppercase tracking-wider backdrop-blur-sm">Pusat Desa</span>
            </div>

            {/* UMKM Pin 1 */}
            {petaSettings.showUmkm && (
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-1/4 left-1/3 flex flex-col items-center cursor-pointer"
              >
                <div className="bg-emerald-600 p-2 rounded-xl text-white shadow-lg border border-emerald-400">
                  <MapPin className="w-4 h-4" />
                </div>
                <span className="text-[9px] font-bold bg-slate-900/95 px-1.5 py-0.5 rounded border border-slate-800 mt-1 backdrop-blur-sm">Kopi Rejo</span>
              </motion.div>
            )}

            {/* UMKM Pin 2 */}
            {petaSettings.showUmkm && (
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute bottom-1/4 right-1/4 flex flex-col items-center cursor-pointer"
              >
                <div className="bg-emerald-600 p-2 rounded-xl text-white shadow-lg border border-emerald-400">
                  <MapPin className="w-4 h-4" />
                </div>
                <span className="text-[9px] font-bold bg-slate-900/95 px-1.5 py-0.5 rounded border border-slate-800 mt-1 backdrop-blur-sm">Anyam Pandan</span>
              </motion.div>
            )}

            {/* Facility Pin */}
            {petaSettings.showFasilitas && (
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-1/3 right-1/3 flex flex-col items-center cursor-pointer"
              >
                <div className="bg-blue-800 p-2 rounded-xl text-blue-300 shadow-lg border border-blue-600">
                  <Map className="w-4 h-4" />
                </div>
                <span className="text-[9px] font-bold bg-slate-900/95 px-1.5 py-0.5 rounded border border-slate-800 mt-1 backdrop-blur-sm">BUMDesa</span>
              </motion.div>
            )}

          </div>

          <div className="relative z-10 text-[10px] text-slate-500 font-bold bg-slate-900/30 p-4 rounded-2xl border border-slate-800/40 text-center">
            Peta terintegrasi langsung dengan Leaflet/Mapbox API saat mode produksi diaktifkan.
          </div>

        </div>

      </div>
    </motion.div>
  );
}
