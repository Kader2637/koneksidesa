"use client";

import React from "react";
import { motion } from "framer-motion";
import { LineChart, BarChart2, TrendingUp, Sparkles } from "lucide-react";
import { useAdmin } from "../layout";

export default function PantauDanaPage() {
  const { pendingCampaigns } = useAdmin();

  // Active or approved campaigns
  const activeCampaigns = [
    { id: 101, title: "Modernisasi Alat Panen Padi", umkm: "Kelompok Tani Padi Biru", target: 50000000, current: 42500000, progress: 85, roi: 15, status: "Aktif" },
    { id: 201, title: "Ekspansi Kilang Kopi Rejo", umkm: "Mitra Kopi Rejo Temanggung", target: 30000000, current: 30000000, progress: 100, roi: 14, status: "Terdanai" }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div>
        <h1 className="text-3xl font-heading font-black tracking-tight text-white mb-2">Pantauan Pendanaan Desa</h1>
        <p className="text-slate-400 text-sm font-semibold">Monitor penyaluran dana investor ke proyek-proyek produktif UMKM desa secara transparan.</p>
      </div>

      {/* Analytics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 flex items-center gap-4">
          <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-2xl border border-emerald-500/20">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] text-slate-500 uppercase tracking-widest font-black block">Total Penyaluran Dana</span>
            <span className="text-xl font-heading font-black text-white">Rp 72.500.000</span>
          </div>
        </div>

        <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 flex items-center gap-4">
          <div className="p-3 bg-blue-500/10 text-blue-400 rounded-2xl border border-blue-500/20">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] text-slate-500 uppercase tracking-widest font-black block">Rata-Rata Dividen ROI</span>
            <span className="text-xl font-heading font-black text-white">14.5% / tahun</span>
          </div>
        </div>
      </div>

      {/* Monitoring List */}
      <div className="bg-slate-950 p-6 rounded-[2.5rem] border border-slate-800 space-y-6">
        <h3 className="font-heading font-black text-sm uppercase tracking-wider text-slate-400">Status Proyek Pembiayaan</h3>

        <div className="space-y-6">
          {activeCampaigns.map((camp) => (
            <div key={camp.id} className="bg-slate-900/60 p-6 rounded-3xl border border-slate-850 space-y-4">
              <div className="flex justify-between items-center text-xs font-bold">
                <div>
                  <h4 className="text-white text-base font-heading font-black leading-tight">{camp.title}</h4>
                  <span className="text-[10px] text-slate-500 font-semibold">Diajukan: {camp.umkm}</span>
                </div>
                <span className={`px-2.5 py-0.5 rounded text-[9px] font-black uppercase border ${
                  camp.status === "Terdanai" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-blue-500/10 text-blue-400 border-blue-500/20"
                }`}>{camp.status}</span>
              </div>

              {/* Progress Slider */}
              <div className="space-y-2 text-xs font-bold">
                <div className="flex justify-between text-slate-400">
                  <span>Terkumpul: Rp {camp.current.toLocaleString("id-ID")}</span>
                  <span>Target: Rp {camp.target.toLocaleString("id-ID")}</span>
                </div>
                <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800/80">
                  <div className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full" style={{ width: `${camp.progress}%` }} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2 text-[10px] font-black uppercase text-slate-400">
                <span>ROI: <strong className="text-white">{camp.roi}% / Tahun</strong></span>
                <span>Progres: <strong className="text-white">{camp.progress}% Terdanai</strong></span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
